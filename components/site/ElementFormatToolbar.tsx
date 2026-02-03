import React from 'react';
import {
    Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, AlignLeft, AlignCenter,
    AlignRight, AlignJustify, Trash2, X,
    Type, Palette, ChevronDown, Pin
} from 'lucide-react';
import { Element } from './ConverterSection';

interface ElementFormatToolbarProps {
    element: Element;
    onUpdate: (id: string, updates: Partial<Element>) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];
const lineHeights = [1, 1.2, 1.5, 1.8, 2, 2.5];

export default function ElementFormatToolbar({
    element,
    onUpdate,
    onDelete,
    onClose
}: ElementFormatToolbarProps) {
    const { style } = element;
    const textColorInputRef = React.useRef<HTMLInputElement>(null);
    const bgColorInputRef = React.useRef<HTMLInputElement>(null);

    const updateStyle = (updates: any) => {
        onUpdate(element.id, {
            style: { ...style, ...updates }
        });
    };

    const toggleList = (type: 'bullet' | 'ordered') => {
        const lines = element.text.split('\n');
        let newText = '';
        const isCurrentlyBullet = style.isList;
        const isCurrentlyOrdered = style.isOrderedList;

        if (type === 'bullet') {
            if (isCurrentlyBullet) {
                // Remove bullets
                newText = lines.map(line => line.replace(/^[•◦\-★>]\s*/, '')).join('\n');
                updateStyle({ isList: false });
            } else {
                // Add bullets
                newText = lines.map(line => line.startsWith('• ') ? line : `• ${line.replace(/^\d+\.\s*/, '')}`).join('\n');
                updateStyle({ isList: true, isOrderedList: false });
            }
        } else {
            if (isCurrentlyOrdered) {
                // Remove numbers
                newText = lines.map(line => line.replace(/^\d+\.\s*/, '')).join('\n');
                updateStyle({ isOrderedList: false });
            } else {
                // Add numbers
                newText = lines.map((line, i) => {
                    const cleanLine = line.replace(/^[•◦\-★>]\s*/, '').replace(/^\d+\.\s*/, '');
                    return `${i + 1}. ${cleanLine}`;
                }).join('\n');
                updateStyle({ isOrderedList: true, isList: false });
            }
        }
        onUpdate(element.id, { text: newText });
    };

    const FormatButton = ({ children, active, onClick, title }: any) => (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg transition-all ${active
                ? 'bg-[#373e4a] text-white'
                : 'bg-[#2b303b] text-gray-400 hover:text-white hover:bg-[#373e4a]'
                }`}
        >
            {children}
        </button>
    );

    return (
        <div className="fixed top-20 right-8 w-[320px] bg-[#1e222d] rounded-xl shadow-2xl border border-[#2b303b] overflow-hidden z-[100] text-gray-300 select-none">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[#2b303b]">
                <button onClick={() => onDelete(element.id)} className="text-red-500 hover:text-red-400 p-1">
                    <Trash2 size={20} />
                </button>
                <div className="flex gap-1">
                    <button className="text-gray-500 hover:text-gray-400 p-1">
                        <Pin size={18} />
                    </button>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-400 p-1">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Style Buttons Row 1 */}
                <div className="grid grid-cols-4 gap-2">
                    <FormatButton active={style.bold} onClick={() => updateStyle({ bold: !style.bold })} title="Bold">
                        <Bold size={18} />
                    </FormatButton>
                    <FormatButton active={style.underline} onClick={() => updateStyle({ underline: !style.underline })} title="Underline">
                        <Underline size={18} />
                    </FormatButton>
                    <FormatButton active={style.italic} onClick={() => updateStyle({ italic: !style.italic })} title="Italic">
                        <Italic size={18} />
                    </FormatButton>
                    <FormatButton active={style.textAlign === 'justify'} onClick={() => updateStyle({ textAlign: 'justify' })} title="Justify">
                        <AlignJustify size={18} />
                    </FormatButton>
                </div>

                {/* List Buttons Row */}
                <div className="grid grid-cols-2 gap-2">
                    <FormatButton active={style.isList} onClick={() => toggleList('bullet')} title="Bullet List">
                        <div className="flex items-center gap-2 px-2">
                            <List size={18} />
                            <span className="text-xs">Bullet</span>
                        </div>
                    </FormatButton>
                    <FormatButton active={style.isOrderedList} onClick={() => toggleList('ordered')} title="Ordered List">
                        <div className="flex items-center gap-2 px-2">
                            <ListOrdered size={18} />
                            <span className="text-xs">Numbered</span>
                        </div>
                    </FormatButton>
                </div>

                {/* Typography Section */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic font-serif">Font</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <select
                                value={style.fontSize}
                                onChange={(e) => updateStyle({ fontSize: parseInt(e.target.value) })}
                                className="w-full bg-[#2b303b] border border-[#373e4a] rounded-lg p-2 text-sm appearance-none outline-none cursor-pointer"
                            >
                                {fontSizes.map(s => <option key={s} value={s}>{s}px</option>)}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                        <div className="relative flex-1">
                            <select
                                value={style.lineHeight}
                                onChange={(e) => updateStyle({ lineHeight: parseFloat(e.target.value) })}
                                className="w-full bg-[#2b303b] border border-[#373e4a] rounded-lg p-2 text-sm appearance-none outline-none cursor-pointer"
                            >
                                {lineHeights.map(l => <option key={l} value={l}>L-Height {l}</option>)}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alignment Section */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic font-serif">Formats</label>
                    <div className="grid grid-cols-4 gap-2">
                        <FormatButton active={style.textAlign === 'left'} onClick={() => updateStyle({ textAlign: 'left' })} title="Align Left">
                            <AlignLeft size={18} />
                        </FormatButton>
                        <FormatButton active={style.textAlign === 'center'} onClick={() => updateStyle({ textAlign: 'center' })} title="Align Center">
                            <AlignCenter size={18} />
                        </FormatButton>
                        <FormatButton active={style.textAlign === 'right'} onClick={() => updateStyle({ textAlign: 'right' })} title="Align Right">
                            <AlignRight size={18} />
                        </FormatButton>
                        <FormatButton active={style.textAlign === 'justify'} onClick={() => updateStyle({ textAlign: 'justify' })} title="Justify">
                            <AlignJustify size={18} />
                        </FormatButton>
                    </div>
                </div>

                {/* Colors Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <input
                            type="color"
                            ref={bgColorInputRef}
                            className="hidden"
                            value={style.backgroundColor || '#ffffff'}
                            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                        />
                        <div
                            onClick={() => bgColorInputRef.current?.click()}
                            className="flex items-center justify-between bg-[#2b303b] p-2 rounded-lg border border-[#373e4a] cursor-pointer hover:bg-[#373e4a] transition-all"
                        >
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-600">
                                <div className="w-4 h-4 bg-white" style={{ clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0% 100%)' }} />
                            </div>
                            <div
                                className="w-6 h-6 rounded border-2 border-white"
                                style={{ backgroundColor: style.backgroundColor || '#ffff00' }}
                            />
                            <div className="p-1">
                                <Palette size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <input
                            type="color"
                            ref={textColorInputRef}
                            className="hidden"
                            value={style.color || '#000000'}
                            onChange={(e) => updateStyle({ color: e.target.value })}
                        />
                        <div
                            onClick={() => textColorInputRef.current?.click()}
                            className="flex items-center justify-between bg-[#2b303b] p-2 rounded-lg border border-[#373e4a] cursor-pointer hover:bg-[#373e4a] transition-all"
                        >
                            <span className="text-red-500 font-bold text-lg leading-none">A</span>
                            <div
                                className="w-6 h-6 rounded border border-gray-600"
                                style={{ backgroundColor: style.color || '#ff0000' }}
                            />
                            <div className="p-1">
                                <Palette size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
