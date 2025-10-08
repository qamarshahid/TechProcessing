import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { AuditModule } from '../audit/audit.module';
import { ServicePackagesModule } from '../service-packages/service-packages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    AuditModule,
    ServicePackagesModule, // Import for relationships
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
