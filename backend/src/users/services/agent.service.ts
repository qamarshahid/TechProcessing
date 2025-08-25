import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import { Agent } from '../entities/agent.entity';
import { AgentSale, SaleStatus, CommissionStatus } from '../entities/agent-sale.entity';
import { User } from '../entities/user.entity';
import { Closer } from '../entities/closer.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { CreateAgentSaleDto } from '../dto/create-agent-sale.dto';
import { AuditService } from '../../audit/audit.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(AgentSale)
    private agentSaleRepository: Repository<AgentSale>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Closer)
    private closerRepository: Repository<Closer>,
    private auditService: AuditService,
  ) {}

  async createAgent(createAgentDto: CreateAgentDto, createdBy: User): Promise<Agent> {
    // Only admins can create agents
    if (createdBy.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create agents');
    }

    // Check if agent code already exists
    const existingAgent = await this.agentRepository.findOne({
      where: { agentCode: createAgentDto.agentCode },
    });
    if (existingAgent) {
      throw new BadRequestException('Agent code already exists');
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createAgentDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Create user account
    const user = this.userRepository.create({
      email: createAgentDto.email,
      password: createAgentDto.password,
      fullName: createAgentDto.fullName,
      role: UserRole.AGENT,
      companyName: createAgentDto.companyName,
      isActive: createAgentDto.isActive ?? true,
    });
    await this.userRepository.save(user);

    // Create agent profile
    const agent = this.agentRepository.create({
      userId: user.id,
      agentCode: createAgentDto.agentCode,
      salesPersonName: createAgentDto.salesPersonName,
      closerName: createAgentDto.closerName,
      agentCommissionRate: createAgentDto.agentCommissionRate ?? 6.00,
      closerCommissionRate: createAgentDto.closerCommissionRate ?? 10.00,
    });
    const savedAgent = await this.agentRepository.save(agent);

    // Audit log
    await this.auditService.log({
      action: 'AGENT_CREATED',
      entityType: 'Agent',
      entityId: savedAgent.id,
      details: { agentCode: createAgentDto.agentCode, email: createAgentDto.email },
      user: createdBy,
    });

    return this.findOne(savedAgent.id);
  }

  async findAll(currentUser: User): Promise<Agent[]> {
    // Admins can see all agents, agents can only see themselves
    if (currentUser.role === UserRole.ADMIN) {
      return this.agentRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    } else if (currentUser.role === UserRole.AGENT) {
      return this.agentRepository.find({
        where: { userId: currentUser.id },
        relations: ['user'],
      });
    }
    throw new ForbiddenException('Access denied');
  }

  async findOne(id: string, currentUser?: User): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['user', 'sales'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // Security check: agents can only see their own data
    if (currentUser && currentUser.role === UserRole.AGENT && agent.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied');
    }

    return agent;
  }

  async findByUserId(userId: string, currentUser: User): Promise<Agent> {
    // Security check: agents can only see their own data
    if (currentUser.role === UserRole.AGENT && currentUser.id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const agent = await this.agentRepository.findOne({
      where: { userId },
      relations: ['user', 'sales'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  async createSale(createSaleDto: CreateAgentSaleDto, currentUser: User): Promise<AgentSale> {
    // Get agent profile
    const agent = await this.findByUserId(currentUser.id, currentUser);

    // Get closer if closerId is provided
             let closer = null;
         let closerName = createSaleDto.closerName;
         let closerCommissionRate = agent.closerCommissionRate;

         if (createSaleDto.closerId) {
           closer = await this.closerRepository.findOne({
             where: { id: createSaleDto.closerId },
           });

           if (closer) {
             closerName = closer.closerName;
             closerCommissionRate = closer.commissionRate;
           }
         }

    // Generate sale reference
    const saleReference = `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate commissions
    const agentCommission = (createSaleDto.saleAmount * agent.agentCommissionRate) / 100;
    const closerCommission = (createSaleDto.saleAmount * closerCommissionRate) / 100;
    const totalCommission = agentCommission + closerCommission;

    // Create sale record
               const sale = this.agentSaleRepository.create({
             agentId: agent.id,
             closerId: closer?.id || null,
             saleReference,
      clientName: createSaleDto.clientName,
      clientEmail: createSaleDto.clientEmail,
      clientPhone: createSaleDto.clientPhone,
      closerName,
      serviceName: createSaleDto.serviceName,
      serviceDescription: createSaleDto.serviceDescription,
      saleAmount: createSaleDto.saleAmount,
      agentCommissionRate: agent.agentCommissionRate,
      closerCommissionRate,
      agentCommission,
      closerCommission,
      totalCommission,
      saleStatus: createSaleDto.saleStatus ?? SaleStatus.PENDING,
      commissionStatus: CommissionStatus.PENDING,
      saleDate: createSaleDto.saleDate ? new Date(createSaleDto.saleDate) : new Date(),
      paymentDate: createSaleDto.paymentDate ? new Date(createSaleDto.paymentDate) : null,
      notes: createSaleDto.notes,
      clientDetails: createSaleDto.clientDetails,
      metadata: createSaleDto.metadata,
    });

    const savedSale = await this.agentSaleRepository.save(sale);

    // Update agent statistics
    await this.updateAgentStats(agent.id);

    // Audit log
    await this.auditService.log({
      action: 'AGENT_SALE_CREATED',
      entityType: 'AgentSale',
      entityId: savedSale.id,
      details: { 
        saleReference, 
        saleAmount: createSaleDto.saleAmount,
        totalCommission,
        clientName: createSaleDto.clientName 
      },
      user: currentUser,
    });

    return this.findSaleById(savedSale.id, currentUser);
  }

  async findSales(agentId: string, currentUser: User): Promise<AgentSale[]> {
    // Security check: agents can only see their own sales
    if (currentUser.role === UserRole.AGENT) {
      const agent = await this.findByUserId(currentUser.id, currentUser);
      if (agent.id !== agentId) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.agentSaleRepository.find({
      where: { agentId },
      relations: ['agent', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllSales(currentUser: User): Promise<AgentSale[]> {
    // Only admins can see all sales
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view all agent sales');
    }

    return this.agentSaleRepository.find({
      relations: ['agent', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findSaleById(id: string, currentUser: User): Promise<AgentSale> {
    const sale = await this.agentSaleRepository.findOne({
      where: { id },
      relations: ['agent', 'client'],
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Security check: agents can only see their own sales
    if (currentUser.role === UserRole.AGENT && sale.agent.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied');
    }

    return sale;
  }

  async updateSaleStatus(id: string, status: SaleStatus, currentUser: User): Promise<AgentSale> {
    const sale = await this.findSaleById(id, currentUser);

    // Only admins can update sale status
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update sale status');
    }

    sale.saleStatus = status;
    const updatedSale = await this.agentSaleRepository.save(sale);

    // Update agent statistics
    await this.updateAgentStats(sale.agentId);

    // Audit log
    await this.auditService.log({
      action: 'AGENT_SALE_STATUS_UPDATED',
      entityType: 'AgentSale',
      entityId: sale.id,
      details: { oldStatus: sale.saleStatus, newStatus: status },
      user: currentUser,
    });

    return updatedSale;
  }

  async updateCommissionStatus(id: string, status: CommissionStatus, currentUser: User): Promise<AgentSale> {
    const sale = await this.findSaleById(id, currentUser);

    // Only admins can update commission status
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update commission status');
    }

    sale.commissionStatus = status;
    if (status === CommissionStatus.PAID) {
      sale.commissionPaidDate = new Date();
    }

    const updatedSale = await this.agentSaleRepository.save(sale);

    // Update agent statistics
    await this.updateAgentStats(sale.agentId);

    // Audit log
    await this.auditService.log({
      action: 'AGENT_COMMISSION_STATUS_UPDATED',
      entityType: 'AgentSale',
      entityId: sale.id,
      details: { oldStatus: sale.commissionStatus, newStatus: status },
      user: currentUser,
    });

    return updatedSale;
  }

  async updateSaleNotes(id: string, notes: string, currentUser: User): Promise<AgentSale> {
    const sale = await this.findSaleById(id, currentUser);

    // Only admins can update sale notes
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update sale notes');
    }

    sale.notes = notes;
    const updatedSale = await this.agentSaleRepository.save(sale);

    // Audit log
    await this.auditService.log({
      action: 'AGENT_SALE_NOTES_UPDATED',
      entityType: 'AgentSale',
      entityId: sale.id,
      details: { notes },
      user: currentUser,
    });

    return updatedSale;
  }

  async resubmitSale(resubmitDto: any, currentUser: User): Promise<AgentSale> {
    // Get agent profile
    const agent = await this.findByUserId(currentUser.id, currentUser);

    // Find the original sale
    const originalSale = await this.agentSaleRepository.findOne({
      where: { id: resubmitDto.originalSaleId },
      relations: ['agent'],
    });

    if (!originalSale) {
      throw new NotFoundException('Original sale not found');
    }

    // Security check: agents can only resubmit their own rejected sales
    if (originalSale.agentId !== agent.id) {
      throw new ForbiddenException('You can only resubmit your own sales');
    }

    if (originalSale.saleStatus !== SaleStatus.REJECTED) {
      throw new BadRequestException('Only rejected sales can be resubmitted');
    }

    // Check if this sale has already been resubmitted
    const existingResubmission = await this.agentSaleRepository.findOne({
      where: { originalSaleId: originalSale.id }
    });

    if (existingResubmission) {
      throw new BadRequestException('This sale has already been resubmitted and cannot be resubmitted again');
    }

    // Calculate changes made
    const changesMade = this.calculateChanges(originalSale, resubmitDto);

    // Generate new sale reference
    const saleReference = `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate commissions
    const agentCommission = (resubmitDto.saleAmount * agent.agentCommissionRate) / 100;
    const closerCommission = (resubmitDto.saleAmount * agent.closerCommissionRate) / 100;
    const totalCommission = agentCommission + closerCommission;

    // Create resubmitted sale record
    const resubmittedSale = this.agentSaleRepository.create({
      agentId: agent.id,
      originalSaleId: originalSale.id,
      saleReference,
      clientName: resubmitDto.clientName,
      clientEmail: resubmitDto.clientEmail,
      clientPhone: resubmitDto.clientPhone,
      closerName: resubmitDto.closerName,
      serviceName: resubmitDto.serviceName,
      serviceDescription: resubmitDto.serviceDescription,
      saleAmount: resubmitDto.saleAmount,
      agentCommissionRate: agent.agentCommissionRate,
      closerCommissionRate: agent.closerCommissionRate,
      agentCommission,
      closerCommission,
      totalCommission,
      saleStatus: SaleStatus.RESUBMITTED,
      commissionStatus: CommissionStatus.PENDING,
      saleDate: resubmitDto.saleDate ? new Date(resubmitDto.saleDate) : new Date(),
      paymentDate: resubmitDto.paymentDate ? new Date(resubmitDto.paymentDate) : null,
      notes: resubmitDto.notes,
      changesMade,
      resubmissionCount: originalSale.resubmissionCount + 1,
    });

    const savedSale = await this.agentSaleRepository.save(resubmittedSale);

    // Update agent statistics
    await this.updateAgentStats(agent.id);

    // Audit log
    await this.auditService.log({
      action: 'AGENT_SALE_RESUBMITTED',
      entityType: 'AgentSale',
      entityId: savedSale.id,
      details: { 
        originalSaleId: originalSale.id,
        changesMade,
        resubmissionCount: savedSale.resubmissionCount
      },
      user: currentUser,
    });

    return this.findSaleById(savedSale.id, currentUser);
  }

  private calculateChanges(originalSale: AgentSale, resubmitDto: any): any {
    const changes: any = {};

    if (originalSale.clientName !== resubmitDto.clientName) {
      changes.clientName = {
        from: originalSale.clientName,
        to: resubmitDto.clientName
      };
    }

    if (originalSale.clientEmail !== resubmitDto.clientEmail) {
      changes.clientEmail = {
        from: originalSale.clientEmail,
        to: resubmitDto.clientEmail
      };
    }

    if (originalSale.clientPhone !== resubmitDto.clientPhone) {
      changes.clientPhone = {
        from: originalSale.clientPhone,
        to: resubmitDto.clientPhone
      };
    }

    if (originalSale.closerName !== resubmitDto.closerName) {
      changes.closerName = {
        from: originalSale.closerName,
        to: resubmitDto.closerName
      };
    }

    if (originalSale.serviceName !== resubmitDto.serviceName) {
      changes.serviceName = {
        from: originalSale.serviceName,
        to: resubmitDto.serviceName
      };
    }

    if (originalSale.serviceDescription !== resubmitDto.serviceDescription) {
      changes.serviceDescription = {
        from: originalSale.serviceDescription,
        to: resubmitDto.serviceDescription
      };
    }

    if (Number(originalSale.saleAmount) !== resubmitDto.saleAmount) {
      changes.saleAmount = {
        from: originalSale.saleAmount,
        to: resubmitDto.saleAmount
      };
    }

    return changes;
  }

  private async updateAgentStats(agentId: string): Promise<void> {
    const sales = await this.agentSaleRepository.find({
      where: { agentId, saleStatus: SaleStatus.APPROVED },
    });

    const totalSales = sales.length;
    const totalSalesValue = sales.reduce((sum, sale) => sum + Number(sale.saleAmount), 0);
    // Only count agent commission (6%) for earnings, not total commission
    const totalEarnings = sales.reduce((sum, sale) => sum + Number(sale.agentCommission), 0);
    const totalPaidOut = sales
      .filter(sale => sale.commissionStatus === CommissionStatus.PAID)
      .reduce((sum, sale) => sum + Number(sale.agentCommission), 0);
    const pendingCommission = totalEarnings - totalPaidOut;

    await this.agentRepository.update(agentId, {
      totalSales,
      totalSalesValue,
      totalEarnings,
      totalPaidOut,
      pendingCommission,
    });
  }

  async getAgentStats(currentUser: User): Promise<any> {
    if (currentUser.role === UserRole.ADMIN) {
      // Admin sees all agents stats
      const agents = await this.agentRepository.find({
        relations: ['user'],
      });

      const totalAgents = agents.length;
      const activeAgents = agents.filter(agent => agent.isActive).length;
      const totalSales = agents.reduce((sum, agent) => sum + agent.totalSales, 0);
      const totalSalesValue = agents.reduce((sum, agent) => sum + Number(agent.totalSalesValue), 0);
      const totalCommissions = agents.reduce((sum, agent) => sum + Number(agent.totalEarnings), 0);
      const totalPaidOut = agents.reduce((sum, agent) => sum + Number(agent.totalPaidOut), 0);
      const pendingCommissions = agents.reduce((sum, agent) => sum + Number(agent.pendingCommission), 0);

      return {
        totalAgents,
        activeAgents,
        totalSales,
        totalSalesValue,
        totalCommissions,
        totalPaidOut,
        pendingCommissions,
        agents,
      };
    } else if (currentUser.role === UserRole.AGENT) {
      // Agent sees only their own stats
      const agent = await this.findByUserId(currentUser.id, currentUser);
      const monthlyStats = await this.getAgentMonthlyStats(agent.id);
      
      return {
        agent,
        sales: await this.findSales(agent.id, currentUser),
        monthlyStats,
      };
    }

    throw new ForbiddenException('Access denied');
  }

  async getAgentMonthlyStats(agentId: string): Promise<any> {
    // Get current month and year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11

    // Get approved sales for the last 12 months
    const monthlyStats = [];
    
    for (let i = 0; i < 12; i++) {
      const targetDate = new Date(currentYear, currentMonth - 1 - i, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;
      
      // Get start and end of month
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      // Query sales for this month
      const sales = await this.agentSaleRepository.find({
        where: {
          agentId,
          saleStatus: SaleStatus.APPROVED,
          saleDate: Between(startOfMonth, endOfMonth),
        },
      });

      // Calculate stats for this month
      const totalSales = sales.length;
      const totalSalesValue = sales.reduce((sum, sale) => sum + Number(sale.saleAmount), 0);
      const totalCommission = sales.reduce((sum, sale) => sum + Number(sale.agentCommission), 0);
      const paidCommission = sales
        .filter(sale => sale.commissionStatus === CommissionStatus.PAID)
        .reduce((sum, sale) => sum + Number(sale.agentCommission), 0);
      const pendingCommission = totalCommission - paidCommission;

      monthlyStats.push({
        year,
        month,
        monthName: targetDate.toLocaleDateString('en-US', { month: 'long' }),
        totalSales,
        totalSalesValue,
        totalCommission,
        paidCommission,
        pendingCommission,
        isCurrentMonth: i === 0,
      });
    }

    return monthlyStats;
  }

  async updateAgentCommissionRates(
    agentId: string, 
    agentCommissionRate: number, 
    closerCommissionRate: number, 
    currentUser: User
  ): Promise<Agent> {
    // Only admins can update commission rates
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update commission rates');
    }

    const agent = await this.agentRepository.findOne({
      where: { id: agentId },
      relations: ['user'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // Validate commission rates
    if (agentCommissionRate < 0 || agentCommissionRate > 100) {
      throw new BadRequestException('Agent commission rate must be between 0 and 100');
    }

    if (closerCommissionRate < 0 || closerCommissionRate > 100) {
      throw new BadRequestException('Closer commission rate must be between 0 and 100');
    }

    // Update commission rates
    agent.agentCommissionRate = agentCommissionRate;
    agent.closerCommissionRate = closerCommissionRate;

    const updatedAgent = await this.agentRepository.save(agent);

    // Recalculate all pending sales with new commission rates
    await this.recalculatePendingSalesCommission(agentId);

    // Update agent statistics
    await this.updateAgentStats(agentId);

    // Audit log
    await this.auditService.log({
      action: 'AGENT_COMMISSION_RATES_UPDATED',
      entityType: 'Agent',
      entityId: agent.id,
      details: { 
        oldAgentRate: agent.agentCommissionRate,
        newAgentRate: agentCommissionRate,
        oldCloserRate: agent.closerCommissionRate,
        newCloserRate: closerCommissionRate
      },
      user: currentUser,
    });

    return updatedAgent;
  }

  private async recalculatePendingSalesCommission(agentId: string): Promise<void> {
    // Get all pending sales for this agent
    const pendingSales = await this.agentSaleRepository.find({
      where: { 
        agentId, 
        saleStatus: In([SaleStatus.PENDING, SaleStatus.RESUBMITTED]) 
      },
    });

    // Recalculate commission for each pending sale
    for (const sale of pendingSales) {
      const agent = await this.agentRepository.findOne({
        where: { id: agentId }
      });

      if (agent) {
        sale.agentCommissionRate = agent.agentCommissionRate;
        sale.closerCommissionRate = agent.closerCommissionRate;
        sale.agentCommission = (sale.saleAmount * agent.agentCommissionRate) / 100;
        sale.closerCommission = (sale.saleAmount * agent.closerCommissionRate) / 100;
        sale.totalCommission = sale.agentCommission + sale.closerCommission;

        await this.agentSaleRepository.save(sale);
      }
    }
  }
}
