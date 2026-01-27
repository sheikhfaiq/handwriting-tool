import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const menus = await (prisma as any).menu.findMany({
            include: {
                items: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });
        return NextResponse.json(menus);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch menus" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions) as any;
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, items } = await req.json();

        const menu = await (prisma as any).menu.upsert({
            where: { name },
            update: {
                items: {
                    deleteMany: {},
                    create: items.map((item: any, index: number) => ({
                        label: item.label,
                        url: item.url,
                        order: index,
                    }))
                }
            },
            create: {
                name,
                items: {
                    create: items.map((item: any, index: number) => ({
                        label: item.label,
                        url: item.url,
                        order: index,
                    }))
                }
            }
        });

        return NextResponse.json(menu);
    } catch (error) {
        console.error("Save menu error:", error);
        return NextResponse.json({ error: "Failed to save menu" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions) as any;
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name } = await req.json();
        if (name === "HEADER" || name === "FOOTER") {
            return NextResponse.json({ error: "Cannot delete compulsory menus" }, { status: 400 });
        }

        await (prisma as any).menu.delete({ where: { name } });
        return NextResponse.json({ message: "Menu deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete menu" }, { status: 500 });
    }
}
