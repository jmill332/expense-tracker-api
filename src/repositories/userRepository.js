const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// 1. Setup the PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Create the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

const createUser = async (email, hashedPassword) => {
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });
};

module.exports = {
  findUserByEmail,
  createUser
};