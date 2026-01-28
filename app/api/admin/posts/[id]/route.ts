import { NextResponse } from "next/server";
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
        const { title, content, excerpt, coverImage, published, categoryId, slug: userSlug } = await req.json();
        const slug = userSlug
            ? slugify(userSlug, { lower: true, strict: true })
            : slugify(title, { lower: true, strict: true });

        const post = await (prisma as any).post.update({
            where: { id: params.id },
            data: {
                title,
                content,
                excerpt,
                coverImage,
                published,
                categoryId,
                slug,
            },
        });

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
        await prisma.post.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
