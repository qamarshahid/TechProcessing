import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServicePackagesService } from './service-packages.service';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('service-packages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('service-packages')
export class ServicePackagesController {
  constructor(private readonly servicePackagesService: ServicePackagesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new service package (Admin only)' })
  @ApiResponse({ status: 201, description: 'Service package created successfully' })
  create(@Body() createServicePackageDto: CreateServicePackageDto, @CurrentUser() currentUser: User) {
    return this.servicePackagesService.create(createServicePackageDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service packages' })
  @ApiResponse({ status: 200, description: 'Service packages retrieved successfully' })
  findAll(@Query('includeInactive') includeInactive?: boolean) {
    return this.servicePackagesService.findAll(includeInactive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service package by ID' })
  @ApiResponse({ status: 200, description: 'Service package retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.servicePackagesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update service package (Admin only)' })
  @ApiResponse({ status: 200, description: 'Service package updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateServicePackageDto: UpdateServicePackageDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.servicePackagesService.update(id, updateServicePackageDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete service package (Admin only)' })
  @ApiResponse({ status: 200, description: 'Service package deleted successfully' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.servicePackagesService.remove(id, currentUser);
  }
}