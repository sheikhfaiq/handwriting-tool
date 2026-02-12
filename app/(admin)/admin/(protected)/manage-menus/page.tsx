"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
    GripVertical,
    Plus,
    Trash2,
    Save,
    Loader2,
    ChevronRight,
    ChevronDown,
    Search,
    Layout,
    Type,
    Link as LinkIcon,
    AlertCircle,
    ArrowRight,
    ArrowLeft
} from "lucide-react";

interface MenuItem {
    id: string;
    label: string;
    url: string;
    order: number;
    depth: number; // 0 = root, 1 = child
    parentId?: string | null;
}

interface Menu {
    id: string;
    name: string;
    items: MenuItem[];
}

export default function ManageMenus() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [pages, setPages] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeMenuName, setActiveMenuName] = useState("HEADER");
    const [newMenuName, setNewMenuName] = useState("");
    const [isCreatingMenu, setIsCreatingMenu] = useState(false);

    // Sidebar Accordion State
    const [sectionsOpen, setSectionsOpen] = useState({
        pages: true,
        posts: false,
        links: false,
        defaults: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [menusRes, pagesRes, postsRes] = await Promise.all([
                fetch("/api/admin/menus"),
                fetch("/api/admin/pages"),
                fetch("/api/admin/posts")
            ]);

            const menusData = await menusRes.json();
            const pagesData = await pagesRes.json();
            const postsData = await postsRes.json();

            // Reconstruct hierarchy from parentId if needed
            const processedMenus = menusData.map((m: any) => ({
                ...m,
                items: computeDepthFromStructure(m.items)
            }));

            // Ensure compulsory menus exist
            let finalMenus = processedMenus;
            const compulsory = ["HEADER", "FOOTER", "FOOTER_NAV", "FOOTER_HELP"];
            compulsory.forEach(name => {
                if (!finalMenus.find((m: any) => m.name === name)) {
                    finalMenus.push({ name, items: [] });
                }
            });

            setMenus(finalMenus);
            setPages(pagesData);
            setPosts(postsData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Compute depth based on parentId for initial load
    const computeDepthFromStructure = (items: any[]) => {
        if (!items) return [];
        // Map ID -> Item
        const map = new Map();
        items.forEach(i => map.set(i.id, i));

        return items.map(i => {
            let depth = 0;
            let parent = map.get(i.parentId);
            while (parent) {
                depth++;
                parent = map.get(parent.parentId);
            }
            return { ...i, depth };
        });
    };

    const activeMenu = menus.find(m => m.name === activeMenuName) || { name: activeMenuName, items: [] };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(activeMenu.items);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updateMenuItems(items);
    };

    const updateMenuItems = (items: MenuItem[]) => {
        // Recalculate parentId based on depth and order logic?
        // Actually, Indent/Outdent should explicitly set parentId.
        // But for Drag/Drop order change, we might break the "Parent must be above Child" rule if not careful.
        // Let's implement robust "Save" logic that reconstructs parentIds based on visual depth.
        setMenus(menus.map(m => m.name === activeMenuName ? { ...m, items } : m));
    };

    const indentItem = (index: number) => {
        const items = [...activeMenu.items];
        const item = items[index];
        const prevItem = items[index - 1];

        if (!prevItem) return; // Cannot indent top item
        if (item.depth >= 5) return; // Max depth

        // Logic: Indent increases depth.
        item.depth = (item.depth || 0) + 1;
        updateMenuItems(items);
    };

    const outdentItem = (index: number) => {
        const items = [...activeMenu.items];
        const item = items[index];

        if (!item.depth || item.depth <= 0) return;

        item.depth = item.depth - 1;
        updateMenuItems(items);
    };

    const addItem = (label: string, url: string) => {
        const newItem: MenuItem = {
            id: `new-${Date.now()}`,
            label,
            url,
            order: activeMenu.items.length,
            depth: 0,
            parentId: null
        };
        updateMenuItems([...activeMenu.items, newItem]);
    };

    const removeItem = (id: string) => {
        updateMenuItems(activeMenu.items.filter(item => item.id !== id));
    };

    const updateItemField = (id: string, field: string, value: string) => {
        const items = activeMenu.items.map(item => item.id === id ? { ...item, [field]: value } : item);
        updateMenuItems(items);
    };

    const saveMenu = async () => {
        setSaving(true);
        try {
            // Reconstruct parentIds based on depth and order
            const itemsToSave = [];
            const parentStack: { [depth: number]: string | null } = { [-1]: null };

            for (const item of activeMenu.items) {
                const depth = item.depth || 0;
                // Parent is the last item seen at depth-1
                const parentId = parentStack[depth - 1] || null;

                // Add to stack for children
                parentStack[depth] = item.id;

                // Clear deeper stacks
                for (let d = depth + 1; d < 10; d++) {
                    delete parentStack[d];
                }

                itemsToSave.push({
                    ...item,
                    parentId,
                    depth // Keep depth for next fetch optimistically? (API doesn't store depth, only parentId)
                });
            }

            const res = await fetch("/api/admin/menus", {
                method: "POST",
                body: JSON.stringify({ name: activeMenuName, items: itemsToSave }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) alert(`Menu "${activeMenuName}" saved successfully!`);
        } catch (error) {
            console.error(error);
            alert("Failed to save menu");
        } finally {
            setSaving(false);
        }
    };

    const createNewMenu = async () => {
        if (!newMenuName) return;
        const name = newMenuName.toUpperCase().replace(/\s+/g, '_');
        if (menus.find(m => m.name === name)) {
            alert("Menu already exists");
            return;
        }
        setMenus([...menus, { id: `temp-${Date.now()}`, name, items: [] }]);
        setActiveMenuName(name);
        setNewMenuName("");
        setIsCreatingMenu(false);
    };

    const deleteMenu = async (name: string) => {
        const compulsory = ["HEADER", "FOOTER", "FOOTER_NAV", "FOOTER_HELP"];
        if (compulsory.includes(name)) return;
        if (!confirm(`Are you sure you want to delete the menu "${name}"?`)) return;

        try {
            const res = await fetch("/api/admin/menus", {
                method: "DELETE",
                body: JSON.stringify({ name }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                setMenus(menus.filter(m => m.name !== name));
                setActiveMenuName("HEADER");
            }
        } catch (error) {
            alert("Failed to delete menu");
        }
    };

    const toggleSection = (section: keyof typeof sectionsOpen) => {
        setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-[#1e355e]" size={40} /></div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-[#1e355e] tracking-tight">Menus</h1>
                    <p className="text-gray-400 mt-2">Manage your website navigation menus.</p>
                </div>
                <button
                    onClick={() => setIsCreatingMenu(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1e355e] text-white rounded-2xl hover:bg-blue-600 transition-all font-bold shadow-lg shadow-blue-900/10"
                >
                    <Plus size={20} /> Create New Menu
                </button>
            </div>

            {/* Menu Selection */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                <span className="text-sm font-bold text-[#1e355e] uppercase tracking-wider">Select a menu to edit:</span>
                <select
                    value={activeMenuName}
                    onChange={(e) => setActiveMenuName(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-[#1e355e] outline-none focus:ring-2 focus:ring-[#1e355e]/10 min-w-[200px]"
                >
                    {menus.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
                {!["HEADER", "FOOTER", "FOOTER_NAV", "FOOTER_HELP"].includes(activeMenuName) && (
                    <button
                        onClick={() => deleteMenu(activeMenuName)}
                        className="text-red-400 hover:text-red-600 text-xs font-bold hover:underline"
                    >
                        Delete Menu
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Sidebar: Add Menu Items */}
                <div className="space-y-4">

                    {/* Default Pages */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <button
                            onClick={() => toggleSection('defaults')}
                            className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="text-lg font-black text-[#1e355e] flex items-center gap-2">
                                <Layout size={18} className="text-purple-500" /> Default Pages
                            </h3>
                            {sectionsOpen.defaults ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        {sectionsOpen.defaults && (
                            <div className="p-6 pt-0 space-y-2 border-t border-gray-50">
                                <button
                                    onClick={() => addItem("Home", "/")}
                                    className="w-full text-left p-3 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-600 flex justify-between items-center group transition-colors"
                                >
                                    Home <Plus size={16} className="text-gray-300 group-hover:text-purple-500" />
                                </button>
                                <button
                                    onClick={() => addItem("Blog", "/blog")}
                                    className="w-full text-left p-3 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-600 flex justify-between items-center group transition-colors"
                                >
                                    Blog <Plus size={16} className="text-gray-300 group-hover:text-purple-500" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pages */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <button
                            onClick={() => toggleSection('pages')}
                            className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="text-lg font-black text-[#1e355e] flex items-center gap-2">
                                <Layout size={18} className="text-blue-500" /> Pages
                            </h3>
                            {sectionsOpen.pages ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        {sectionsOpen.pages && (
                            <div className="p-6 pt-0 space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar border-t border-gray-50">
                                {pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => addItem(page.title, `/${page.slug}`)}
                                        className="w-full text-left p-3 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-600 flex justify-between items-center group transition-colors"
                                    >
                                        {page.title}
                                        <Plus size={16} className="text-gray-300 group-hover:text-blue-500" />
                                    </button>
                                ))}
                                {pages.length === 0 && <p className="text-xs text-gray-400 italic p-3">No pages found.</p>}
                            </div>
                        )}
                    </div>

                    {/* Posts */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <button
                            onClick={() => toggleSection('posts')}
                            className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="text-lg font-black text-[#1e355e] flex items-center gap-2">
                                <Type size={18} className="text-orange-500" /> Posts
                            </h3>
                            {sectionsOpen.posts ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        {sectionsOpen.posts && (
                            <div className="p-6 pt-0 space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar border-t border-gray-50">
                                {posts.map(post => (
                                    <button
                                        key={post.id}
                                        onClick={() => addItem(post.title, `/blog/${post.slug}`)}
                                        className="w-full text-left p-3 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-600 flex justify-between items-center group transition-colors"
                                    >
                                        <span className="truncate flex-1 mr-2">{post.title}</span>
                                        <Plus size={16} className="text-gray-300 group-hover:text-orange-500" />
                                    </button>
                                ))}
                                {posts.length === 0 && <p className="text-xs text-gray-400 italic p-3">No posts found.</p>}
                            </div>
                        )}
                    </div>

                    {/* Custom Link */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <button
                            onClick={() => toggleSection('links')}
                            className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="text-lg font-black text-[#1e355e] flex items-center gap-2">
                                <LinkIcon size={18} className="text-green-500" /> Custom Link
                            </h3>
                            {sectionsOpen.links ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>

                        {sectionsOpen.links && (
                            <div className="p-6 pt-0 space-y-3 border-t border-gray-50">
                                <input
                                    type="text"
                                    placeholder="Label (e.g., Google)"
                                    id="custom-label"
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500/10"
                                />
                                <input
                                    type="text"
                                    placeholder="URL (e.g., https://...)"
                                    id="custom-url"
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500/10"
                                />
                                <button
                                    onClick={() => {
                                        const l = (document.getElementById('custom-label') as HTMLInputElement).value;
                                        const u = (document.getElementById('custom-url') as HTMLInputElement).value;
                                        if (l && u) {
                                            addItem(l, u);
                                            (document.getElementById('custom-label') as HTMLInputElement).value = '';
                                            (document.getElementById('custom-url') as HTMLInputElement).value = '';
                                        }
                                    }}
                                    className="w-full py-2.5 bg-gray-100 text-[#1e355e] rounded-xl font-bold text-sm hover:bg-green-500 hover:text-white transition-all"
                                >
                                    Add to Menu
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main: Drag and Drop Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#1e355e]">Menu Structure</h2>
                                <p className="text-sm text-gray-400">Drag items to reorder. Use arrows to nest.</p>
                            </div>
                            <button
                                onClick={saveMenu}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saving ? "Saving..." : "Save Menu"}
                            </button>
                        </div>

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="menu-items">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 flex-1">
                                        {activeMenu.items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${snapshot.isDragging
                                                            ? "bg-white border-blue-200 shadow-2xl scale-[1.02] z-50"
                                                            : "bg-gray-50 border-gray-100 hover:border-gray-200"
                                                            }`}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            marginLeft: `${(item.depth || 0) * 40}px`,
                                                            borderColor: (item.depth || 0) > 0 ? '#BFDBFE' : '' // Subtle blue border for nested
                                                        }}
                                                    >
                                                        <div {...provided.dragHandleProps} className="p-2 cursor-grab active:cursor-grabbing">
                                                            <GripVertical className="text-gray-300" size={20} />
                                                        </div>
                                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <span className="text-[10px] uppercase font-black text-gray-400 ml-1">Label</span>
                                                                <input
                                                                    type="text"
                                                                    value={item.label}
                                                                    onChange={(e) => updateItemField(item.id, 'label', e.target.value)}
                                                                    className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm font-bold text-[#1e355e] shadow-sm"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-[10px] uppercase font-black text-gray-400 ml-1">URL / Slug</span>
                                                                <input
                                                                    type="text"
                                                                    value={item.url}
                                                                    onChange={(e) => updateItemField(item.id, 'url', e.target.value)}
                                                                    className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm text-gray-500 shadow-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Nesting Controls */}
                                                        <div className="flex flex-col gap-1 justify-center">
                                                            <button
                                                                onClick={() => indentItem(index)}
                                                                className="text-gray-300 hover:text-blue-500 p-1"
                                                            >
                                                                <ArrowRight size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => outdentItem(index)}
                                                                className="text-gray-300 hover:text-blue-500 p-1"
                                                            >
                                                                <ArrowLeft size={16} />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all self-end mb-1"
                                                            title="Remove Item"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        {activeMenu.items.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-100 text-gray-400">
                                                <AlertCircle size={40} className="mb-2 opacity-20" />
                                                <p className="font-bold">No menu items yet.</p>
                                                <p className="text-xs">Add items from the sidebar to start building.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>

            {/* Create Menu Modal Overlay */}
            {isCreatingMenu && (
                <div className="fixed inset-0 bg-[#1e355e]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-3xl font-black text-[#1e355e] mb-2">Create Menu</h2>
                        <p className="text-gray-400 mb-8">Give your new menu a name.</p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-[#1e355e] ml-2">Menu Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sidebar Navigation"
                                    value={newMenuName}
                                    onChange={(e) => setNewMenuName(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-[#1e355e]/10"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsCreatingMenu(false)}
                                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createNewMenu}
                                    disabled={!newMenuName}
                                    className="flex-1 py-4 bg-[#1e355e] text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50"
                                >
                                    Create Menu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
