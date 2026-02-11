import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import prisma from "@/lib/prisma";

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
    const headerItems = headerMenu?.items.map((item: any) => ({
        label: item.label, // Map label to name for Header component if needed, or update Header to use label
        url: item.url
    })) || [];

    // Process Footer Menus
    const footerNav = menus.find((m: any) => m.name === "FOOTER_NAV");
    const footerNavItems = footerNav?.items || [];

    const footerHelp = menus.find((m: any) => m.name === "FOOTER_HELP");
    const footerHelpItems = footerHelp?.items || [];

    return (
        <>
            <Header initialNavItems={headerItems} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer initialNavItems={footerNavItems} initialHelpItems={footerHelpItems} />
        </>
    );
}
