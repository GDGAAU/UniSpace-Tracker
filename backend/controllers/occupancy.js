const express = require('express');
const occupancyRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { identifyUser, rbacMiddleware } = require('../utils/middleware');

//All users can retrieve this endpoint
occupancyRouter.get('/', identifyUser, async (req, res) => {
  const { userId } = req.query;
  const authUserId = req.user.id;
  const role = req.user.role;

  try {
    const occupancies = await prisma.occupancy.findMany({
      include: { classroom: true, user: { select: { id: true, username: true } } },
    });
    res.status(200).send(occupancies);
  } catch (error) {
    console.error('Error fetching occupancies:', error);
    res.status(500).json({ error: 'Internal server error during occupancy fetch' });
  } finally {
    await prisma.$disconnect();
  }
});


//All users can retrieve this endpoint
occupancyRouter.get('/classroom/:classroomId', identifyUser,  async (req, res) => {
  const { classroomId } = req.params;

  if (!classroomId || isNaN(parseInt(classroomId))) {
    return res.status(400).json({ error: 'Valid classroomId is required' });
  }

  try {
    const classroom = await prisma.classroom.findUnique({
      where: { id: parseInt(classroomId) },
    });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    const occupancies = await prisma.occupancy.findMany({
      where: { classroomId: parseInt(classroomId) },
      include: { classroom: true, user: { select: { id: true, username: true } } },
    });
    res.status(200).send(occupancies);
  } catch (error) {
    console.error('Error fetching occupancies by classroom:', error);
    res.status(500).json({ error: 'Internal server error during occupancy fetch' });
  } finally {
    await prisma.$disconnect();
  }
});


//ADMIN, TEACHER, REPRESENTATIVE roles only
occupancyRouter.post('/', identifyUser, rbacMiddleware(['ADMIN', 'TEACHER', 'REPRESENTATIVE']), async (req, res) => {
  const { classroomId, startTime, endTime, status } = req.body;
  const userId = req.user.id;

  if (!classroomId || isNaN(parseInt(classroomId))) {
    return res.status(400).json({ error: 'Valid classroomId is required' });
  }
  if (!(startTime && endTime)) {
    return res.status(400).json({ error: 'Start time and end time are required' });
  }

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid start or end time format' });
    }
    if (start >= end) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }
    if (start < now) {
      return res.status(400).json({ error: 'Start time must be in the future' });
    }

    const classroom = await prisma.classroom.findUnique({
      where: { id: parseInt(classroomId) },
    });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    const conflictingOccupancy = await prisma.occupancy.findFirst({
      where: {
        classroomId: parseInt(classroomId),
        OR: [
          { AND: [{ startTime: { lte: start } }, { endTime: { gt: start } }] },
          { AND: [{ startTime: { lt: end } }, { endTime: { gte: end } }] },
          { AND: [{ startTime: { gte: start } }, { endTime: { lte: end } }] },
        ],
      },
    });
    if (conflictingOccupancy) {
      return res.status(400).json({ error: 'Classroom is already occupied for the requested time slot' });
    }

    const newOccupancy = await prisma.occupancy.create({
      data: {
        classroomId: parseInt(classroomId),
        userId,
        startTime: start,
        endTime: end,
        status: status || 'occupied',
      },
      include: { classroom: true, user: { select: { id: true, username: true } } },
    });

    res.status(200).send(newOccupancy);
  } catch (error) {
    console.error('Error creating occupancy:', error);
    res.status(500).json({ error: 'Internal server error during occupancy creation' });
  } finally {
    await prisma.$disconnect();
  }
});



//ADMIN, TEACHER, REPRESENTATIVE role only
occupancyRouter.patch('/:id', identifyUser, rbacMiddleware(['ADMIN', 'TEACHER', 'REPRESENTATIVE']), async (req, res) => {
  const { id } = req.params;
  const { classroomId, startTime, endTime, status } = req.body;
  const userId = req.user.id;

  try {
    const occupancy = await prisma.occupancy.findUnique({
      where: { id: parseInt(id) },
    });
    if (!occupancy) {
      return res.status(404).json({ error: 'Occupancy not found' });
    }
    if (occupancy.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden - Unauthorized to modify this occupancy' });
    }

    const updateData = {};
    if (classroomId) {
      if (isNaN(parseInt(classroomId))) {
        return res.status(400).json({ error: 'Valid classroomId is required' });
      }
      const classroom = await prisma.classroom.findUnique({
        where: { id: parseInt(classroomId) },
      });
      if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      updateData.classroomId = parseInt(classroomId);
    }
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (status) updateData.status = status;

    if (startTime || endTime) {
      const start = startTime ? new Date(startTime) : occupancy.startTime;
      const end = endTime ? new Date(endTime) : occupancy.endTime;
      const now = new Date();

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ error: 'Invalid start or end time format' });
      }
      if (start >= end) {
        return res.status(400).json({ error: 'Start time must be before end time' });
      }
      if (start < now) {
        return res.status(400).json({ error: 'Start time must be in the future' });
      }

      const targetClassroomId = classroomId ? parseInt(classroomId) : occupancy.classroomId;
      const conflictingOccupancy = await prisma.occupancy.findFirst({
        where: {
          classroomId: targetClassroomId,
          id: { not: parseInt(id) },
          OR: [
            { AND: [{ startTime: { lte: start } }, { endTime: { gt: start } }] },
            { AND: [{ startTime: { lt: end } }, { endTime: { gte: end } }] },
            { AND: [{ startTime: { gte: start } }, { endTime: { lte: end } }] },
          ],
        },
      });
      if (conflictingOccupancy) {
        return res.status(400).json({ error: 'Classroom is already occupied for the requested time slot' });
      }
    }

    const updatedOccupancy = await prisma.occupancy.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { classroom: true, user: { select: { id: true, username: true } } },
    });

    res.status(200).send(updatedOccupancy);
  } catch (error) {
    console.error('Error updating occupancy:', error);
    res.status(500).json({ error: 'Internal server error during occupancy update' });
  } finally {
    await prisma.$disconnect();
  }
});


//ADMIN, TEACHER, REPRESENTATIVE role only
occupancyRouter.delete('/:id', identifyUser, rbacMiddleware(['ADMIN', 'TEACHER', 'REPRESENTATIVE']), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const occupancy = await prisma.occupancy.findUnique({
      where: { id: parseInt(id) },
    });
    if (!occupancy) {
      return res.status(404).json({ error: 'Occupancy not found' });
    }
    if (occupancy.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden - Unauthorized to delete this occupancy' });
    }

    await prisma.occupancy.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).send({ message: 'Occupancy deleted' });
  } catch (error) {
    console.error('Error deleting occupancy:', error);
    res.status(500).json({ error: 'Internal server error during occupancy deletion' });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = occupancyRouter;