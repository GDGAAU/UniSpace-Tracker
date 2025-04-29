const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const getTokenFrom = (request, response, next) => {
  // console.log(request)
      const auth = request.get('authorization')
      if (auth && auth.startsWith('Bearer ')){
          request.token = auth.replace('Bearer ', '')  
      } 
      next()
    }

const identifyUser = async (req, res, next) => {
  const token = req.token; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id; 

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid user' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role, 
    };
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ error: 'Forbidden - Invalid token' });
  } finally {
    await prisma.$disconnect();
  }
};



const errorHandler = (error, request, response, next) => {
  logger.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }else if(error.name === 'PasswordErr'){
    return response.status(400).json({ error: error.message })
  }else if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: 'Username Taken' });
  }else if (error.name === 'JsonWebTokenError'){
    return( response.status(401).json({
      error: 'inivalid token'
    }))
  }
  next(error)
};

const rbacMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: `Forbidden - ${userRole} role not authorized` });
    }

    next();
  };
};


module.exports = {
	requestLogger,
	getTokenFrom,
	unknownEndpoint,
	identifyUser,
	errorHandler,
	rbacMiddleware
}
