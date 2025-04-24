const userRouter = require('express').Router()
const {errorHandler} = require('../utils/middleware')
const { error } = require('../utils/logger')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const { isAdmin, identifyUser } = require('../utils/middleware')



userRouter.get('/',identifyUser, isAdmin, async(req, res) => { 
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
})

// might implement a way to add new users as an admin maybe?

userRouter.post('/', identifyUser, isAdmin, async(req, res) => {
	// TODO
})


module.exports = userRouter;
