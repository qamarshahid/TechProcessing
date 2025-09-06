import { Controller, Get, Query } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('search')
  // No authentication required for public address search
  async searchAddresses(@Query('q') query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return await this.addressService.searchAddresses(query.trim());
  }
}
