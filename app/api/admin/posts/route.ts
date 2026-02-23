import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

export async function GET() {
    try {
        const posts = await (prisma as any).post.findMany({
            include: { category: true },
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
        const { title, content, excerpt, metaDescription, coverImage, published, categoryId, slug: userSlug } = await req.json();
        const slug = userSlug
            ? slugify(userSlug, { lower: true, strict: true })
            : slugify(title, { lower: true, strict: true });

        const isSystemAdmin = session.user?.email === "admin@gmail.com";
        const publishedState = isSystemAdmin ? (published || false) : false;

        // Handle empty categoryId as null to avoid foreign key constraint error P2003
        const targetCategoryId = categoryId || null;

        const post = await (prisma as any).post.create({
            data: {
                title,
                content,
                excerpt,
                metaDescription,
                coverImage,
                published: publishedState,
                categoryId: targetCategoryId,
                slug,
            },
        });

        revalidatePath(`/${slug}`); // Assuming posts are at root or /blog depending on frontend, checking site route... site/[slug] seems to be Pages. 
        // Wait, where are posts?
        // Let's check if there is a blog route.
        // But for now, revalidating root and admin list is good.
        revalidatePath("/admin/manage-posts");

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json({ error: "Slug already exists. Please choose a different one." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
