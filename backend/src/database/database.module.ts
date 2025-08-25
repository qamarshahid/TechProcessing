import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Agent } from '../users/entities/agent.entity';
import { AgentSale } from '../users/entities/agent-sale.entity';
import { Closer } from '../users/entities/closer.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { Payment } from '../payments/entities/payment.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { ServicePackage } from '../invoices/entities/service-package.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { PaymentLink } from '../payment-links/entities/payment-link.entity';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sslEnabled = config.get<boolean>('DATABASE_SSL');
        const rejectUnauthorized = config.get<boolean>('DATABASE_SSL_REJECT_UNAUTHORIZED');
        const ssl = sslEnabled ? { rejectUnauthorized: !!rejectUnauthorized } : false;
        return {
          type: 'postgres',
          host: config.get('DATABASE_HOST'),
          port: config.get<number>('DATABASE_PORT'),
          username: config.get('DATABASE_USERNAME'),
          password: config.get('DATABASE_PASSWORD'),
          database: config.get('DATABASE_NAME'),
          entities: [User, Agent, AgentSale, Closer, Invoice, Payment, AuditLog, ServicePackage, Subscription, PaymentLink],
          synchronize: false,
          logging: false,
          ssl,
        };
      },
    }),
  ],
})
export class DatabaseModule {}