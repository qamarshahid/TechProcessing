import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePackage } from '../common/entities';
import { ServicePackagesController } from './service-packages.controller';
import { ServicePackagesService } from './service-packages.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServicePackage]),
    AuditModule,
  ],
  controllers: [ServicePackagesController],
  providers: [ServicePackagesService],
  exports: [ServicePackagesService, TypeOrmModule],
})
export class ServicePackagesModule {}
