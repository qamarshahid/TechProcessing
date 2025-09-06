import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard) // Optional: Add authentication if needed
  async searchAddresses(@Query('q') query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return await this.addressService.searchAddresses(query.trim());
  }
}
