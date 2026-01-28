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
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
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
        const { name, slug: userSlug } = await req.json();
        const slug = userSlug
            ? slugify(userSlug, { lower: true, strict: true })
            : slugify(name, { lower: true, strict: true });

        const category = await prisma.category.update({
            where: { id: params.id },
            data: {
                name,
                slug,
            },
        });

        return NextResponse.json(category);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Category or slug already exists." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
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

        // Check if category has posts
        const postCount = await prisma.post.count({
            where: { categoryId: params.id }
        });

        if (postCount > 0) {
            return NextResponse.json({
                error: "Cannot delete category with associated posts. Please reassign or delete the posts first."
            }, { status: 400 });
        }

        await prisma.category.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
