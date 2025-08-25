import { DataSource } from 'typeorm';
import { Closer, CloserStatus } from '../../users/entities/closer.entity';

export async function seedClosers(dataSource: DataSource) {
  const closerRepository = dataSource.getRepository(Closer);

  console.log('🌱 Seeding closers...');

  // Check if closers already exist
  const existingClosers = await closerRepository.count();
  
  if (existingClosers > 0) {
    console.log('✅ Closers already exist, skipping...');
    return;
  }

  // Create sample closers
  const closers = [
    {
      closerCode: 'CL001',
      closerName: 'Hannad',
      commissionRate: 10.00,
      status: CloserStatus.ACTIVE,
      email: 'hannad@techprocessing.com',
      phone: '+1-555-0101',
      notes: 'Top performing closer'
    },
    {
      closerCode: 'CL002',
      closerName: 'Sarah Johnson',
      commissionRate: 12.00,
      status: CloserStatus.ACTIVE,
      email: 'sarah@techprocessing.com',
      phone: '+1-555-0102',
      notes: 'Experienced closer with high conversion rate'
    },
    {
      closerCode: 'CL003',
      closerName: 'Mike Chen',
      commissionRate: 8.50,
      status: CloserStatus.ACTIVE,
      email: 'mike@techprocessing.com',
      phone: '+1-555-0103',
      notes: 'Specializes in enterprise deals'
    }
  ];

  for (const closerData of closers) {
    const closer = closerRepository.create(closerData);
    await closerRepository.save(closer);
  }

  console.log('✅ Closers seeded successfully!');
  console.log(`📊 Created ${closers.length} closers`);
}
