const express = require('express');
const profileRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { identifyUser, rbacMiddleware } = require('../utils/middleware');
const convertReservationsToOccupancies = require('../scripts/convertReservation');

// GET /api/profiles - Fetch all profiles
profileRouter.get('/', identifyUser, async (req, res) => {
    try {
        const profiles = await prisma.profile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    }
                },
            }
        });
        if (!profiles || profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No profiles found'
            });
        }
        return res.status(200).json({
            success: true,
            data: profiles,
            count: profiles.length
        });

    } catch (error) {
        console.error('Error fetching profiles:', error);
        if (error.name === 'PrismaClientKnownRequestError') {
            return res.status(400).json({
                success: false,
                message: 'Database error occurred',
                error: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
});

// GET /api/profiles/:id - Fetch a single profile by ID
profileRouter.get('/:id', identifyUser, async (req, res) => {
    try {
        const profileId = parseInt(req.params.id);
        const profile = await prisma.profile.findUnique({
            where: { id: profileId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    }
                },
            }
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
});

// POST /api/profiles - Create a new profile
profileRouter.post('/', identifyUser, async (req, res) => {
    try {
        const { userId, firstName, lastName, phone, address } = req.body;
        if (!userId || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        const newProfile = await prisma.profile.create({
            data: {
                userId,
                firstName,
                lastName,
                phone,
                address,
            }
        });

        return res.status(201).json({
            success: true,
            data: newProfile,
            message: 'Profile created successfully'
        });

    } catch (error) {
        console.error('Error creating profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
});

// PUT /api/profiles/:id - Update a profile
profileRouter.put('/:id', identifyUser,  async (req, res) => {
    try {
        const profileId = parseInt(req.params.id);
        const { firstName, lastName, phone, address } = req.body;
        const existingProfile = await prisma.profile.findUnique({
            where: { id: profileId }
        });

        if (!existingProfile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        const updatedProfile = await prisma.profile.update({
            where: { id: profileId },
            data: {
                firstName,
                lastName,
                phone,
                address,
            }
        });

        return res.status(200).json({
            success: true,
            data: updatedProfile,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
});

// DELETE /api/profiles/:id - Delete a profile
profileRouter.delete('/:id', identifyUser, rbacMiddleware(['ADMIN']), async (req, res) => {
    try {
        const profileId = parseInt(req.params.id);
        const existingProfile = await prisma.profile.findUnique({
            where: { id: profileId }
        });

        if (!existingProfile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }
        await prisma.profile.delete({
            where: { id: profileId }
        });

        return res.status(200).json({
            success: true,
            message: 'Profile deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = profileRouter;