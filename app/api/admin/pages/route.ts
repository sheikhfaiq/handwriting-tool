import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const prismaAny = prisma as any;
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import slugify from "slugify";

export async function GET() {
    try {
        const pages = await prismaAny.page.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(pages);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, content, metaDescription, published } = await req.json();
        const slug = slugify(title, { lower: true, strict: true });

        const page = await prismaAny.page.create({
            data: {
                title,
                content,
                metaDescription,
                published: published || false,
                slug,
            },
        });

        return NextResponse.json(page, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
    }
}
