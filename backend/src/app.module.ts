import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentLinksModule } from './payment-links/payment-links.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';

// Determine whether to skip database initialization (useful for tests)
const skipDb = process.env.SKIP_DB === 'true' || process.env.NODE_ENV === 'test';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'qa', 'production', 'test')
    .required(),
  PORT: Joi.number().default(8081),
  // Make database settings optional when DB is skipped
  DATABASE_HOST: skipDb ? Joi.string().allow('').optional() : Joi.string().required(),
  DATABASE_PORT: skipDb
    ? Joi.alternatives().try(Joi.number(), Joi.string().allow('')).optional()
    : Joi.number().default(5432),
  DATABASE_NAME: skipDb ? Joi.string().allow('').optional() : Joi.string().required(),
  DATABASE_USERNAME: skipDb ? Joi.string().allow('').optional() : Joi.string().required(),
  DATABASE_PASSWORD: skipDb ? Joi.string().allow('').optional() : Joi.string().allow('').required(),
  DATABASE_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
  DATABASE_SSL_REJECT_UNAUTHORIZED: Joi.boolean().truthy('true').falsy('false').default(false),
  JWT_SECRET: Joi.string().min(32).default('testsecret012345678901234567890123'),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  CORS_ORIGIN: Joi.string().default('*'),
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_LIMIT: Joi.number().default(100),
  AUTHORIZENET_API_LOGIN_ID: Joi.string().optional(),
  AUTHORIZENET_TRANSACTION_KEY: Joi.string().optional(),
  AUTHORIZENET_ENVIRONMENT: Joi.string().optional(),
  SKIP_DB: Joi.boolean().truthy('true').falsy('false').default(skipDb),
});

// Base imports always included
const baseImports: any[] = [
  ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    envFilePath: [
      `.env.${process.env.NODE_ENV || 'development'}`,
      '.env.local',
      '.env',
    ],
    validationSchema,
  }),
  HealthModule,
];

let appImports: any[];

if (skipDb) {
  // In test/skip-db mode, only include modules that don't require DB
  appImports = [...baseImports];
} else {
  appImports = [
    DatabaseModule,
    ...baseImports,
    AuthModule,
    UsersModule,
    AuditModule,
    InvoicesModule,
    PaymentsModule,
    SubscriptionsModule,
    PaymentLinksModule,
  ];
}

@Module({
  imports: appImports,
})
export class AppModule {}