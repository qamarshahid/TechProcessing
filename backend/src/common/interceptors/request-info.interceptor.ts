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
    
    // Extract real client IP address with proper Cloud Run handling
    const getClientIp = () => {
      // Cloud Run specific headers
      const cloudRunHeaders = [
        request.headers['x-forwarded-for'],
        request.headers['x-real-ip'],
        request.headers['x-client-ip'],
        request.headers['x-forwarded'],
        request.headers['forwarded-for'],
        request.headers['forwarded'],
        request.headers['cf-connecting-ip'], // Cloudflare
        request.headers['x-cluster-client-ip'],
        request.headers['x-forwarded-host'],
      ];
      
      // Extract IPs from headers
      const ips = cloudRunHeaders
        .filter(Boolean)
        .flatMap(header => {
          if (typeof header === 'string') {
            return header.split(',').map(ip => ip.trim());
          }
          return [];
        })
        .filter(ip => ip && ip !== 'unknown');
      
      // Remove private/internal IPs and prefer public IPs
      const publicIps = ips.filter(ip => {
        // Skip private IP ranges
        if (ip.startsWith('10.') || 
            ip.startsWith('192.168.') || 
            ip.startsWith('172.16.') || 
            ip.startsWith('172.17.') || 
            ip.startsWith('172.18.') || 
            ip.startsWith('172.19.') || 
            ip.startsWith('172.20.') || 
            ip.startsWith('172.21.') || 
            ip.startsWith('172.22.') || 
            ip.startsWith('172.23.') || 
            ip.startsWith('172.24.') || 
            ip.startsWith('172.25.') || 
            ip.startsWith('172.26.') || 
            ip.startsWith('172.27.') || 
            ip.startsWith('172.28.') || 
            ip.startsWith('172.29.') || 
            ip.startsWith('172.30.') || 
            ip.startsWith('172.31.') ||
            ip === '127.0.0.1' ||
            ip === '::1' ||
            ip === 'localhost') {
          return false;
        }
        return true;
      });
      
      // Prefer IPv4 over IPv6
      const ipv4 = publicIps.find(ip => ip.includes('.') && !ip.includes(':'));
      const ipv6 = publicIps.find(ip => ip.includes(':'));
      
      return ipv4 || ipv6 || publicIps[0] || 'Unknown';
    };
    
    const ip = getClientIp();
    
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
