const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  // Clear existing data (in proper order to avoid foreign key issues)
  await prisma.occupancy.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.building.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

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

  const teacherUser = await prisma.user.create({
    data: {
      username: 'teacher1',
      email: 'teacher1@example.com',
      password: hashedPassword,
      role: 'TEACHER',
    },
  });

  // Create Floors and Buildings
  const floor1 = await prisma.floor.create({
    data: {
      name: '1st Floor',
      building: {
        create: {
          name: 'Building A',
          status: 'active',
        },
      },
    },
    include: { building: true },
  });

  const floor2 = await prisma.floor.create({
    data: {
      name: '2nd Floor',
      building: {
        create: {
          name: 'Building B',
          status: 'active',
        },
      },
    },
    include: { building: true },
  });

  // Create Classrooms
  const classroom101 = await prisma.classroom.create({
    data: {
      name: 'Room 101',
      floorId: floor1.id,
      buildingId: floor1.building.id,
    },
  });

  const classroom201 = await prisma.classroom.create({
    data: {
      name: 'Room 201',
      floorId: floor2.id,
      buildingId: floor2.building.id,
    },
  });

  // Create Reservations
  await prisma.reservation.create({
    data: {
      userId: repUser.id,
      classroomId: classroom101.id,
      startTime: new Date(2025, 0, 1, 9, 0, 0),
      endTime: new Date(2025, 0, 1, 10, 0, 0),
    },
  });

  await prisma.reservation.create({
    data: {
      userId: studentUser.id,
      classroomId: classroom201.id,
      startTime: new Date(2025, 0, 2, 14, 0, 0),
      endTime: new Date(2025, 0, 2, 16, 0, 0),
    },
  });

  // Create Occupancies
  await prisma.occupancy.create({
    data: {
      userId: studentUser.id,
      classroomId: classroom101.id,
      startTime: new Date('2025-05-01T08:00:00Z'),
      endTime: new Date('2025-05-01T10:00:00Z'),
      status: 'occupied',
    },
  });

  await prisma.occupancy.create({
    data: {
      userId: repUser.id,
      classroomId: classroom201.id,
      startTime: new Date('2025-05-01T10:00:00Z'),
      endTime: new Date('2025-05-01T12:00:00Z'),
      status: 'occupied',
    },
  });

  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
