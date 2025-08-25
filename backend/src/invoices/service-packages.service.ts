import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicePackage } from './entities/service-package.entity';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';
import { User } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ServicePackagesService {
  constructor(
    @InjectRepository(ServicePackage)
    private servicePackagesRepository: Repository<ServicePackage>,
    private auditService: AuditService,
  ) {}

  async create(createServicePackageDto: CreateServicePackageDto, createdBy: User): Promise<ServicePackage> {
    const servicePackage = this.servicePackagesRepository.create(createServicePackageDto);
    const savedServicePackage = await this.servicePackagesRepository.save(servicePackage);

    // Audit log
    await this.auditService.log({
      action: 'SERVICE_PACKAGE_CREATED',
      entityType: 'ServicePackage',
      entityId: savedServicePackage.id,
      details: { name: savedServicePackage.name, price: savedServicePackage.price },
      user: createdBy,
    });

    return savedServicePackage;
  }

  async findAll(includeInactive: boolean = false): Promise<ServicePackage[]> {
    const query = this.servicePackagesRepository.createQueryBuilder('servicePackage');
    
    if (!includeInactive) {
      query.where('servicePackage.isActive = :isActive', { isActive: true });
    }

    query.orderBy('servicePackage.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<ServicePackage> {
    const servicePackage = await this.servicePackagesRepository.findOne({
      where: { id },
    });

    if (!servicePackage) {
      throw new NotFoundException('Service package not found');
    }

    return servicePackage;
  }

  async update(id: string, updateServicePackageDto: UpdateServicePackageDto, updatedBy: User): Promise<ServicePackage> {
    const servicePackage = await this.findOne(id);

    Object.assign(servicePackage, updateServicePackageDto);
    const updatedServicePackage = await this.servicePackagesRepository.save(servicePackage);

    // Audit log
    await this.auditService.log({
      action: 'SERVICE_PACKAGE_UPDATED',
      entityType: 'ServicePackage',
      entityId: updatedServicePackage.id,
      details: updateServicePackageDto,
      user: updatedBy,
    });

    return updatedServicePackage;
  }

  async remove(id: string, deletedBy: User): Promise<void> {
    const servicePackage = await this.findOne(id);
    
    // Soft delete by deactivating
    servicePackage.isActive = false;
    await this.servicePackagesRepository.save(servicePackage);

    // Audit log
    await this.auditService.log({
      action: 'SERVICE_PACKAGE_DELETED',
      entityType: 'ServicePackage',
      entityId: servicePackage.id,
      details: { name: servicePackage.name },
      user: deletedBy,
    });
  }
}