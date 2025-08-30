import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { AgentService } from '../services/agent.service';
import { CreateAgentDto } from '../dto/create-agent.dto';

@ApiTags('agent-management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('agent-management')
export class AgentManagementController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new agent (Admin only)' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  create(@Body() createAgentDto: CreateAgentDto, @CurrentUser() currentUser: User) {
    return this.agentService.createAgent(createAgentDto, currentUser);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all agents (Admin only)' })
  @ApiResponse({ status: 200, description: 'Agents retrieved successfully' })
  findAll(@CurrentUser() currentUser: User) {
    return this.agentService.findAll(currentUser);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get agent by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Agent retrieved successfully' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.agentService.findOne(id, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete agent (Admin only)' })
  @ApiResponse({ status: 200, description: 'Agent deleted successfully' })
  remove(
    @Param('id') id: string, 
    @Body() body: { hardDelete?: boolean },
    @CurrentUser() currentUser: User
  ) {
    return this.agentService.deleteAgent(id, body.hardDelete ?? false, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update agent status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Agent status updated successfully' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
    @CurrentUser() currentUser: User,
  ) {
    return this.agentService.updateAgentStatus(id, body.isActive, currentUser);
  }

  @Patch(':id/commission-rates')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update agent commission rates (Admin only)' })
  @ApiResponse({ status: 200, description: 'Commission rates updated successfully' })
  updateCommissionRates(
    @Param('id') id: string,
    @Body() body: { agentCommissionRate: number; closerCommissionRate: number },
    @CurrentUser() currentUser: User,
  ) {
    return this.agentService.updateAgentCommissionRates(
      id, 
      body.agentCommissionRate, 
      body.closerCommissionRate, 
      currentUser
    );
  }
}
