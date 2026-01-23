import React, { useMemo, useState, useEffect } from 'react';
import { FileText, Image } from 'lucide-react';

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
  onDownloadImage?: () => void;
  onDownloadPDF?: () => void;
  isGenerating?: boolean;
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
  onDownloadImage,
  onDownloadPDF,
  isGenerating,
}: PreviewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderedText = useMemo(() => {
    const text = pages[currentPage] || '';
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      // Check for Heading levels (H1-H6)
      const headingMatch = line.match(/^(#{1,6})\s/);
      const headingLevel = headingMatch ? headingMatch[1].length : 0;
      const cleanLine = headingLevel > 0 ? line.substring(headingLevel + 1) : line;

      // Font sizes for H1-H6
      const headingFontSizes: Record<number, string> = {
        1: '2em',
        2: '1.75em',
        3: '1.5em',
        4: '1.3em',
        5: '1.2em',
        6: '1.1em',
      };

      const parts = [];
      let remaining = cleanLine;

      while (remaining.length > 0) {
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
          if (bestMatch.index > 0) {
            parts.push({ content: remaining.substring(0, bestMatch.index), type: 'normal' });
          }
          parts.push({ content: bestMatch[1], type: type });
          remaining = remaining.substring(bestMatch.index + bestMatch[0].length);
        } else {
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
          const randomRotate = isMounted ? (Math.random() - 0.5) * rotate : 0;
          const randomY = isMounted ? (Math.random() - 0.5) * wobble : 0;

          return (
            <span
              key={`${lineIndex}-${partIndex}-${charIndex}`}
              style={{
                display: 'inline-block',
                transform: `rotate(${randomRotate}deg) translateY(${randomY}px) skewX(${slant}deg)`,
                whiteSpace: 'pre',
                fontWeight: headingLevel > 0 || isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecoration: isUnderline ? 'underline' : 'none',
                fontSize: headingLevel > 0 ? headingFontSizes[headingLevel] : '1em',
                marginRight: `${wordSpacing}px`,
              }}
            >
              {char}
            </span>
          );
        });
      });

      return (
        <div key={lineIndex} style={{ minHeight: '1.2em' }}>
          {renderedLine}
        </div>
      );
    });
  }, [pages, currentPage, rotate, wobble, slant, isMounted, wordSpacing]);

  const getPaperStyle = () => {
    const baseStyle = {
      lineHeight: `${lineHeight}`,
      fontSize: `${fontSize}px`,
      color: inkColor,
      fontFamily: font,
    };

    switch (paper) {
      case 'ruled':
        return {
          ...baseStyle,
          backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px)',
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          backgroundColor: '#fff',
          paddingTop: '0.5rem',
          paddingLeft: '4.5rem',
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
          padding: '3rem 2rem 2rem 2rem',
          border: '1px solid #d1d5db',
          boxShadow: 'inset 0 0 0 4px #fff, inset 0 0 0 6px #374151',
        };
      case 'assignment-2':
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px)',
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          padding: '3rem 3rem 3rem 3rem',
          border: '1px solid #d1d5db',
          boxShadow: 'inset 0 0 0 15px #fff, inset 0 0 0 18px #1e355e',
        };
      case 'notebook-margin':
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px)',
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          paddingTop: '0.5rem',
          paddingLeft: '4rem',
        };
      case 'floral-rose':
        return { ...baseStyle, backgroundColor: '#fffafb', padding: '5rem' };
      case 'floral-lavender':
        return { ...baseStyle, backgroundColor: '#f9f5ff', padding: '5rem' };
      case 'floral-tropical':
        return { ...baseStyle, backgroundColor: '#f1fdf1', padding: '5rem' };
      case 'parchment':
        return {
          ...baseStyle,
          backgroundColor: '#f4e4bc',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
          padding: '4rem',
        };
      case 'sketchbook':
        return {
          ...baseStyle,
          backgroundColor: '#fdfbf7',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
          padding: '4rem',
        };
      case 'blueprint':
        return {
          ...baseStyle,
          backgroundColor: '#1e40af',
          color: '#bfdbfe',
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          padding: '4rem',
        };
      case 'heart-border':
        return { ...baseStyle, backgroundColor: '#fff', padding: '5rem' };
      case 'geometric':
        return { ...baseStyle, backgroundColor: '#fff', padding: '5rem', border: '2px solid #334155' };
      case 'classic-scroll':
        return { ...baseStyle, backgroundColor: '#fff', padding: '6rem 5rem' };
      case 'antique-blue':
        return {
          ...baseStyle,
          backgroundColor: '#e0f2fe',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall-2.png")',
          padding: '4rem',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#fff',
        };
    }
  };

  return (
    <div className="bg-[#F8F9FA] rounded-3xl overflow-hidden shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-[#3B527E] p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Preview</h2>
          <p className="text-white/70 text-sm">See your handwriting </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (onDownloadPDF) onDownloadPDF();
            }}
            disabled={isGenerating}
            className="p-2.5 bg-white/20 rounded-xl hover:bg-white/30 transition-colors disabled:opacity-50"
            title="Download PDF"
          >
            <FileText size={20} />
          </button>
          <button
            onClick={() => {
              if (onDownloadImage) onDownloadImage();
            }}
            disabled={isGenerating}
            className="p-2.5 bg-white/20 rounded-xl hover:bg-white/30 transition-colors disabled:opacity-50"
            title="Download PNG"
          >
            <Image size={20} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="p-8 flex justify-center bg-[#F8F9FA]">
        <div
          ref={previewRef}
          id="paper-preview"
          className="w-full max-w-[210mm] min-h-[297mm] h-auto p-12 shadow-2xl relative overflow-hidden bg-white scale-[1] origin-top"
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

          {/* SVG Border Overlays */}
          {paper === 'floral-rose' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <svg className="absolute top-0 left-0 w-32 h-32 text-pink-500/30" viewBox="0 0 100 100">
                <path d="M10,30 Q25,10 40,30 T70,30" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="10" cy="30" r="5" fill="currentColor" />
                <circle cx="40" cy="30" r="5" fill="currentColor" />
                <circle cx="70" cy="30" r="5" fill="currentColor" />
              </svg>
              <div className="absolute inset-4 border-2 border-pink-100 rounded-3xl" />
              <div className="absolute top-4 right-4 text-4xl">🌹</div>
              <div className="absolute bottom-4 left-4 text-4xl">🌹</div>
            </div>
          )}

          {paper === 'floral-lavender' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-6 border-[12px] border-purple-100/30 rounded-lg" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl">🪻🪻🪻</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-3xl">🪻🪻🪻</div>
            </div>
          )}

          {paper === 'floral-tropical' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 p-8 text-6xl opacity-20">🌿</div>
              <div className="absolute bottom-0 left-0 p-8 text-6xl opacity-20">🍃</div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 p-4 text-4xl opacity-10">🌴</div>
            </div>
          )}

          {paper === 'heart-border' && (
            <div className="absolute inset-0 pointer-events-none border-[20px] border-red-50/50">
              <div className="absolute top-2 left-2 text-2xl">❤️</div>
              <div className="absolute top-2 right-2 text-2xl">❤️</div>
              <div className="absolute bottom-2 left-2 text-2xl">❤️</div>
              <div className="absolute bottom-2 right-2 text-2xl">❤️</div>
            </div>
          )}

          {paper === 'classic-scroll' && (
            <div className="absolute inset-0 pointer-events-none border-[40px] border-transparent" style={{ borderImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png") 30 stretch' }}>
              <div className="absolute inset-0 border-[2px] border-amber-900/20 m-4" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-1 bg-amber-900/20" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-1 bg-amber-900/20" />
            </div>
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
    </div>
  );
}
