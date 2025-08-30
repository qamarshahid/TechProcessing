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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() currentUser: User) {
    return this.usersService.create(createUserDto, currentUser);
  }

  @Post('create-agent')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new agent (Admin only)' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  createAgent(@Body() agentData: any, @CurrentUser() currentUser: User) {
    return this.usersService.createAgent(agentData, currentUser);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll(@Query('role') role?: UserRole) {
    return this.usersService.findAll(role);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  getCurrentUser(@CurrentUser() currentUser: User) {
    return this.usersService.findOne(currentUser.id);
  }
  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.update(id, updateUserDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(
    @Param('id') id: string, 
    @Body() body: { hardDelete?: boolean },
    @CurrentUser() currentUser: User
  ) {
    return this.usersService.remove(id, body.hardDelete ?? false, currentUser);
  }

  @Patch(':id/credentials')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user credentials (Admin only)' })
  @ApiResponse({ status: 200, description: 'User credentials updated successfully' })
  updateCredentials(
    @Param('id') id: string,
    @Body() credentialsData: { email?: string; password?: string; sendEmail?: boolean },
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.updateCredentials(id, credentialsData, currentUser);
  }
}