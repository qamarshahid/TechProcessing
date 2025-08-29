import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import { ServiceRequest } from './entities/service-request.entity';
import { PriceAdjustment } from './entities/price-adjustment.entity';
import { FileAttachment } from './entities/file-attachment.entity';
import { ServicePackagesModule } from '../service-packages/service-packages.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRequest, PriceAdjustment, FileAttachment]),
    ServicePackagesModule,
    InvoicesModule,
  ],
  controllers: [ServiceRequestsController],
  providers: [ServiceRequestsService],
  exports: [ServiceRequestsService],
})
export class ServiceRequestsModule {}
