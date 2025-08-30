import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AgentController } from './controllers/agent.controller';
import { AgentManagementController } from './controllers/agent-management.controller';
import { CloserController } from './controllers/closer.controller';
import { User } from './entities/user.entity';
import { Agent } from './entities/agent.entity';
import { AgentSale } from './entities/agent-sale.entity';
import { Closer } from './entities/closer.entity';
import { AgentService } from './services/agent.service';
import { CloserService } from './services/closer.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Agent, AgentSale, Closer]), AuditModule],
  controllers: [UsersController, AgentController, AgentManagementController, CloserController],
  providers: [UsersService, AgentService, CloserService],
  exports: [UsersService, AgentService, CloserService],
})
export class UsersModule {}