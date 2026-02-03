import React, { useState, useRef, useEffect } from 'react';
import { Element, ElementStyle } from './ConverterSection';
import { Settings2 } from 'lucide-react';

interface CanvasElementProps {
    element: Element;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Element>) => void;
    onDelete: (id: string) => void;
    font: string;
}

export default function CanvasElement({
    element,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    font
}: CanvasElementProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const startPos = useRef({ x: 0, y: 0 });
    const startDim = useRef({ x: 0, y: 0, w: 0, h: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(element.id);
        setIsDragging(true);
        startPos.current = { x: e.clientX - element.x, y: e.clientY - element.y };
    };

    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation();
        setIsResizing(direction);
        startPos.current = { x: e.clientX, y: e.clientY };
        startDim.current = { x: element.x, y: element.y, w: element.width, h: element.height };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                onUpdate(element.id, {
                    x: e.clientX - startPos.current.x,
                    y: e.clientY - startPos.current.y
                });
            } else if (isResizing) {
                const dx = e.clientX - startPos.current.x;
                const dy = e.clientY - startPos.current.y;

                const updates: Partial<Element> = {};
                if (isResizing.includes('right')) updates.width = Math.max(50, startDim.current.w + dx);
                if (isResizing.includes('left')) {
                    updates.width = Math.max(50, startDim.current.w - dx);
                    updates.x = startDim.current.x + dx;
                }
                if (isResizing.includes('bottom')) updates.height = Math.max(30, startDim.current.h + dy);
                if (isResizing.includes('top')) {
                    updates.height = Math.max(30, startDim.current.h - dy);
                    updates.y = startDim.current.y + dy;
                }
                onUpdate(element.id, updates);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(null);
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, element.id, onUpdate]);

    const style = element.style;

    return (
        <div
            className={`absolute group cursor-move transition-shadow ${isSelected ? 'z-50' : 'z-20'}`}
            style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                border: isSelected ? '1px solid #ef4444' : '1px solid transparent',
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Handles */}
            {isSelected && (
                <>
                    <div
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-600 rounded-full cursor-ns-resize shadow-sm"
                        onMouseDown={(e) => handleResizeStart(e, 'top')}
                    />
                    <div
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-600 rounded-full cursor-ns-resize shadow-sm"
                        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
                    />
                    <div
                        className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-orange-600 rounded-full cursor-ew-resize shadow-sm"
                        onMouseDown={(e) => handleResizeStart(e, 'left')}
                    />
                    <div
                        className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-orange-600 rounded-full cursor-ew-resize shadow-sm"
                        onMouseDown={(e) => handleResizeStart(e, 'right')}
                    />

                    {/* Format Trigger Icon */}
                    <div className="absolute -top-10 right-0 p-1.5 bg-[#1e222d] text-white rounded-md shadow-lg cursor-pointer">
                        <Settings2 size={16} />
                    </div>
                </>
            )}

            {/* Content Area */}
            <textarea
                value={element.text}
                onChange={(e) => onUpdate(element.id, { text: e.target.value })}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const style = element.style;
                        if (style.isList || style.isOrderedList) {
                            e.preventDefault();
                            const textarea = e.currentTarget;
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const beforeText = element.text.substring(0, start);
                            const afterText = element.text.substring(end);

                            let prefix = '\n';
                            if (style.isList) {
                                prefix += '• ';
                            } else if (style.isOrderedList) {
                                const lines = beforeText.split('\n');
                                prefix += `${lines.length + 1}. `;
                            }

                            const newText = beforeText + prefix + afterText;
                            onUpdate(element.id, { text: newText });

                            // Set cursor position after current render
                            setTimeout(() => {
                                textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
                            }, 0);
                        }
                    }
                }}
                className="w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden"
                style={{
                    fontFamily: font,
                    fontSize: `${style.fontSize}px`,
                    lineHeight: style.lineHeight,
                    color: style.color || 'inherit',
                    backgroundColor: style.backgroundColor || 'transparent',
                    fontWeight: style.bold ? 'bold' : 'normal',
                    fontStyle: style.italic ? 'italic' : 'normal',
                    textDecoration: style.underline ? 'underline' : 'none',
                    textAlign: style.textAlign || 'left',
                    padding: '4px'
                }}
                spellCheck={false}
            />
        </div>
    );
}
