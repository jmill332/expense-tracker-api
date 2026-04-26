const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const newUser = await authService.signup(email, password);
    res.status(201).json({ 
      id: newUser.id, 
      email: newUser.email 
    });

  } catch (error) {
    if (error.code === 'P2002' || error.message.includes('already exists')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const token = await authService.login(email, password);
    res.status(200).json({ token });
    
  } catch (error) {
    res.status(401).json({ error: 'Invalid email or password' });
  }
};

module.exports = {
  signup,
  login
};