const express = require('express');
const reservationRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { identifyUser, rbacMiddleware } = require('../utils/middleware');
const convertReservationsToOccupancies = require('../scripts/convertReservation');


reservationRouter.get('/', identifyUser, async (req, res) => {
  const { userId, classroomId, startTime, endTime } = req.query;
  const userRole = req.user.role;
  const currentUserId = req.user.id;

  try {
    const filters = {};
    if (userId) {
      const parsedUserId = parseInt(userId);
      if (isNaN(parsedUserId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
      }
      filters.userId = parsedUserId; 
    }

    
    if (classroomId) {
      const parsedClassroomId = parseInt(classroomId);
      if (isNaN(parsedClassroomId)) {
        return res.status(400).json({ error: 'Invalid classroomId format' });
      }
      filters.classroomId = parsedClassroomId;
    }

    
    if (startTime) {
      const start = new Date(startTime);
      if (isNaN(start)) {
        return res.status(400).json({ error: 'Invalid startTime format' });
      }
      filters.startTime = { gte: start };
    }

    if (endTime) {
      const end = new Date(endTime);
      if (isNaN(end)) {
        return res.status(400).json({ error: 'Invalid endTime format' });
      }
      filters.endTime = { lte: end };
    }

    const reservations = await prisma.reservation.findMany({
      where: filters,
      orderBy: { startTime: 'asc' },
      include: {
        user: { select: { username: true, email: true } },
        classroom: { select: { name: true} }
      }
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error while fetching reservations' });
  } finally {
    await prisma.$disconnect();
  }
});

reservationRouter.post('/', identifyUser, rbacMiddleware(['ADMIN', 'REPRESENTATIVE', 'TEACHER']), async (req, res) => {
  const { classroomId, startTime, endTime } = req.body;
  const userId = req.user.id;
  if (!(classroomId && startTime && endTime)) {
    return res.status(400).json({
      error: 'Classroom ID, start time, and end time are required'
    });
  }

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        error: 'Invalid start or end time format'
      });
    }

    if (start >= end) {
      return res.status(400).json({
        error: 'Start time must be before end time'
      });
    }

    if (start < now) {
      return res.status(400).json({
        error: 'Start time must be in the future'
      });
    }


    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId }
    });

    if (!classroom) {
      return res.status(404).json({
        error: 'Classroom not found'
      });
    }

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        classroomId,
        OR: [
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gt: start } }
            ]
          },
          {
            AND: [
              { startTime: { lt: end } },
              { endTime: { gte: end } }
            ]
          },
          {
            AND: [
              { startTime: { gte: start } },
              { endTime: { lte: end } }
            ]
          }
        ]
      }
    });

    if (conflictingReservation) {
      return res.status(400).json({
        error: 'Classroom is already reserved for the requested time slot'
      });
    }


    const newReservation = await prisma.reservation.create({
      data: {
        userId,
        classroomId,
        startTime: start,
        endTime: end
      }
    });

    res.status(201).json({
      id: newReservation.id,
      userId: newReservation.userId,
      classroomId: newReservation.classroomId,
      startTime: newReservation.startTime,
      endTime: newReservation.endTime,
      createdAt: newReservation.createdAt
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Internal server error during reservation creation' });
  } finally {
    await prisma.$disconnect();
  }
});

reservationRouter.delete('/:id', identifyUser, rbacMiddleware(['ADMIN', 'REPRESENTATIVE', 'TEACHER']), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;


  const reservationId = parseInt(id);
  if (isNaN(reservationId)) {
    return res.status(400).json({ error: 'Invalid reservation ID format' });
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: { select: { username: true, email: true } },
        classroom: { select: { name: true} }
      }
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }


    if (userRole !== 'ADMIN' && reservation.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this reservation' });
    }


    await prisma.reservation.delete({
      where: { id: reservationId }
    });

    res.status(200).json({
      message: 'Reservation deleted successfully',
      reservation
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Internal server error while deleting reservation' });
  } finally {
    await prisma.$disconnect();
  }
});

