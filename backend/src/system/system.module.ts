import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemController } from './system.controller';
import { SessionTrackingService } from '../common/services/session-tracking.service';
import { User } from '../users/entities/user.entity';
import { Closer } from '../users/entities/closer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Closer])],
  controllers: [SystemController],
  providers: [SessionTrackingService],
  exports: [SessionTrackingService],
})
export class SystemModule {}
