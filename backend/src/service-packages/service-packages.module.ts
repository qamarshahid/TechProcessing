import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePackage } from './entities/service-package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePackage])],
  exports: [TypeOrmModule],
})
export class ServicePackagesModule {}
