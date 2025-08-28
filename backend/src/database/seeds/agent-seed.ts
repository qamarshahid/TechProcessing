import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Agent } from '../../users/entities/agent.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

export async function seedAgents(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const agentRepository = dataSource.getRepository(Agent);

  console.log('🌱 Seeding agents...');

  // Check if agent already exists
  const existingAgent = await userRepository.findOne({
    where: { email: 'agent1@techprocessing.com' }
  });

  if (existingAgent) {
    console.log('✅ Agent already exists, skipping...');
    return;
  }

  // Create agent user
  const hashedPassword = await bcrypt.hash('agent123', 12);
  
  const agentUser = userRepository.create({
    email: 'agent1@techprocessing.com',
    password: hashedPassword,
    fullName: 'John Agent',
    role: UserRole.AGENT,
    companyName: 'Tech Processing LLC',
    isActive: true,
  });

  const savedUser = await userRepository.save(agentUser);

  // Create agent profile
  const agent = agentRepository.create({
    userId: savedUser.id,
    agentCode: 'AG001',
    salesPersonName: 'John Agent',
    closerName: 'John Agent',
    agentCommissionRate: 6.00,
    closerCommissionRate: 10.00,
    isActive: true,
  });

  await agentRepository.save(agent);

  console.log('✅ Agent seeded successfully!');
  console.log('📧 Email: agent1@techprocessing.com');
  console.log('🔑 Password: [REDACTED - Check environment variables]');
  console.log('🆔 Agent Code: AG001');
}
