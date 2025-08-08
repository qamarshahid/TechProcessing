import { AppDataSource } from '../data-source';
import { seedInitialData } from './initial-data';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('🔗 Database connection established');
    
    await seedInitialData(AppDataSource);
    console.log('✅ Database seeding completed');
    
    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds();