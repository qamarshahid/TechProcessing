// Address autocomplete service
// You can replace this with Google Places API, Mapbox, or other services

export interface AddressSuggestion {
  formatted: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Mock address suggestions for demo purposes
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
  },
  {
    formatted: "321 Elm Street, Houston, TX 77001, USA",
    street: "321 Elm Street",
    city: "Houston",
    state: "Texas",
    postalCode: "77001",
    country: "United States"
  },
  {
    formatted: "654 Maple Drive, Phoenix, AZ 85001, USA",
    street: "654 Maple Drive",
    city: "Phoenix",
    state: "Arizona",
    postalCode: "85001",
    country: "United States"
  }
];

export const searchAddresses = async (query: string): Promise<AddressSuggestion[]> => {
  if (query.length < 2) {
    return [];
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Filter mock addresses based on query
  const filtered = mockAddresses.filter(addr => 
    addr.formatted.toLowerCase().includes(query.toLowerCase()) ||
    addr.street.toLowerCase().includes(query.toLowerCase()) ||
    addr.city.toLowerCase().includes(query.toLowerCase()) ||
    addr.state.toLowerCase().includes(query.toLowerCase())
  );

  return filtered.slice(0, 5); // Return max 5 suggestions
};

// For production, replace with actual API calls:
/*
// Google Places API example:
export const searchAddressesWithGoogle = async (query: string): Promise<AddressSuggestion[]> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&key=${GOOGLE_PLACES_API_KEY}`
  );
  
  const data = await response.json();
  return data.predictions.map((prediction: any) => ({
    formatted: prediction.description,
    street: '', // You'd need to geocode to get detailed address
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  }));
};

// Mapbox Geocoding API example:
export const searchAddressesWithMapbox = async (query: string): Promise<AddressSuggestion[]> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=address&limit=5`
  );
  
  const data = await response.json();
  return data.features.map((feature: any) => {
    const context = feature.context || [];
    return {
      formatted: feature.place_name,
      street: feature.properties?.address || '',
      city: context.find((c: any) => c.id.startsWith('place'))?.text || '',
      state: context.find((c: any) => c.id.startsWith('region'))?.text || '',
      postalCode: context.find((c: any) => c.id.startsWith('postcode'))?.text || '',
      country: context.find((c: any) => c.id.startsWith('country'))?.text || 'United States'
    };
  });
};
*/
