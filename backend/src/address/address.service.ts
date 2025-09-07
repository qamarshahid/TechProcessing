import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AddressSuggestion {
  formatted: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(private configService: ConfigService) {}

  private getGooglePlacesApiKey(): string {
    const apiKey = this.configService.get<string>('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not found in environment variables');
    }
    return apiKey;
  }

  async searchAddresses(query: string): Promise<AddressSuggestion[]> {
    if (query.length < 2) {
      return [];
    }

    try {
      const apiKey = this.getGooglePlacesApiKey();
      
      // Use Google Places API Autocomplete
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&key=${apiKey}&components=country:us`
      );

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      // Get detailed information for each place
      const suggestions: AddressSuggestion[] = [];
      
      for (const prediction of data.predictions.slice(0, 5)) {
        try {
          const details = await this.getPlaceDetails(prediction.place_id);
          if (details) {
            suggestions.push(details);
          }
        } catch (error) {
          this.logger.warn(`Failed to get details for place ${prediction.place_id}:`, error);
        }
      }

      return suggestions;
    } catch (error) {
      this.logger.error('Error searching addresses:', error);
      return this.getMockAddresses(query);
    }
  }

  private async getPlaceDetails(placeId: string): Promise<AddressSuggestion | null> {
    try {
      const apiKey = this.getGooglePlacesApiKey();
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,address_components&key=${apiKey}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        return null;
      }

      const result = data.result;
      const components = result.address_components || [];

      // Parse address components
      const streetNumber = components.find(c => c.types.includes('street_number'))?.long_name || '';
      const route = components.find(c => c.types.includes('route'))?.long_name || '';
      const city = components.find(c => c.types.includes('locality'))?.long_name || 
                   components.find(c => c.types.includes('administrative_area_level_2'))?.long_name || '';
      const state = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';
      const postalCode = components.find(c => c.types.includes('postal_code'))?.long_name || '';
      const country = components.find(c => c.types.includes('country'))?.long_name || 'United States';

      return {
        formatted: result.formatted_address,
        street: `${streetNumber} ${route}`.trim(),
        city,
        state,
        postalCode,
        country
      };
    } catch (error) {
      this.logger.error('Error getting place details:', error);
      return null;
    }
  }

  private getMockAddresses(query: string): AddressSuggestion[] {
    const mockAddresses: AddressSuggestion[] = [
      {
        formatted: "123 Main Street, New York, NY 10001, USA",
        street: "123 Main Street",
        city: "New York",
        state: "New York",
        postalCode: "10001",
        country: "United States"
      },
      {
        formatted: "456 Oak Avenue, Los Angeles, CA 90210, USA",
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "California",
        postalCode: "90210",
        country: "United States"
      },
      {
        formatted: "789 Pine Road, Chicago, IL 60601, USA",
        street: "789 Pine Road",
        city: "Chicago",
        state: "Illinois",
        postalCode: "60601",
        country: "United States"
      }
    ];

    // Filter mock addresses based on query
    return mockAddresses.filter(addr => 
      addr.formatted.toLowerCase().includes(query.toLowerCase()) ||
      addr.street.toLowerCase().includes(query.toLowerCase()) ||
      addr.city.toLowerCase().includes(query.toLowerCase()) ||
      addr.state.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }
}
