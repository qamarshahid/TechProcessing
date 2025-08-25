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
import { CloserService } from '../services/closer.service';
import { CreateCloserDto } from '../dto/create-closer.dto';
import { UpdateCloserDto } from '../dto/update-closer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('closers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CloserController {
  constructor(private readonly closerService: CloserService) {}

  @Post()
  create(@Body() createCloserDto: CreateCloserDto) {
    return this.closerService.create(createCloserDto);
  }

  @Get()
  findAll(@CurrentUser() currentUser: User) {
    return this.closerService.findAll(currentUser);
  }

  @Get('active')
  findActive(@CurrentUser() currentUser: User) {
    return this.closerService.findActive(currentUser);
  }

  @Get('stats')
  getAllStats() {
    return this.closerService.getAllClosersStats();
  }

  @Get('stats/filtered')
  getFilteredStats(@Query() query: any) {
    return this.closerService.getFilteredCloserStats(query);
  }

  @Get('audit')
  getAuditData(@Query() query: any) {
    return this.closerService.getCloserAuditData(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.closerService.findOne(id, currentUser);
  }

  @Get(':id/stats')
  getCloserStats(@Param('id') id: string) {
    return this.closerService.getCloserStats(id);
  }

  @Get(':id/monthly-stats')
  getCloserMonthlyStats(@Param('id') id: string) {
    return this.closerService.getCloserMonthlyStats(id);
  }

  @Get(':id/sales')
  getCloserSales(@Param('id') id: string) {
    return this.closerService.getCloserSales(id);
  }

  @Get('debug/sales')
  getDebugSales() {
    return this.closerService.getDebugSales();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCloserDto: UpdateCloserDto) {
    return this.closerService.update(id, updateCloserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.closerService.remove(id);
  }
}
