const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const signup = async (email, password) => {
  // Check if user already exists
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save to database
  const newUser = await userRepository.createUser(email, hashedPassword);
  return newUser;
};

const login = async (email, password) => {
  // Find the user
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT Token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

module.exports = {
  signup,
  login
};