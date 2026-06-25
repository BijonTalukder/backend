const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // MongoDB: update all documents where platform doesn't exist or is null
  const result = await prisma.$runCommandRaw({
    update: 'Prompt',
    updates: [
      {
        q: { $or: [{ platform: { $exists: false } }, { platform: null }] },
        u: { $set: { platform: 'ALL' } },
        multi: true,
      },
    ],
  });

  console.log(`Updated ${result.nModified || 0} prompts to platform=ALL`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
