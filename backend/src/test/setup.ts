import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Global test setup
beforeAll(async () => {
  // Setup test database connection
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_NAME = 'techserve_pro_test';
});

afterAll(async () => {
  // Cleanup after tests
});

// Mock external services for testing
jest.mock('../payments/services/authorize-net.service');
jest.mock('../common/services/email.service');