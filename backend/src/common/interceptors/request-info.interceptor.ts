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
    
    // Extract IP address from various headers with preference for IPv4
    const forwardedFor = request.headers['x-forwarded-for']?.split(',')[0]?.trim();
    const realIp = request.headers['x-real-ip'];
    const clientIp = request.headers['x-client-ip'];
    
    // Prefer IPv4 addresses over IPv6
    const ipCandidates = [
      forwardedFor,
      realIp,
      clientIp,
      request.headers['x-forwarded'],
      request.headers['forwarded-for'],
      request.headers['forwarded'],
      request.connection?.remoteAddress,
      request.socket?.remoteAddress,
      request.ip,
    ].filter(Boolean);
    
    // Find IPv4 address first, then fall back to IPv6
    let ip = '127.0.0.1';
    const ipv4 = ipCandidates.find(addr => addr && addr.includes('.') && !addr.includes(':'));
    const ipv6 = ipCandidates.find(addr => addr && addr.includes(':'));
    
    ip = ipv4 || ipv6 || '127.0.0.1';
    
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
