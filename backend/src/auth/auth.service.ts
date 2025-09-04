import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      if (await user.validatePassword(password)) {
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Audit log with IP and User Agent
    await this.auditService.log({
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      details: { 
        email: user.email,
        ipAddress,
        userAgent,
      },
      user: user,
      ipAddress,
      userAgent,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string) {
    try {
      const user = await this.usersService.create(registerDto);
      
      const payload = { 
        email: user.email, 
        sub: user.id, 
        role: user.role 
      };

      // Audit log with IP and User Agent
      await this.auditService.log({
        action: 'USER_REGISTERED',
        entityType: 'User',
        entityId: user.id,
        details: { 
          email: user.email, 
          role: user.role,
          ipAddress,
          userAgent,
        },
        user: user,
        ipAddress,
        userAgent,
      });

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    const { password, ...profile } = user;
    return profile;
  }
}