const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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