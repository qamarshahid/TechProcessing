import { Injectable } from '@nestjs/common';

@Injectable()
export class IpGeolocationService {
  async getLocationFromIp(ip: string): Promise<{ country?: string; city?: string; region?: string; isp?: string }> {
    try {
      // Skip geolocation for private IPs
      if (this.isPrivateIp(ip)) {
        return { country: 'Private Network', city: 'Local', region: 'Internal' };
      }

      // Use a free IP geolocation service
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,query`);
      const data = await response.json();

      if (data.status === 'success') {
        return {
          country: data.country || 'Unknown',
          region: data.regionName || 'Unknown',
          city: data.city || 'Unknown',
          isp: data.isp || 'Unknown',
        };
      }

      return { country: 'Unknown', city: 'Unknown', region: 'Unknown' };
    } catch (error) {
      console.error('Error fetching IP geolocation:', error);
      return { country: 'Unknown', city: 'Unknown', region: 'Unknown' };
    }
  }

  private isPrivateIp(ip: string): boolean {
    // Check for private IP ranges
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
      return true;
    }
    return false;
  }

  formatIpForDisplay(ip: string): string {
    if (!ip || ip === 'Unknown') return 'Unknown';
    
    // For IPv6, show first 4 segments
    if (ip.includes(':')) {
      const segments = ip.split(':');
      if (segments.length > 4) {
        return `${segments.slice(0, 4).join(':')}...`;
      }
      return ip;
    }
    
    // For IPv4, show full address
    return ip;
  }
}
