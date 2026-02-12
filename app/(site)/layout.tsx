import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import prisma from "@/lib/prisma";
import React from "react";

async function getMenus() {
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
        return menus;
    } catch (error) {
        console.error("Failed to fetch menus:", error);
        return [];
    }
}

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const menus = await getMenus();

    // Process Header Menu
    const headerMenu = menus.find((m: any) => m.name === "HEADER");
    // Pass full item structure for nesting support
    // Sort logic should be handled by DB orderBy, but we ensure here if needed.
    const headerItems = headerMenu?.items.map((item: any) => ({
        id: item.id,
        label: item.label,
        url: item.url,
        parentId: item.parentId,
        order: item.order
    })) || [];

    // Process Footer Menus
    const footerNav = menus.find((m: any) => m.name === "FOOTER_NAV");
    const footerNavItems = footerNav?.items || [];

    const footerHelp = menus.find((m: any) => m.name === "FOOTER_HELP");
    const footerHelpItems = footerHelp?.items || [];

    return (
        <React.Fragment>
            <Header initialNavItems={headerItems} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer initialNavItems={footerNavItems} initialHelpItems={footerHelpItems} />
        </React.Fragment>
    );
}
