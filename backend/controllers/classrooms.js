const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { identifyUser, isAdmin } = require('../utils/middleware');

const classroomRouter = express.Router();

// GET /api/classrooms - Fetch all classrooms
classroomRouter.get('/', identifyUser, async (req, res) => {
  try {
    const classrooms = await prisma.classroom.findMany({
      select: {
        name: true,
        floorId: true,
        buildingId:true
      }
    });
    res.status(200).json(classrooms);
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ error: 'Internal server error while fetching classrooms' });
  } finally {
    await prisma.$disconnect();
  }
});

classroomRouter.post('/', identifyUser, isAdmin, async(req, res) => {
	const {floorId, buildingId, name } = req.body;

	if (!floorId || !buildingId || !name ) {
		return res.status(400).json({error: "requires all of the following, floor ID, Building ID, Name of classroom"})
	}
	try {
		const  newClass = await prisma.classroom.create({
			data: {
				floorId: parseInt(floorId),
				buildingId: parseInt(buildingId),
				name,
			},
		});

		res.status(201).json(newClass);
	}catch(e){
		consol.log("Error making class:, ", error);
		res.status(500).json({ error: 'Internal server error while creating classroom' });
	}finally{
		await prisma.$disconnect();
	}
});

module.exports = classroomRouter;
