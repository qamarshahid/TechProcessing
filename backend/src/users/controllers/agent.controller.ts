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
import { CloserService } from '../services/closer.service';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { CreateAgentSaleDto } from '../dto/create-agent-sale.dto';
import { ResubmitAgentSaleDto } from '../dto/resubmit-agent-sale.dto';
import { SaleStatus, CommissionStatus } from '../entities/agent-sale.entity';

@ApiTags('agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('agents')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly closerService: CloserService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new agent (Admin only)' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  create(@Body() createAgentDto: CreateAgentDto, @CurrentUser() currentUser: User) {
    return this.agentService.createAgent(createAgentDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents (Admin) or own profile (Agent)' })
  @ApiResponse({ status: 200, description: 'Agents retrieved successfully' })
  findAll(@CurrentUser() currentUser: User) {
    return this.agentService.findAll(currentUser);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get agent statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStats(@CurrentUser() currentUser: User) {
    return this.agentService.getAgentStats(currentUser);
  }

  @Get('monthly-stats')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get agent monthly commission stats (Agent only)' })
  @ApiResponse({ status: 200, description: 'Monthly stats retrieved successfully' })
  async getMonthlyStats(@CurrentUser() currentUser: User) {
    const agent = await this.agentService.findByUserId(currentUser.id, currentUser);
    return this.agentService.getAgentMonthlyStats(agent.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  @ApiResponse({ status: 200, description: 'Agent retrieved successfully' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.agentService.findOne(id, currentUser);
  }

  @Get('profile/me')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get own agent profile (Agent only)' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  getOwnProfile(@CurrentUser() currentUser: User) {
    return this.agentService.findByUserId(currentUser.id, currentUser);
  }

  @Get('closers/active')
  @ApiOperation({ summary: 'Get active closers for dropdown' })
  @ApiResponse({ status: 200, description: 'Active closers retrieved successfully' })
  getActiveClosers(@CurrentUser() currentUser: User) {
    return this.closerService.findActive(currentUser);
  }

  @Post('sales')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Create a new sale (Agent only)' })
  @ApiResponse({ status: 201, description: 'Sale created successfully' })
  createSale(@Body() createSaleDto: CreateAgentSaleDto, @CurrentUser() currentUser: User) {
    return this.agentService.createSale(createSaleDto, currentUser);
  }

  @Post('sales/resubmit')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Resubmit a rejected sale with changes (Agent only)' })
  @ApiResponse({ status: 201, description: 'Sale resubmitted successfully' })
  resubmitSale(@Body() resubmitDto: ResubmitAgentSaleDto, @CurrentUser() currentUser: User) {
    return this.agentService.resubmitSale(resubmitDto, currentUser);
  }

  @Get('sales/all')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all agent sales (Admin only)' })
  @ApiResponse({ status: 200, description: 'All sales retrieved successfully' })
  getAllSales(@CurrentUser() currentUser: User) {
    return this.agentService.findAllSales(currentUser);
  }

  @Get('sales/me')
  @Roles(UserRole.AGENT)
  @ApiOperation({ summary: 'Get own sales (Agent only)' })
  @ApiResponse({ status: 200, description: 'Sales retrieved successfully' })
  async getOwnSales(@CurrentUser() currentUser: User) {
    const agent = await this.agentService.findByUserId(currentUser.id, currentUser);
    return this.agentService.findSales(agent.id, currentUser);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales for agent' })
  @ApiResponse({ status: 200, description: 'Sales retrieved successfully' })
  getSales(@Query('agentId') agentId: string, @CurrentUser() currentUser: User) {
    return this.agentService.findSales(agentId, currentUser);
  }

  @Get('sales/:id')
  @ApiOperation({ summary: 'Get sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale retrieved successfully' })
  getSale(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.agentService.findSaleById(id, currentUser);
  }

  @Patch('sales/:id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update sale status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Sale status updated successfully' })
  updateSaleStatus(
    @Param('id') id: string,
    @Body('status') status: SaleStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.agentService.updateSaleStatus(id, status, currentUser);
  }

  @Patch('sales/:id/commission-status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update commission status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Commission status updated successfully' })
  updateCommissionStatus(
    @Param('id') id: string,
    @Body('status') status: CommissionStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.agentService.updateCommissionStatus(id, status, currentUser);
  }

  @Patch('sales/:id/notes')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update sale notes (Admin only)' })
  @ApiResponse({ status: 200, description: 'Sale notes updated successfully' })
  updateSaleNotes(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.agentService.updateSaleNotes(id, notes, currentUser);
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

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update agent status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Agent status updated successfully' })
  updateAgentStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
    @CurrentUser() currentUser: User,
  ) {
    return this.agentService.updateAgentStatus(id, body.isActive, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete agent (Admin only)' })
  @ApiResponse({ status: 200, description: 'Agent deleted successfully' })
  deleteAgent(
    @Param('id') id: string,
    @Body() body: { hardDelete?: boolean },
    @CurrentUser() currentUser: User,
  ) {
    return this.agentService.deleteAgent(id, body.hardDelete ?? false, currentUser);
  }

}
