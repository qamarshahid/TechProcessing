import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SessionTrackingService } from '../common/services/session-tracking.service';

@Module({
  controllers: [SystemController],
  providers: [SessionTrackingService],
  exports: [SessionTrackingService],
})
export class SystemModule {}
