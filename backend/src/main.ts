import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
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
  const defaultDevOrigins = 'http://localhost:5174,http://localhost:5173';
  const origins = (corsEnv || (!isProd ? defaultDevOrigins : ''))
    .split(',')
    .map((o) => o.trim())
    .filter((o) => !!o);

  if (origins.length > 0) {
    app.enableCors({
      origin: origins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  }

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

  const port = configService.get('PORT', 8080);
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  if (!isProd) {
    logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  }
  logger.log(`🔒 Environment: ${configService.get('NODE_ENV', 'development')}`);
  logger.log(`🏥 Health check: http://localhost:${port}/api/health`);
}

bootstrap();