import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seedInitialData } from '../database/seeds/initial-data';
import { DataSource } from 'typeorm';

async function runSeeds() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  if (config.get('NODE_ENV') === 'production') {
    console.log('Seeding skipped in production.');
    await app.close();
    return;
  }
  const dataSource = app.get(DataSource);
  await seedInitialData(dataSource);
  await app.close();
  console.log('Seeding complete.');
}

runSeeds();