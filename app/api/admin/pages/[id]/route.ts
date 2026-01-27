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
        const page = await prisma.page.findUnique({
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
        const { title, content, published } = await req.json();
        const slug = slugify(title, { lower: true, strict: true });

        const page = await prisma.page.update({
            where: { id: params.id },
            data: {
                title,
                content,
                published,
                slug,
            },
        });

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
        await prisma.page.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Page deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
    }
}
