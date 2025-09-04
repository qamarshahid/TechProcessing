import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SessionTrackingService } from '../services/session-tracking.service';
import { Request } from 'express';

@Injectable()
export class SessionTrackingInterceptor implements NestInterceptor {
  constructor(private sessionTrackingService: SessionTrackingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user;

    // Only track authenticated users
    if (user) {
      const sessionId = this.sessionTrackingService.getSessionIdFromRequest(request);
      const ipAddress = (request as any).clientIp || request.ip || 'Unknown';
      const userAgent = request.headers['user-agent'] || 'Unknown';

      // Update user activity
      this.sessionTrackingService.updateActivity(sessionId);
    }

    return next.handle().pipe(
      tap(() => {
        // Activity updated in the intercept method above
      })
    );
  }
}
