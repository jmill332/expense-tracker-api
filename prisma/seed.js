const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clean the database (Deletes in order to respect Foreign Key constraints)
  await prisma.transaction.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Setup Password
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 3. Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'owner@example.com',
      password: passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'not-owner@example.com',
      password: passwordHash,
    },
  });

  // 4. Create a Category for User 1
  const category = await prisma.category.create({
    data: {
      name: 'Groceries',
      user_id: user1.id,
    },
  });

  // 5. Create a Transaction for User 1
  await prisma.transaction.create({
    data: {
      amount: 45.50,
      description: 'Weekly grocery run',
      type: 'EXPENSE',
      category_id: category.id,
      user_id: user1.id,
    },
  });

  // 6. Create a Budget for User 1
  await prisma.budget.create({
    data: {
      limit_amount: 500.00,
      month: '2026-05',
      category_id: category.id,
      user_id: user1.id,
    },
  });

  console.log('Database has been seeded! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });