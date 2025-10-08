const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    console.log('Registration request received: ', req.body);
    const { name, email, password } = req.body;

    // Check if user exists
    console.log('Checking for existing user with prisma: ', prisma);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login Attempt: ', req.body);
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found: ', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found for email: ', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Checking password....');
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid: ', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user: ', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    console.log('Login successful for: ', email);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};