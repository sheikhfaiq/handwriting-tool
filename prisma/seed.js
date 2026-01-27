const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("admin123", 10);

    const user = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {
            password: password, // ensure password is set/updated if user exists
        },
        create: {
            email: "admin@example.com",
            name: "Admin User",
            password: password,
            role: "ADMIN",
        },
    });

    console.log("Admin user created/updated:", user);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
