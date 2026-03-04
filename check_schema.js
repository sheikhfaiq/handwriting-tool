const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkSchema() {
    try {
        // Try to fetch a post and see what fields it has
        const post = await prisma.post.findFirst();
        console.log("Post keys:", Object.keys(post || {}));

        if (post && 'conclusion' in post) {
            console.log("SUCCESS: 'conclusion' column exists in the DB client (somehow).");
        } else {
            console.log("INFO: 'conclusion' column not found in current client keys.");
        }

        // Direct SQL query to check columns in PostgreSQL
        const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Post'
    `;
        console.log("DB Columns for 'Post':", columns.map(c => c.column_name));

    } catch (error) {
        console.error("Error checking schema:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkSchema();
