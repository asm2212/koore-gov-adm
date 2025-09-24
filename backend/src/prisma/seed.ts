import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('adminPassword123', 10);
  const writerPassword = await bcrypt.hash('writerPassword123', 10);

  // Create roles (if not already created by Role enum)
  // Roles usually managed by enum, so no need to create separately here

  // Create default admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN', // Use exact enum value from Prisma schema
    },
  });

  // Create default writer user
  await prisma.user.upsert({
    where: { email: 'writer@example.com' },
    update: {},
    create: {
      name: 'Writer User',
      email: 'writer@example.com',
      password: writerPassword,
      role: 'WRITER',
    },
  });

  console.log('Seeded default admin and writer users');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
