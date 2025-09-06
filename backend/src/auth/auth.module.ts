import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MfaService } from './mfa.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuditModule } from '../audit/audit.module';
import { EmailModule } from '../email/email.module';
import { SessionTrackingService } from '../common/services/session-tracking.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    AuditModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MfaService, LocalStrategy, JwtStrategy, SessionTrackingService],
  exports: [AuthService, MfaService, SessionTrackingService],
})
export class AuthModule {}