import React, { useMemo, useState, useEffect } from 'react';

interface PreviewProps {
  pages: string[];
  currentPage: number;
  font: string;
  paper: string;
  inkColor: string;
  slant: number;
  rotate: number;
  wobble: number;
  fontSize: number;
  lineHeight: number;
  wordSpacing: number;
  pageTitle: string;
  pageDate: string;
  titlePos: { x: number; y: number };
  setTitlePos: (pos: { x: number; y: number }) => void;
  datePos: { x: number; y: number };
  setDatePos: (pos: { x: number; y: number }) => void;
  extraFields: { id: string; text: string; x: number; y: number }[];
  setExtraFields: (fields: { id: string; text: string; x: number; y: number }[]) => void;
  previewRef?: React.RefObject<HTMLDivElement | null> | null;
}

export default function Preview({
  pages,
  currentPage,
  font,
  paper,
  inkColor,
  slant,
  rotate,
  wobble,
  fontSize,
  lineHeight,
  wordSpacing,
  pageTitle,
  pageDate,
  titlePos,
  setTitlePos,
  datePos,
  setDatePos,
  extraFields,
  setExtraFields,
  previewRef,
}: PreviewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate random values for each character on the current page
  const renderedText = useMemo(() => {
    const text = pages[currentPage] || '';
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      // Check for Heading
      const isHeading = line.startsWith('# ');
      const cleanLine = isHeading ? line.substring(2) : line;

      // Parse formatting: **bold**, *italic*, __underline__
      // Using non-greedy matching and capturing groups
      // We need to handle them in a specific order or use a parser that can handle nested/mixed
      // For this simple implementation, we'll split by the markers but ensure we don't bleed

      const parts = [];
      let remaining = cleanLine;

      // Simple tokenizer loop
      while (remaining.length > 0) {
        // Find the earliest occurrence of any marker
        const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
        const italicMatch = remaining.match(/\*(.*?)\*/);
        const underlineMatch = remaining.match(/__(.*?)__/);

        let bestMatch = null;
        let type = '';
        let index = Infinity;

        if (boldMatch && boldMatch.index !== undefined && boldMatch.index < index) {
          index = boldMatch.index;
          bestMatch = boldMatch;
          type = 'bold';
        }
        if (italicMatch && italicMatch.index !== undefined && italicMatch.index < index) {
          index = italicMatch.index;
          bestMatch = italicMatch;
          type = 'italic';
        }
        if (underlineMatch && underlineMatch.index !== undefined && underlineMatch.index < index) {
          index = underlineMatch.index;
          bestMatch = underlineMatch;
          type = 'underline';
        }

        if (bestMatch && bestMatch.index !== undefined) {
          // Push text before match
          if (bestMatch.index > 0) {
            parts.push({ content: remaining.substring(0, bestMatch.index), type: 'normal' });
          }
          // Push match
          parts.push({ content: bestMatch[1], type: type });
          // Advance
          remaining = remaining.substring(bestMatch.index + bestMatch[0].length);
        } else {
          // No more matches
          parts.push({ content: remaining, type: 'normal' });
          remaining = '';
        }
      }

      const renderedLine = parts.map((part, partIndex) => {
        const { content, type } = part;
        let isBold = type === 'bold';
        let isItalic = type === 'italic';
        let isUnderline = type === 'underline';

        return content.split('').map((char, charIndex) => {
          // Only apply random effects after hydration to avoid mismatch
          const randomRotate = isMounted ? (Math.random() - 0.5) * rotate : 0;
          const randomY = isMounted ? (Math.random() - 0.5) * wobble : 0;

          return (
            <span
              key={`${lineIndex}-${partIndex}-${charIndex}`}
              style={{
                display: 'inline-block',
                transform: `rotate(${randomRotate}deg) translateY(${randomY}px) skewX(${slant}deg)`,
                whiteSpace: 'pre',
                fontWeight: isHeading || isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecoration: isUnderline ? 'underline' : 'none',
                fontSize: isHeading ? '1.5em' : '1em',
                marginRight: `${wordSpacing}px`,
              }}
            >
              {char}
            </span>
          );
        });
      });

      return (
        <div key={lineIndex} style={{ minHeight: '1em' }}>
          {renderedLine}
        </div>
      );
    });
  }, [pages, currentPage, rotate, wobble, slant, isMounted, wordSpacing]);

  const getPaperStyle = () => {
    const baseStyle = {
      lineHeight: `${lineHeight}em`,
      fontSize: `${fontSize}px`,
      color: inkColor,
      fontFamily: font,
    };

    switch (paper) {
      case 'ruled':
        return {
          ...baseStyle,
          backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px)',
          backgroundSize: `100% ${fontSize * lineHeight}px`, // Adjust line height to font size
          backgroundColor: '#fff',
          paddingTop: '0.5rem',
          paddingLeft: '4.5rem', // Ensure text starts after margin line
        };
      case 'vintage':
        return {
          ...baseStyle,
          backgroundColor: '#fef3c7',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
        };
      case 'grid':
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        };
      case 'assignment-1':
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px)',
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          padding: '3rem 2rem 2rem 2rem', // Top padding for header space
          border: '1px solid #d1d5db',
          boxShadow: 'inset 0 0 0 4px #fff, inset 0 0 0 6px #374151', // Double border effect
        };
      case 'assignment-2':
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px)',
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          padding: '3rem 3rem 3rem 3rem',
          border: '1px solid #d1d5db',
          // Decorative border using multiple box-shadows or a border-image could go here
          // Simulating a printed border
          boxShadow: 'inset 0 0 0 15px #fff, inset 0 0 0 18px #1e355e',
        };
      case 'notebook-margin':
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px)',
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          paddingTop: '0.5rem',
          paddingLeft: '4rem', // Space for margin
        };
      default: // plain
        return {
          ...baseStyle,
          backgroundColor: '#fff',
        };
    }
  };

  return (
    <div className="flex justify-center mb-12 py-8 perspective-1000">
      <div
        ref={previewRef}
        className="w-full max-w-[210mm] min-h-[297mm] p-12 shadow-[12px_12px_24px_rgba(0,0,0,0.2)] transition-all duration-300 relative overflow-hidden transform rotate-1 hover:rotate-0 hover:scale-[1.01] bg-white"
        style={getPaperStyle()}
      >
        {/* Realistic Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] mix-blend-multiply"></div>

        {/* Margin Line for Ruled Paper */}
        {paper === 'ruled' && (
          <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-red-300/50 h-full" />
        )}

        {/* Notebook Margin Line */}
        {paper === 'notebook-margin' && (
          <div className="absolute left-14 top-0 bottom-0 w-0.5 bg-red-400 h-full" />
        )}

        {/* Page Header - Draggable Title */}
        {pageTitle && (
          <div
            className="absolute z-20 cursor-move font-bold text-xl"
            style={{
              left: titlePos.x,
              top: titlePos.y,
              fontFamily: font,
              color: inkColor,
            }}
            onMouseDown={(e) => {
              const startX = e.clientX - titlePos.x;
              const startY = e.clientY - titlePos.y;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newX = moveEvent.clientX - startX;
                const newY = moveEvent.clientY - startY;
                setTitlePos({ x: newX, y: newY });
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            {pageTitle}
          </div>
        )}

        {/* Page Header - Draggable Date */}
        {pageDate && (
          <div
            className="absolute z-20 cursor-move text-lg"
            style={{
              left: datePos.x,
              top: datePos.y,
              fontFamily: font,
              color: inkColor,
            }}
            onMouseDown={(e) => {
              const startX = e.clientX - datePos.x;
              const startY = e.clientY - datePos.y;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newX = moveEvent.clientX - startX;
                const newY = moveEvent.clientY - startY;
                setDatePos({ x: newX, y: newY });
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            {pageDate}
          </div>
        )}

        <div className="whitespace-pre-wrap wrap-break-word relative z-10">
          {renderedText}
        </div>

        {/* Extra Editable Fields */}
        {extraFields.map((field) => (
          <div
            key={field.id}
            className="absolute z-20 cursor-move"
            style={{
              left: field.x,
              top: field.y,
              fontFamily: font,
              color: inkColor,
              fontSize: `${fontSize}px`,
            }}
            onMouseDown={(e) => {
              const startX = e.clientX - field.x;
              const startY = e.clientY - field.y;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newX = moveEvent.clientX - startX;
                const newY = moveEvent.clientY - startY;
                setExtraFields(extraFields.map(f => f.id === field.id ? { ...f, x: newX, y: newY } : f));
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <input
              type="text"
              value={field.text}
              onChange={(e) => setExtraFields(extraFields.map(f => f.id === field.id ? { ...f, text: e.target.value } : f))}
              className="bg-transparent border-none focus:outline-dashed focus:outline-1 focus:outline-gray-400"
              style={{ fontFamily: font, color: inkColor, fontSize: 'inherit' }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExtraFields(extraFields.filter(f => f.id !== field.id));
              }}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
