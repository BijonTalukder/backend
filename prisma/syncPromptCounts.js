const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function syncPromptCounts() {
  console.log("Starting sync of prompt counts from PromptInteraction...");

  const prompts = await prisma.prompt.findMany({
    select: { id: true, title: true },
  });
  console.log(`Found ${prompts.length} prompts.`);

  const agg = await prisma.promptInteraction.groupBy({
    by: ["promptId", "type"],
    _count: { _all: true },
  });
  console.log(`Found ${agg.length} grouped interaction records.`);

  const countMap = {};
  for (const row of agg) {
    if (!countMap[row.promptId]) countMap[row.promptId] = { view: 0, like: 0, share: 0 };
    countMap[row.promptId][row.type] = row._count._all;
  }

  let updated = 0;
  const batchSize = 50;
  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    await prisma.$transaction(
      batch.map((p) => {
        const c = countMap[p.id] || { view: 0, like: 0, share: 0 };
        return prisma.prompt.update({
          where: { id: p.id },
          data: { viewCount: c.view, likeCount: c.like, shareCount: c.share },
        });
      })
    );
    updated += batch.length;
    console.log(`  Progress: ${updated}/${prompts.length}`);
  }

  console.log("Done! All prompt counts synced.");
}

syncPromptCounts()
  .catch((err) => {
    console.error("Sync failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
