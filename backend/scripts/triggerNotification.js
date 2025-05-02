const { PrismaClient } = require('@prisma/client');
const { DateTime } = require('luxon');
const cron = require('node-cron');

const prisma = new PrismaClient();

// Utility: Sleep function to avoid hammering DB
const sleepInMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function triggerNotification() {
  const now = DateTime.utc();
  const batchSize = 10;
  let hasMore = true;

  try {
    while (hasMore) {
      const occupancies = await prisma.occupancy.findMany({
        where: {
          startTime: {
            lte: now.toJSDate(),
          },
          status: 'occupied',
          // Ensure no notification has been sent yet
          notifications: {
            none: {},
          },
        },
        include: {
          classroom: true,
          user: { select: { id: true, username: true } },
        },
        take: batchSize,
        orderBy: { startTime: 'asc' },
      });

      if (occupancies.length === 0) {
        console.log('No occupancies to notify.');
        break;
      }

      for (const occupancy of occupancies) {
        await prisma.$transaction(async (tx) => {
          await tx.notification.create({
            data: {
              userId: occupancy.userId,
              message: `Your occupancy for classroom ${occupancy.classroom.name} has started.`,
            },
          });
          console.log(`Sent notification for occupancy ${occupancy.id}.`);
        });
      }

      if (occupancies.length < batchSize) {
        hasMore = false;
      } else {
        await sleepInMs(200);
      }
    }

    console.log('🎉 Finished notification processing at:', new Date().toISOString());
  } catch (error) {
    console.error('Error during notification triggering:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('\nNotification cron job triggered at:', new Date().toISOString());
  await triggerNotification();
});

module.exports = triggerNotification;