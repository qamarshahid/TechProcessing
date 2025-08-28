/**
 * Secure logging utility that prevents sensitive data exposure
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class SecureLogger {
  private isProduction = process.env.NODE_ENV === 'production';
  private isDevelopment = process.env.NODE_ENV === 'development';

  // Sensitive fields that should never be logged
  private sensitiveFields = [
    'password',
    'token',
    'access_token',
    'refresh_token',
    'secret',
    'key',
    'authorization',
    'cookie',
    'session',
    'credential',
    'auth',
    'jwt'
  ];

  /**
   * Sanitize object by removing or masking sensitive fields
   */
  private sanitize(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      
      // Check if key contains sensitive information
      const isSensitive = this.sensitiveFields.some(field => 
        lowerKey.includes(field)
      );

      if (isSensitive) {
        // Mask sensitive data
        if (typeof value === 'string' && value.length > 0) {
          sanitized[key] = value.substring(0, 4) + '****';
        } else {
          sanitized[key] = '[REDACTED]';
        }
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Minimal logging method - only logs in development or for errors
   */
  private log(level: LogLevel, message: string, data?: unknown) {
    // In production, only log errors
    if (this.isProduction && level !== 'error') {
      return;
    }

    // In development, skip debug unless specifically enabled
    if (level === 'debug' && !this.isDevelopment) {
      return;
    }

    // Minimal logging format for performance
    const logMessage = `${level.toUpperCase()}: ${message}`;

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(logMessage);
        }
        break;
      case 'info':
        if (!this.isProduction) {
          console.info(logMessage);
        }
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error': {
        // Only sanitize data for errors to avoid performance cost
        const sanitizedData = data ? this.sanitize(data) : undefined;
        console.error(logMessage, sanitizedData || '');
        break;
      }
    }
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }

  /**
   * Minimal API request logging - only in development
   */
  apiRequest(method: string, url: string, _hasToken: boolean) {
    if (this.isDevelopment) {
      this.debug(`${method} ${url.split('?')[0]}`); // Remove query params for cleaner logs
    }
  }

  /**
   * Minimal API response logging - only in development
   */
  apiResponse(status: number) {
    if (this.isDevelopment && status >= 400) {
      this.debug(`Response ${status}`);
    }
  }

  /**
   * Auth events - minimal logging
   */
  authEvent(event: string) {
    if (!this.isProduction) {
      this.info(`Auth: ${event}`);
    }
  }
}

// Export singleton instance
export const logger = new SecureLogger();
export default logger;
