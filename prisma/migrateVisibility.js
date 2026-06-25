const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  try {
    await prisma.$connect();

    // Add missing `visibility` field to documents that don't have it
    const visResult = await prisma.$runCommandRaw({
      update: 'Prompt',
      updates: [
        {
          q: { visibility: { $exists: false } },
          u: { $set: { visibility: 'PUBLIC' } },
          multi: true,
        },
      ],
    });
    console.log(`Visibility migration:`, JSON.stringify(visResult));

    // Add missing `platform` field to documents that don't have it
    const platResult = await prisma.$runCommandRaw({
      update: 'Prompt',
      updates: [
        {
          q: { platform: { $exists: false } },
          u: { $set: { platform: 'ALL' } },
          multi: true,
        },
      ],
    });
    console.log(`Platform migration:`, JSON.stringify(platResult));

    // Verify
    const total = await prisma.prompt.count();
    const withVis = await prisma.prompt.count({ where: { visibility: 'PUBLIC' } });
    const withPlat = await prisma.prompt.count({ where: { platform: 'ALL' } });
    console.log(`Total prompts: ${total}`);
    console.log(`With visibility=PUBLIC: ${withVis}`);
    console.log(`With platform=ALL: ${withPlat}`);
  } catch (e) {
    console.error('Migration failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
