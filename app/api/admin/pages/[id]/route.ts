import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const prismaAny = prisma as any;
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import slugify from "slugify";

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const page = await prismaAny.page.findUnique({
            where: { id: params.id },
        });

        if (!page) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
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
        const { title, content, metaDescription, published } = await req.json();
        const slug = slugify(title, { lower: true, strict: true });

        const isSystemAdmin = session.user?.email === "admin@gmail.com";
        const existingPage = await prismaAny.page.findUnique({ where: { id: params.id } });

        // System Admins can set published status. Non-admins are forced to false (Draft).
        const publishedState = isSystemAdmin ? published : false;

        const page = await prismaAny.page.update({
            where: { id: params.id },
            data: {
                title,
                content,
                metaDescription,
                published: publishedState,
                slug,
            },
        });

        revalidatePath(`/${slug}`);
        if (existingPage?.slug && existingPage.slug !== slug) {
            revalidatePath(`/${existingPage.slug}`);
        }
        revalidatePath("/admin/manage-pages");

        return NextResponse.json(page);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
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

        // 1. Get the page slug before deleting
        const page = await prismaAny.page.findUnique({
            where: { id: params.id },
            select: { slug: true }
        });

        // 2. Delete associated menu items if page exists
        if (page?.slug) {
            await prismaAny.menuItem.deleteMany({
                where: { url: `/${page.slug}` }
            });
        }

        await prismaAny.page.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Page deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
    }
}
