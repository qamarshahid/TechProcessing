import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

const configService = new ConfigService();

const isSsl = (configService.get('DATABASE_SSL') ?? configService.get('NODE_ENV') === 'production')
  ? true
  : false;
const rejectUnauthorized = (configService.get('DATABASE_SSL_REJECT_UNAUTHORIZED') ?? 'false') === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: Number(configService.get('DATABASE_PORT', 5432)),
  username: configService.get('DATABASE_USERNAME', 'postgres'),
  password: configService.get('DATABASE_PASSWORD', 'password'),
  database: configService.get('DATABASE_NAME', 'techprocessing'),
  entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false, // Always false in production
  logging: configService.get('NODE_ENV') === 'development',
  ssl: isSsl ? { rejectUnauthorized } : false,
});