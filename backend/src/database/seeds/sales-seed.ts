import { DataSource } from 'typeorm';
import { AgentSale, SaleStatus, CommissionStatus } from '../../users/entities/agent-sale.entity';
import { Closer } from '../../users/entities/closer.entity';
import { Agent } from '../../users/entities/agent.entity';

export async function seedSales(dataSource: DataSource) {
  const salesRepository = dataSource.getRepository(AgentSale);
  const closerRepository = dataSource.getRepository(Closer);
  const agentRepository = dataSource.getRepository(Agent);

  console.log('🌱 Seeding sales...');

  // Check if sales already exist
  const existingSales = await salesRepository.count();
  
  if (existingSales > 0) {
    console.log('✅ Sales already exist, skipping...');
    return;
  }

  // Get existing closers and agents
  const closers = await closerRepository.find();
  const agents = await agentRepository.find();

  if (closers.length === 0) {
    console.log('❌ No closers found, cannot seed sales');
    return;
  }

  if (agents.length === 0) {
    console.log('❌ No agents found, cannot seed sales');
    return;
  }

  // Create sample sales
  const sales = [
    {
      agentId: agents[0].id,
      closerId: closers[0].id,
      closerName: closers[0].closerName,
      saleReference: 'SALE-001',
      clientName: 'Acme Corporation',
      clientEmail: 'contact@acme.com',
      clientPhone: '+1-555-0001',
      serviceName: 'Business Website',
      serviceDescription: 'Professional website with e-commerce features',
      saleAmount: 2500.00,
      agentCommissionRate: 6.00,
      closerCommissionRate: closers[0].commissionRate,
      agentCommission: 150.00,
      closerCommission: 250.00,
      totalCommission: 400.00,
      saleStatus: SaleStatus.APPROVED,
      commissionStatus: CommissionStatus.PAID,
      saleDate: new Date('2025-08-15')
    },
    {
      agentId: agents[0].id,
      closerId: closers[0].id,
      closerName: closers[0].closerName,
      saleReference: 'SALE-002',
      clientName: 'TechStart Inc',
      clientEmail: 'info@techstart.com',
      clientPhone: '+1-555-0002',
      serviceName: 'Enterprise Application',
      serviceDescription: 'Custom CRM system development',
      saleAmount: 8000.00,
      agentCommissionRate: 6.00,
      closerCommissionRate: closers[0].commissionRate,
      agentCommission: 480.00,
      closerCommission: 800.00,
      totalCommission: 1280.00,
      saleStatus: SaleStatus.APPROVED,
      commissionStatus: CommissionStatus.APPROVED,
      saleDate: new Date('2025-08-20')
    },
    {
      agentId: agents[0].id,
      closerId: closers[1].id,
      closerName: closers[1].closerName,
      saleReference: 'SALE-003',
      clientName: 'Global Solutions',
      clientEmail: 'sales@globalsolutions.com',
      clientPhone: '+1-555-0003',
      serviceName: 'Starter Website',
      serviceDescription: 'Basic website for small business',
      saleAmount: 1200.00,
      agentCommissionRate: 6.00,
      closerCommissionRate: closers[1].commissionRate,
      agentCommission: 72.00,
      closerCommission: 144.00,
      totalCommission: 216.00,
      saleStatus: SaleStatus.PENDING,
      commissionStatus: CommissionStatus.PENDING,
      saleDate: new Date('2025-08-22')
    },
    {
      agentId: agents[0].id,
      closerId: closers[2].id,
      closerName: closers[2].closerName,
      saleReference: 'SALE-004',
      clientName: 'Innovation Labs',
      clientEmail: 'hello@innovationlabs.com',
      clientPhone: '+1-555-0004',
      serviceName: 'Enterprise Application',
      serviceDescription: 'AI-powered analytics platform',
      saleAmount: 15000.00,
      agentCommissionRate: 6.00,
      closerCommissionRate: closers[2].commissionRate,
      agentCommission: 900.00,
      closerCommission: 1275.00,
      totalCommission: 2175.00,
      saleStatus: SaleStatus.APPROVED,
      commissionStatus: CommissionStatus.PAID,
      saleDate: new Date('2025-08-18')
    }
  ];

  for (const saleData of sales) {
    const sale = salesRepository.create(saleData);
    await salesRepository.save(sale);
  }

  console.log('✅ Sales seeded successfully!');
  console.log(`📊 Created ${sales.length} sales`);
  console.log(`💰 Total sales value: $${sales.reduce((sum, sale) => sum + sale.saleAmount, 0).toLocaleString()}`);
}
