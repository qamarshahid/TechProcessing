import { Injectable } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

interface ActiveSession {
  userId: string;
  userRole: UserRole;
  email: string;
  fullName: string;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

@Injectable()
export class SessionTrackingService {
  private activeSessions = new Map<string, ActiveSession>();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Clean up expired sessions every 5 minutes
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000);
  }

  addSession(sessionId: string, user: {
    id: string;
    role: UserRole;
    email: string;
    fullName: string;
  }, ipAddress: string, userAgent: string): void {
    this.activeSessions.set(sessionId, {
      userId: user.id,
      userRole: user.role,
      email: user.email,
      fullName: user.fullName,
      lastActivity: new Date(),
      ipAddress,
      userAgent,
      sessionId,
    });
  }

  updateActivity(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  removeSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }

  getActiveUsersByRole(): {
    total: number;
    byRole: {
      ADMIN: number;
      AGENT: number;
      CLIENT: number;
    };
    details: {
      admins: Array<{ email: string; fullName: string; lastActivity: Date; ipAddress: string }>;
      agents: Array<{ email: string; fullName: string; lastActivity: Date; ipAddress: string }>;
      clients: Array<{ email: string; fullName: string; lastActivity: Date; ipAddress: string }>;
    };
  } {
    const now = new Date();
    const activeSessions = Array.from(this.activeSessions.values())
      .filter(session => now.getTime() - session.lastActivity.getTime() < this.SESSION_TIMEOUT);

    const byRole = {
      ADMIN: 0,
      AGENT: 0,
      CLIENT: 0,
    };

    const details = {
      admins: [] as Array<{ email: string; fullName: string; lastActivity: Date; ipAddress: string }>,
      agents: [] as Array<{ email: string; fullName: string; lastActivity: Date; ipAddress: string }>,
      clients: [] as Array<{ email: string; fullName: string; lastActivity: Date; ipAddress: string }>,
    };

    activeSessions.forEach(session => {
      byRole[session.userRole]++;
      
      const userInfo = {
        email: session.email,
        fullName: session.fullName,
        lastActivity: session.lastActivity,
        ipAddress: session.ipAddress,
      };

      switch (session.userRole) {
        case UserRole.ADMIN:
          details.admins.push(userInfo);
          break;
        case UserRole.AGENT:
          details.agents.push(userInfo);
          break;
        case UserRole.CLIENT:
          details.clients.push(userInfo);
          break;
      }
    });

    return {
      total: activeSessions.length,
      byRole,
      details,
    };
  }

  getActiveSessionsCount(): number {
    const now = new Date();
    return Array.from(this.activeSessions.values())
      .filter(session => now.getTime() - session.lastActivity.getTime() < this.SESSION_TIMEOUT)
      .length;
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    const expiredSessions: string[] = [];

    this.activeSessions.forEach((session, sessionId) => {
      if (now.getTime() - session.lastActivity.getTime() >= this.SESSION_TIMEOUT) {
        expiredSessions.push(sessionId);
      }
    });

    expiredSessions.forEach(sessionId => {
      this.activeSessions.delete(sessionId);
    });

    if (expiredSessions.length > 0) {
      console.log(`🧹 Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }

  // Get session ID from request (you can customize this based on your auth strategy)
  getSessionIdFromRequest(request: any): string {
    // Try to get session ID from various sources
    return request.headers['x-session-id'] || 
           request.headers['authorization']?.replace('Bearer ', '') || 
           request.ip + '_' + request.headers['user-agent']?.substring(0, 50);
  }
}
