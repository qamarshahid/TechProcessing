import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private auditService: AuditService,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: User): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
      fullName: createUserDto.fullName,
      role: createUserDto.role || UserRole.CLIENT,
      companyName: createUserDto.companyName,
      address: createUserDto.address,
      communicationDetails: createUserDto.communicationDetails,
    });
    
    const savedUser = await this.usersRepository.save(user);

    // Audit log
    await this.auditService.log({
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: savedUser.id,
      details: { email: savedUser.email, role: savedUser.role },
      user: createdBy,
    });

    return savedUser;
  }

  async findAll(role?: UserRole): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');
    
    if (role) {
      query.where('user.role = :role', { role });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['invoices', 'payments'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy?: User): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    // Audit log
    await this.auditService.log({
      action: 'USER_UPDATED',
      entityType: 'User',
      entityId: updatedUser.id,
      details: updateUserDto,
      user: updatedBy,
    });

    return updatedUser;
  }

  async remove(id: string, deletedBy?: User): Promise<void> {
    const user = await this.findOne(id);
    
    // Soft delete by deactivating
    user.isActive = false;
    await this.usersRepository.save(user);

    // Audit log
    await this.auditService.log({
      action: 'USER_DELETED',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email },
      user: deletedBy,
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, { lastLogin: new Date() });
  }

  async getStats(): Promise<any> {
    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({ where: { isActive: true } });
    const adminUsers = await this.usersRepository.count({ where: { role: UserRole.ADMIN } });
    const clientUsers = await this.usersRepository.count({ where: { role: UserRole.CLIENT } });

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      clientUsers,
    };
  }

  async updateCredentials(id: string, credentialsData: { email?: string; password?: string; sendEmail?: boolean }, updatedBy?: User): Promise<User> {
    const user = await this.findOne(id);
    
    if (credentialsData.email && credentialsData.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: credentialsData.email },
      });
      
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
      user.email = credentialsData.email;
    }

    if (credentialsData.password) {
      user.password = credentialsData.password; // Will be hashed by entity hook
    }

    const updatedUser = await this.usersRepository.save(user);

    // Audit log
    await this.auditService.log({
      action: 'USER_CREDENTIALS_UPDATED',
      entityType: 'User',
      entityId: updatedUser.id,
      details: { 
        emailChanged: credentialsData.email !== undefined,
        passwordChanged: credentialsData.password !== undefined,
        sendEmail: credentialsData.sendEmail 
      },
      user: updatedBy,
    });

    return updatedUser;
  }
}