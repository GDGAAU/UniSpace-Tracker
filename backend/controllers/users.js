const userRouter = require('express').Router()
const {errorHandler} = require('../utils/middleware')
const { error } = require('../utils/logger')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const { identifyUser, rbacMiddleware } = require('../utils/middleware')



userRouter.get('/',identifyUser, rbacMiddleware(['ADMIN']), async(req, res) => { 
	try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve users' });
    }
});

userRouter.get('/:id', identifyUser, async(req,res) => {
	const { id } = req.params;
	try{
		const foundUser = await prisma.user.findUnique({
			where: { id: parseInt(id) },
		})

		if (!foundUser){
			return(res.status(404).json({error: "No such user found"}))
		}
		if(foundUser.role ==="ADMIN" && req.user.role !== "ADMIN"){
			return(res.status(403).json({error: "Forbidden stuff"}))
		}
		res.json(foundUser);
	}catch(e){
		console.error(error);
        res.status(500).json({ error: 'Could not retrieve user' });
	}
});

// might implement a way to add new users as an admin maybe?

userRouter.post('/', rbacMiddleware(['ADMIN']), async(req, res) => {
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
		  return res.status(400).json({ error: existingUser.username === username ? 'Username already taken' : 'Email already taken' });
		}
		
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				password: passwordHash,
				role: role
			}
		});

		res.status(201).json({
			username: newUser.username,
			email: newUser.email,
			role: newUser.role
		});

	}catch (error){
		console.error('Error during signup:', error);
		res.status(500).json({ error: 'Internal server error during signup' });
	}finally {
		await prisma.$disconnect();
	}
});


//Admins can make others admins through this route OR change roles to whatever they like
userRouter.patch('/:id', identifyUser, rbacMiddleware(['ADMIN']), async (req, res) => {
	const { id } = req.params;
	const { role } = req.body;
  
	if (!role) {
	  return res.status(400).json({ error: 'Role is required' });
	}
	if (!['STUDENT', 'TEACHER', 'REPRESENTATIVE', 'ADMIN'].includes(role)) {
	  return res.status(400).json({ error: 'Invalid role' });
	}
  
	try {
	  const user = await prisma.user.findUnique({
		where: { id: parseInt(id) },
	  });
	  if (!user) {
		return res.status(404).json({ error: 'User not found' });
	  }
  
	  const updatedUser = await prisma.user.update({
		where: { id: parseInt(id) },
		data: { role },
	  });
  
	  res.status(200).json({
		id: updatedUser.id,
		username: updatedUser.username,
		email: updatedUser.email,
		role: updatedUser.role,
	  });
	} catch (error) {
	  console.error('Error updating user role:', error);
	  res.status(500).json({ error: 'Internal server error during role update' });
	} finally {
	  await prisma.$disconnect();
	}
  });


module.exports = userRouter;
