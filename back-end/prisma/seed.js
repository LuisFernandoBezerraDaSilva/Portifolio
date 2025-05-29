const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); 
const prisma = new PrismaClient();

async function main() {
  console.log('Checking if the database already contains data...');

  const existingUsers = await prisma.user.findFirst();
  if (existingUsers) {
    console.log('Data already exists in the database. Seed will not be executed.');
    return;
  }

  console.log('Creating admin user...');
  const saltRounds = 10;
  const adminPassword = bcrypt.hashSync('admin123', saltRounds);

  const adminId = uuidv4(); 

  const admin = await prisma.user.create({
    data: {
      id: adminId, 
      username: 'admin',
      password: adminPassword,
    },
  });

  console.log('Admin user created:', admin);

  console.log('Creating tasks...');
  await prisma.task.createMany({
    data: [
      {
        id: uuidv4(),
        title: 'First Task',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        userId: admin.id,
        date: '2024-05-01',
      },
      {
        id: uuidv4(),
        title: 'Second Task',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        userId: admin.id,
        date: '2024-05-15',
      },
      {
        id: uuidv4(),
        title: 'Third Task',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        userId: admin.id,
        date: '2024-06-01',
      },
    ],
  });
  console.log('Tasks created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });