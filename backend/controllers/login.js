const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

loginRouter.post('/', async (req, rep) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return rep.status(401).json({
      error: "Password or Username field empty"
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    const correctPass = user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && correctPass)) {
      console.log(user);
      console.log(password);
      console.log(correctPass);
      return rep.status(400).json({
        error: 'username or password incorrect'
      });
    }

    const userToken = {
      username: user.username,
      id: user.id,
      role: user.role, // Include the user's role in the token payload
    };

    const token = jwt.sign(userToken, process.env.SECRET);

    rep.status(200).send({
      token,
      username: user.username,
      name: user.name,
      role: user.role, // Optionally send the role back in the response
    });
  } catch (error) {
    console.error('Error during login:', error);
    rep.status(500).json({ error: 'Internal server error during login' });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = loginRouter;
