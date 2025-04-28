const express = require('express');
const signupRouter = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { identifyUser } = require('../utils/middleware')

signupRouter.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!(username && email && password)) {
    return res.status(400).json({
      error: 'Username, email, and password are required'
    });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.username === username ? 'Username already taken' : 'Email already taken'
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
        role: role || 'STUDENT' // Default to 'STUDENT' if role is not provided
      }
    });

    res.status(201).json({
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error during signup' });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = signupRouter;