reservationRouter.patch('/:id', identifyUser, rbacMiddleware(['ADMIN', 'REPRESENTATIVE', 'TEACHER']), async (req, res) => {
    const { id } = req.params;
    const { classroomId, startTime, endTime } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
  
  
    const reservationId = parseInt(id);
    if (isNaN(reservationId)) {
      return res.status(400).json({ error: 'Invalid reservation ID format' });
    }
  

    if (!classroomId && !startTime && !endTime) {
      return res.status(400).json({ error: 'At least one field (classroomId, startTime, endTime) must be provided' });
    }
  
    try {
     
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: {
          user: { select: { username: true, email: true } },
          classroom: { select: { name: true} }
        }
      });
  
      if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
  
      
      if (userRole !== 'ADMIN' && reservation.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to update this reservation' });
      }
  

      const updateData = {};
  
      if (classroomId) {
        const parsedClassroomId = parseInt(classroomId);
        if (isNaN(parsedClassroomId)) {
          return res.status(400).json({ error: 'Invalid classroomId format' });
        }
        const classroom = await prisma.classroom.findUnique({
          where: { id: parsedClassroomId }
        });
        if (!classroom) {
          return res.status(404).json({ error: 'Classroom not found' });
        }
        updateData.classroomId = parsedClassroomId;
      }
      let newStartTime = startTime ? new Date(startTime) : reservation.startTime;
      let newEndTime = endTime ? new Date(endTime) : reservation.endTime;
  
      if (startTime && isNaN(newStartTime)) {
        return res.status(400).json({ error: 'Invalid startTime format' });
      }
      if (endTime && isNaN(newEndTime)) {
        return res.status(400).json({ error: 'Invalid endTime format' });
      }
  
      if ((startTime || endTime) && newStartTime >= newEndTime) {
        return res.status(400).json({ error: 'Start time must be before end time' });
      }
  
      if ((startTime || endTime) && newStartTime < new Date()) {
        return res.status(400).json({ error: 'Start time must be in the future' });
      }

      if (startTime || endTime || classroomId) {
        const checkClassroomId = classroomId || reservation.classroomId;
        const conflictingReservation = await prisma.reservation.findFirst({
          where: {
            classroomId: checkClassroomId,
            id: { not: reservationId }, // Exclude the current reservation
            OR: [
              {
                AND: [
                  { startTime: { lte: newStartTime } },
                  { endTime: { gt: newStartTime } }
                ]
              },
              {
                AND: [
                  { startTime: { lt: newEndTime } },
                  { endTime: { gte: newEndTime } }
                ]
              },
              {
                AND: [
                  { startTime: { gte: newStartTime } },
                  { endTime: { lte: newEndTime } }
                ]
              }
            ]
          }
        });
  
        if (conflictingReservation) {
          return res.status(400).json({ error: 'Updated time slot conflicts with an existing reservation' });
        }
  
        if (startTime) updateData.startTime = newStartTime;
        if (endTime) updateData.endTime = newEndTime;
      }

      const updatedReservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: updateData,
        include: {
          user: { select: { username: true, email: true } },
          classroom: { select: { name: true, capacity: true } }
        }
      });
  
      res.status(200).json({
        message: 'Reservation updated successfully',
        reservation: updatedReservation
      });
    } catch (error) {
      console.error('Error updating reservation:', error);
      res.status(500).json({ error: 'Internal server error while updating reservation' });
    } finally {
      await prisma.$disconnect();
    }
  });

  //manual reservation to occupancy conversion endpoint
  reservationRouter.post('/convert', identifyUser, rbacMiddleware(['ADMIN', 'REPRESENTATIVE']), async (req, res) => {
    try {
      await convertReservationsToOccupancies();
      res.status(200).json({ message: 'Reservations converted to occupancies successfully' });
    } catch (error) {
      console.error('Error converting reservations:', error);
      res.status(500).json({ error: 'Internal server error during conversion' });
    }
  });
module.exports = reservationRouter;