import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

export async function GET() {
    try {
        const categories = await (prisma as any).category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, slug: userSlug } = await req.json();
        const slug = userSlug
            ? slugify(userSlug, { lower: true, strict: true })
            : slugify(name, { lower: true, strict: true });

        const category = await (prisma as any).category.create({
            data: {
                name,
                slug,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Category or slug already exists." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
