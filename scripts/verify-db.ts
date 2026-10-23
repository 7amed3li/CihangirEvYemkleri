import "dotenv/config";
import { prisma } from "../src/lib/db/prisma";

async function main() {
  try {
    const prodCount = await prisma.product.count();
    const catCount = await prisma.category.count();
    const userCount = await prisma.adminUser.count();
    const dailyCount = await prisma.dailyMenu.count();
    const offerCount = await prisma.offer.count();
    const auditCount = await prisma.auditLog.count();
    console.log("DB STATUS:", { prodCount, catCount, userCount, dailyCount, offerCount, auditCount });
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error("PRISMA_CLIENT_ERROR:", err);
    process.exit(1);
  }
}

main();
