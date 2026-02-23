import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import slugify from "slugify";

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const post = await (prisma as any).post.findUnique({
            where: { id: params.id },
            include: { category: true },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const params = await props.params;
        const { title, content, excerpt, metaDescription, coverImage, published, categoryId, slug: userSlug } = await req.json();

        // Handle empty categoryId as null to avoid foreign key constraint error P2003
        const targetCategoryId = categoryId || null;

        const slug = userSlug
            ? slugify(userSlug, { lower: true, strict: true })
            : slugify(title, { lower: true, strict: true });

        const isSystemAdmin = session.user?.email === "admin@gmail.com";
        // Fetch existing to handle slug changes for revalidation
        const existingPost = await (prisma as any).post.findUnique({ where: { id: params.id } });

        const post = await (prisma as any).post.update({
            where: { id: params.id },
            data: {
                title,
                content,
                excerpt,
                metaDescription,
                coverImage,
                published: isSystemAdmin ? published : false, // Force draft if not System Admin
                categoryId: targetCategoryId,
                slug,
            },
        });

        if (existingPost?.slug && existingPost.slug !== slug) {
            revalidatePath(`/${existingPost.slug}`);
            // If posts are under /blog, we should revalidate that.
            // But revalidating generic path is safer.
        }
        revalidatePath(`/${slug}`);
        revalidatePath("/admin/manage-posts");

        return NextResponse.json(post);
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json({ error: "Slug already exists. Please choose a different one." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const params = await props.params;

        // 1. Get the post slug before deleting
        const post = await (prisma as any).post.findUnique({
            where: { id: params.id },
            select: { slug: true }
        });

        // 2. Delete associated menu items if post exists
        // Assuming blog posts are served at /blog/[slug]
        if (post?.slug) {
            await (prisma as any).menuItem.deleteMany({
                where: { url: `/blog/${post.slug}` }
            });
        }

        await prisma.post.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
