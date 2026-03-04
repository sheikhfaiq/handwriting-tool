const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function check() {
    const columns = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Post'`;
    console.log("COLUMNS:" + columns.map(c => c.column_name).join(","));
    process.exit(0);
}
check();
