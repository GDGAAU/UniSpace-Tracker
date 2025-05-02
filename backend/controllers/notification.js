const express = require('express');
const notificationRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getTokenFrom, identifyUser, rbacMiddleware } = require('../utils/middleware');

const createNotification = async (userId, message, io) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        isRead: false,
      },
    });
    io.to(`user:${userId}`).emit('newNotification', notification);
    console.log(`Created notification for user ${userId}: ${message}`);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

notificationRouter.post('/', getTokenFrom, identifyUser, rbacMiddleware(['ADMIN', 'TEACHER']), async (req, res) => {
    const { userId, message } = req.body;
  
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Valid message is required' });
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const io = req.app.get('io');
      const notification = await createNotification(parseInt(userId), message, io);
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ error: 'Internal server error during notification creation' });
    } finally {
      await prisma.$disconnect();
    }
  });

// GET /api/notifications - Fetch notifications
notificationRouter.get('/', getTokenFrom, identifyUser, rbacMiddleware(['ADMIN', 'STUDENT', 'REPRESENTATIVE']), async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let notifications;
    if (role === 'ADMIN') {
      notifications = await prisma.notification.findMany({
        include: { user: { select: { id: true, username: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    }
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error during notification fetch' });
  } finally {
    await prisma.$disconnect();
  }
});

// PATCH /api/notifications/:id/read - Mark notification as read
notificationRouter.patch('/:id/read', getTokenFrom, identifyUser, rbacMiddleware(['ADMIN', 'STUDENT', 'REPRESENTATIVE']), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    if (notification.userId !== userId && role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden - Unauthorized to modify this notification' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error during notification update' });
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE /api/notifications/:id - Delete notification
notificationRouter.delete('/:id', getTokenFrom, identifyUser, rbacMiddleware(['ADMIN', 'STUDENT', 'REPRESENTATIVE']), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    if (notification.userId !== userId && role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden - Unauthorized to delete this notification' });
    }

    await prisma.notification.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error during notification deletion' });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = {
  notificationRouter,
  createNotification,
};

