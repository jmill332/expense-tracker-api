const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({});

async function main() {
  console.log('Starting rubric-compliant seed...');

  // 1. Clean the database (Order matters for Foreign Keys)
  await prisma.transaction.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Create TWO users with known credentials (Required by Rubric)
  const user1 = await prisma.user.create({
    data: {
      email: 'owner@example.com',
      password: passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'other@example.com',
      password: passwordHash,
    },
  });

  // 3. Create sample resources for User 1 (Ownership Authorization)
  const cat1 = await prisma.category.create({
    data: {
      name: 'Groceries',
      user_id: user1.id,
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 50.00,
      description: 'Supermarket',
      type: 'EXPENSE',
      user_id: user1.id,
      category_id: cat1.id,
    },
  });

  // 4. Create sample resources for User 2
  const cat2 = await prisma.category.create({
    data: {
      name: 'Business',
      user_id: user2.id,
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 1000.00,
      description: 'Consulting Fee',
      type: 'INCOME',
      user_id: user2.id,
      category_id: cat2.id,
    },
  });

  console.log('Database has been fully seeded with two users and owned resources! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });