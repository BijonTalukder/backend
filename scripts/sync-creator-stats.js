const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting CreatorStat sync...\n');

  const users = await prisma.user.findMany({
    where: { role: { not: 'admin' } },
    select: { id: true, name: true },
  });

  console.log(`Found ${users.length} non-admin users\n`);

  let synced = 0;
  let errors = 0;

  for (const u of users) {
    try {
      const prompts = await prisma.prompt.findMany({
        where: { createdBy: u.id },
        select: { likeCount: true, viewCount: true },
      });

      const promptCount = prompts.length;
      const totalLikes = prompts.reduce((sum, p) => sum + (p.likeCount || 0), 0);
      const totalViews = prompts.reduce((sum, p) => sum + (p.viewCount || 0), 0);
      const totalCopies = totalViews;
      const score = totalLikes * 10 + totalViews * 1 + promptCount * 100 + totalCopies * 2;

      await prisma.creatorStat.upsert({
        where: { userId: u.id },
        create: { userId: u.id, promptCount, totalLikes, totalViews, totalCopies, score },
        update: { promptCount, totalLikes, totalViews, totalCopies, score },
      });

      synced++;
      process.stdout.write(`\r  [${synced}/${users.length}] ${u.name || u.id} — ${promptCount} prompts, ${totalLikes} likes, ${totalViews} views, score ${score}`);
    } catch (err) {
      errors++;
      console.error(`\n  ERROR syncing ${u.name || u.id}: ${err.message}`);
    }
  }

  console.log(`\n\nDone! ${synced} users synced, ${errors} errors.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  prisma.$disconnect();
  process.exit(1);
});
