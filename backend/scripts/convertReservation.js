const { PrismaClient } = require('@prisma/client');
const { DateTime } = require('luxon');
const cron = require('node-cron');

const prisma = new PrismaClient();

// Utility: Sleep function to avoid hammering DB
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function convertReservationsToOccupancies() {
  const now = DateTime.utc().toJSDate(); 
  const batchSize = 10;
  let hasMore = true;

  console.log('\nStarting reservation-to-occupancy job at:', now.toISOString());
  console.log('Local time (EAT):', new Date().toLocaleString('en-ET', { timeZone: 'Africa/Addis_Ababa' }));

  try {
    while (hasMore) {
      const reservations = await prisma.reservation.findMany({
        where: {
          startTime: {
            lte: now,
          },
        },
        include: {
          classroom: true,
          user: { select: { id: true, username: true } },
        },
        take: batchSize,
        orderBy: { startTime: 'asc' },
      });

      if (reservations.length === 0) {
        console.log('No more reservations to process.');
        break;
      }

      for (const reservation of reservations) {
        await prisma.$transaction(async (tx) => {
          const existing = await tx.occupancy.findFirst({
            where: {
              classroomId: reservation.classroomId,
              userId: reservation.userId,
              startTime: reservation.startTime,
              endTime: reservation.endTime,
            },
          });

          if (existing) {
            console.log(`Occupancy already exists for reservation ${reservation.id}, deleting reservation...`);
            await tx.reservation.delete({ where: { id: reservation.id } });
            return;
          }

          await tx.occupancy.create({
            data: {
              classroomId: reservation.classroomId,
              userId: reservation.userId,
              startTime: reservation.startTime,
              endTime: reservation.endTime,
              status: 'occupied',
            },
          });

          await tx.reservation.delete({ where: { id: reservation.id } });
          console.log(`Converted reservation ${reservation.id} to occupancy.`);
        });
      }

      if (reservations.length < batchSize) {
        hasMore = false;
      } else {
        await sleep(200);
      }
    }

    console.log('🎉 Finished all processing at:', new Date().toISOString());
  } catch (error) {
    console.error('Error during reservation conversion:', error);
  }
}

// Run every 1 minute (change to '*/5 * * * *' for 5-min interval)
cron.schedule('*/5 * * * *', async () => {
  console.log('\nCron job triggered at:', new Date().toISOString());
  await convertReservationsToOccupancies();
});

module.exports = convertReservationsToOccupancies;
