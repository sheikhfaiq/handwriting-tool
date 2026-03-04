const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkConnection() {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    console.log("SUCCESS: Database connection established.");
    console.log(`Total users in DB: ${userCount}`);
    
    // Check tables
    const tables = ["User", "Page", "Category", "Post", "Menu", "MenuItem"];
    console.log("\nTable Check:");
    for (const table of tables) {
      const count = await prisma[table.charAt(0).toLowerCase() + table.slice(1)].count();
      console.log(`- ${table}: ${count} records`);
    }
    
  } catch (error) {
    console.error("FAILURE: Could not connect to the database.");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
