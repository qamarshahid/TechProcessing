import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CorsMiddleware } from './common/middleware/cors.middleware';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS configuration
  const isProd = configService.get('NODE_ENV') === 'production';
  const corsEnv =
    configService.get<string>('CORS_ORIGINS') ||
    configService.get<string>('CORS_ORIGIN');
  const defaultDevOrigins = 'http://localhost:5174,http://localhost:5173,https://qamarshahid.github.io';
  const defaultProdOrigins = 'https://qamarshahid.github.io';
  const origins = (corsEnv || (!isProd ? defaultDevOrigins : defaultProdOrigins))
    .split(',')
    .map((o) => o.trim())
    .filter((o) => !!o);

  logger.log(`🔧 CORS Configuration: origins=${origins.join(', ')}`);
  logger.log(`🔧 Environment: ${isProd ? 'production' : 'development'}`);

  // Apply custom CORS middleware FIRST - before any other middleware
  const corsMiddleware = new CorsMiddleware();
  app.use(corsMiddleware.use.bind(corsMiddleware));

  logger.log('✅ Custom CORS middleware applied for GitHub Pages and localhost development');

  // Security headers
  app.use(helmet({ contentSecurityPolicy: isProd }));

  // Global prefix
  app.setGlobalPrefix('api');

  // Global interceptors and filters
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger documentation (disabled in production)
  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('TechServe Pro API')
      .setDescription('IT Services Management Platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('invoices', 'Invoice management endpoints')
      .addTag('payments', 'Payment processing endpoints')
      .addTag('service-packages', 'Service package endpoints')
      .addTag('audit', 'Audit logging endpoints')
      .addTag('health', 'Health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 8080;

  try {
    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
    if (!isProd) {
      logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
    }
    logger.log(`🔒 Environment: ${configService.get('NODE_ENV', 'development')}`);
    logger.log(`🏥 Health check: http://localhost:${port}/api/health`);
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});