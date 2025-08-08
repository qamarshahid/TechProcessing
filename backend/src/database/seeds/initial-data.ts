import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/entities/user.entity';
import { ServicePackage } from '../../invoices/entities/service-package.entity';
import { UserRole } from '../../common/enums/user-role.enum';

export async function seedInitialData(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const servicePackageRepository = dataSource.getRepository(ServicePackage);

  // Create default admin user
  const adminExists = await userRepository.findOne({
    where: { email: 'admin@techprocessing.com' },
  });

  if (!adminExists) {
    const admin = userRepository.create({
      email: 'admin@techprocessing.com',
      password: await bcrypt.hash('admin123', 12),
      fullName: 'System Administrator',
      role: UserRole.ADMIN,
    });
    await userRepository.save(admin);
    console.log('✅ Default admin user created: admin@techprocessing.com / admin123');
  }

  // Create sample client user
  const clientExists = await userRepository.findOne({
    where: { email: 'client@example.com' },
  });

  if (!clientExists) {
    const client = userRepository.create({
      email: 'client@example.com',
      password: await bcrypt.hash('password123', 12),
      fullName: 'John Doe',
      role: UserRole.CLIENT,
    });
    await userRepository.save(client);
    console.log('✅ Sample client user created: client@example.com / password123');
  }

  // Create sample service packages
  const packageCount = await servicePackageRepository.count();
  
  if (packageCount === 0) {
    const packages = [
      {
        name: 'Starter Website',
        description: 'Perfect for small businesses and personal websites',
        price: 799,
        features: [
          'Responsive Design',
          'Up to 5 Pages',
          'Contact Form',
          'Basic SEO',
          '1 Month Support',
        ],
      },
      {
        name: 'Business Website',
        description: 'Professional website with advanced features',
        price: 1999,
        features: [
          'Custom Design',
          'Up to 15 Pages',
          'E-commerce Ready',
          'Advanced SEO',
          'Analytics Setup',
          '3 Months Support',
        ],
      },
      {
        name: 'Enterprise Application',
        description: 'Full-stack web application with custom functionality',
        price: 4999,
        features: [
          'Custom Development',
          'Database Integration',
          'User Authentication',
          'Admin Dashboard',
          'API Development',
          '6 Months Support',
        ],
      },
    ];

    for (const packageData of packages) {
      const servicePackage = servicePackageRepository.create(packageData);
      await servicePackageRepository.save(servicePackage);
    }
    
    console.log('✅ Sample service packages created');
  }
}