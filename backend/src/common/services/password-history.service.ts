import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PasswordHistory } from '../entities/password-history.entity';

@Injectable()
export class PasswordHistoryService {
  constructor(
    @InjectRepository(PasswordHistory)
    private passwordHistoryRepository: Repository<PasswordHistory>,
  ) {}

  async addPasswordToHistory(userId: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const passwordHistory = this.passwordHistoryRepository.create({
      userId,
      hashedPassword,
      createdAt: new Date(),
    });

    await this.passwordHistoryRepository.save(passwordHistory);
  }

  async isPasswordInHistory(userId: string, password: string, historyLimit: number = 5): Promise<boolean> {
    // Get the most recent passwords for the user
    const recentPasswords = await this.passwordHistoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: historyLimit,
    });

    // Check if the new password matches any of the recent passwords
    for (const passwordRecord of recentPasswords) {
      const isMatch = await bcrypt.compare(password, passwordRecord.hashedPassword);
      if (isMatch) {
        return true;
      }
    }

    return false;
  }

  async cleanupOldPasswords(userId: string, keepCount: number = 5): Promise<void> {
    // Get all passwords for the user, ordered by creation date
    const allPasswords = await this.passwordHistoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // If we have more passwords than we want to keep, delete the oldest ones
    if (allPasswords.length > keepCount) {
      const passwordsToDelete = allPasswords.slice(keepCount);
      const idsToDelete = passwordsToDelete.map(p => p.id);
      
      await this.passwordHistoryRepository.delete(idsToDelete);
    }
  }

  async getPasswordHistoryCount(userId: string): Promise<number> {
    return await this.passwordHistoryRepository.count({
      where: { userId },
    });
  }

  async clearPasswordHistory(userId: string): Promise<void> {
    await this.passwordHistoryRepository.delete({ userId });
  }
}
