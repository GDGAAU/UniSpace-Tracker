const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { identifyUser } = require('../utils/middleware');

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

module.exports = classroomRouter;