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

        // Use a transaction to ensure integrity
        const menu = await (prisma as any).$transaction(async (tx: any) => {
            // 1. Find or create the menu to get its ID
            let menu = await tx.menu.findUnique({ where: { name } });
            if (!menu) {
                menu = await tx.menu.create({ data: { name } });
            }

            // 2. Delete existing items
            await tx.menuItem.deleteMany({ where: { menuId: menu.id } });

            // 3. Create items in two passes to handle parent-child relationships
            // Pass 1: Create all items without parentId, map temp IDs to real DB IDs
            const idMap = new Map<string, string>(); // clientSideId -> dbId

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const createdItem = await tx.menuItem.create({
                    data: {
                        label: item.label,
                        url: item.url,
                        order: i, // Use the index directly as order
                        menuId: menu.id,
                        parentId: null // constant for first pass
                    }
                });
                idMap.set(item.id, createdItem.id);
            }

            // Pass 2: Update items with correct parentId
            for (const item of items) {
                if (item.parentId && idMap.has(item.parentId)) {
                    const dbId = idMap.get(item.id);
                    const dbParentId = idMap.get(item.parentId);

                    if (dbId && dbParentId) {
                        await tx.menuItem.update({
                            where: { id: dbId },
                            data: { parentId: dbParentId }
                        });
                    }
                }
            }

            return menu;
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
