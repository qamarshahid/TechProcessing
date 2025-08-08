import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AuthorizeNetService } from './services/authorize-net.service';
import { HostedPaymentService } from './services/hosted-payment.service';
import { Payment } from './entities/payment.entity';
import { InvoicesModule } from '../invoices/invoices.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ConfigModule,
    InvoicesModule,
    AuditModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, AuthorizeNetService, HostedPaymentService],
  exports: [PaymentsService],
})
export class PaymentsModule {}