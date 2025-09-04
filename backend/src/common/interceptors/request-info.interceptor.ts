import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Extract IP address from various headers
    const ip = 
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.headers['x-client-ip'] ||
      request.headers['x-forwarded'] ||
      request.headers['forwarded-for'] ||
      request.headers['forwarded'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      '127.0.0.1';
    
    // Extract User Agent
    const userAgent = request.headers['user-agent'] || 'Unknown';
    
    // Add to request object for easy access
    request.clientIp = ip;
    request.userAgent = userAgent;
    
    return next.handle().pipe(
      tap(() => {
        // You can add additional logging here if needed
        console.log(`Request from IP: ${ip}, User-Agent: ${userAgent}`);
      }),
    );
  }
}
