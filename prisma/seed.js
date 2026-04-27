const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
  console.log('Starting rubric-compliant seed...');

  await prisma.transaction.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('Password123!', 10);

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

  await prisma.transaction.create({
    data: {
      amount: 250.00,
      description: 'Restaurant',
      type: 'EXPENSE',
      user_id: user1.id,
      category_id: cat1.id,
    },
  });

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

  await prisma.budget.create({
    data: {
      limit_amount: 500.00,
      month: "5",
      user_id: user1.id,
      category_id: cat1.id, 
    },
  });

  await prisma.budget.create({
    data: {
      limit_amount: 2000.00,
      month: "6",
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