import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { ServicePackagesController } from './service-packages.controller';
import { ServicePackagesService } from './service-packages.service';
import { Invoice } from './entities/invoice.entity';
import { ServicePackage } from './entities/service-package.entity';
import { AuditModule } from '../audit/audit.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, ServicePackage]), AuditModule, forwardRef(() => PaymentsModule)],
  controllers: [InvoicesController, ServicePackagesController],
  providers: [InvoicesService, ServicePackagesService],
  exports: [InvoicesService, ServicePackagesService],
})
export class InvoicesModule {}