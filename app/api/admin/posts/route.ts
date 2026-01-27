import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import slugify from "slugify";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, content, excerpt, coverImage, published, category, slug: userSlug } = await req.json();
        const slug = userSlug
            ? slugify(userSlug, { lower: true, strict: true })
            : slugify(title, { lower: true, strict: true });

        const post = await prisma.post.create({
            data: {
                title,
                content,
                excerpt,
                coverImage,
                published: published || false,
                category,
                slug,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json({ error: "Slug already exists. Please choose a different one." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
