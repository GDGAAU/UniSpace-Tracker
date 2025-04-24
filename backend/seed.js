// seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10); // Hash the password

    const adminUser = await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    const repUser = await prisma.user.create({
        data: {
            username: 'rep1',
            email: 'rep1@example.com',
            password: hashedPassword,
            role: 'REPRESENTATIVE',
        },
    });

    const studentUser = await prisma.user.create({
        data: {
            username: 'student1',
            email: 'student1@example.com',
            password: hashedPassword,
            role: 'STUDENT',
        },
    });

    // Create Floors
    const floor1 = await prisma.floor.create({
        data: {
            name: '1st Floor',
        },
    });

    const floor2 = await prisma.floor.create({
        data: {
            name: '2nd Floor',
        },
    });

    // Create Buildings
    const buildingA = await prisma.building.create({
        data: {
            name: 'Building A',
            floorId: floor1.id,
        },
    });

    const buildingB = await prisma.building.create({
        data: {
            name: 'Building B',
            floorId: floor2.id,
        },
    });

    // Create Classrooms
    const classroom101 = await prisma.classroom.create({
        data: {
            name: 'Room 101',
            floorId: floor1.id,
            buildingId: buildingA.id,
        },
    });

    const classroom201 = await prisma.classroom.create({
        data: {
            name: 'Room 201',
            floorId: floor2.id,
            buildingId: buildingB.id,
        },
    });

    // Create Reservations
    await prisma.reservation.create({
        data: {
            userId: repUser.id,
            classroomId: classroom101.id,
            startTime: new Date(2025, 0, 1, 9, 0, 0), // January 1, 2025, 9:00 AM
            endTime: new Date(2025, 0, 1, 10, 0, 0),
        },
    });

    await prisma.reservation.create({
        data: {
            userId: studentUser.id,
            classroomId: classroom201.id,
            startTime: new Date(2025, 0, 2, 14, 0, 0), // January 2, 2025, 2:00 PM
            endTime: new Date(2025, 0, 16, 0, 0),
        },
    });

    console.log('Seed data inserted successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
