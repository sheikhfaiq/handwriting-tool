import React, { useMemo, useState, useEffect } from 'react';
import { FileText, Image } from 'lucide-react';
import { Element } from './ConverterSection';
import CanvasElement from './CanvasElement';
import ElementFormatToolbar from './ElementFormatToolbar';

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
  headingColor: string;
  titlePos: { x: number; y: number };
  setTitlePos: (pos: { x: number; y: number }) => void;
  datePos: { x: number; y: number };
  setDatePos: (pos: { x: number; y: number }) => void;
  addElement: (type: 'text' | 'heading') => void;
  elements: Element[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<Element>) => void;
  onDeleteElement: (id: string) => void;
  previewRef?: React.RefObject<HTMLDivElement | null> | null;
  onDownloadImage?: () => void;
  onDownloadPDF?: () => void;
  isGenerating?: boolean;
}

type StyleType = 'bold' | 'italic' | 'underline';

interface StyledPart {
  content: string;
  styles: Set<StyleType>;
}

const parseMarkdown = (raw: string, currentStyles: Set<StyleType>): StyledPart[] => {
  const formats = [
    { marker: '**', type: 'bold' as StyleType },
    { marker: '*', type: 'italic' as StyleType },
    { marker: '__', type: 'underline' as StyleType }
  ];

  let bestIdx = Infinity;
  let bestType: StyleType | null = null;
  let matchLen = 0;

  formats.forEach(f => {
    const idx = raw.indexOf(f.marker);
    if (idx !== -1 && idx < bestIdx) {
      bestIdx = idx;
      bestType = f.type;
      matchLen = f.marker.length;
    }
  });

  if (bestIdx === Infinity) {
    return [{ content: raw, styles: new Set(currentStyles) }];
  }

  const results: StyledPart[] = [];
  const pre = raw.substring(0, bestIdx);
  if (pre) results.push({ content: pre, styles: new Set(currentStyles) });

  const remainder = raw.substring(bestIdx);
  const marker = formats.find(f => f.type === bestType)!.marker;
  const closeIdx = remainder.indexOf(marker, matchLen);

  if (closeIdx !== -1) {
    const inner = remainder.substring(matchLen, closeIdx);
    const nextStyles = new Set(currentStyles);
    nextStyles.add(bestType!);
    results.push(...parseMarkdown(inner, nextStyles));
    results.push(...parseMarkdown(remainder.substring(closeIdx + matchLen), new Set(currentStyles)));
  } else {
    results.push({ content: remainder.substring(0, matchLen), styles: new Set(currentStyles) });
    results.push(...parseMarkdown(remainder.substring(matchLen), new Set(currentStyles)));
  }

  return results;
};

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
  headingColor,
  titlePos,
  setTitlePos,
  datePos,
  setDatePos,
  addElement,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
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
    const rawText = pages[currentPage] || '';
    if (!rawText) return [];

    const lines = rawText.split('\n').map(line => {
      return parseMarkdown(line, new Set());
    });

    return lines.map((lineParts, lineIdx) => {
      const rowHeight = fontSize * lineHeight;
      let charIdxInLine = 0;

      const lineContent = lineParts.map(p => p.content).join('');
      const combinedMatch = lineContent.match(/^([•◦★>\-] )?(#{1,6})\s/);
      const headingLevel = combinedMatch ? combinedMatch[2].length : 0;

      const fontSizeMultiplier = headingLevel > 0 ? (1.8 - (headingLevel - 1) * 0.1) : 1;

      const renderedLine = lineParts.map((part, partIdx) => {
        let content = part.content;
        if (partIdx === 0 && headingLevel > 0) {
          content = content.replace(/(#{1,6})\s/, '');
        }

        return content.split('').map((char, cIdx) => {
          const rotation = isMounted ? (Math.random() - 0.5) * rotate : 0;
          const offset = isMounted ? (Math.random() - 0.5) * wobble : 0;
          const charKey = `${lineIdx}-${partIdx}-${cIdx}`;

          return (
            <span
              key={charKey}
              style={{
                display: 'inline-block',
                transform: `rotate(${rotation}deg) translateY(${offset}px) skewX(${slant}deg)`,
                color: headingLevel > 0 ? headingColor : 'inherit',
                fontSize: `${fontSizeMultiplier}em`,
                marginRight: `${wordSpacing}px`,
                whiteSpace: 'pre',
                transition: 'all 0.2s ease',
                fontWeight: (part.styles.has('bold') || headingLevel > 0) ? 'bold' : 'normal',
                fontStyle: part.styles.has('italic') ? 'italic' : 'normal',
                textDecoration: part.styles.has('underline') ? 'underline' : 'none',
              }}
            >
              {char}
            </span>
          );
        });
      });

      return (
        <div
          key={lineIdx}
          style={{
            height: `${headingLevel > 0 ? rowHeight * 2 : rowHeight}px`,
            display: 'flex',
            alignItems: headingLevel > 0 ? 'center' : 'baseline',
            position: 'relative',
            whiteSpace: 'nowrap'
          }}
        >
          {renderedLine}
        </div>
      );
    });
  }, [pages, currentPage, rotate, wobble, slant, isMounted, wordSpacing, fontSize, lineHeight, headingColor]);

  const getPaperStyle = () => {
    const baseStyle = {
      lineHeight: `${lineHeight}`,
      fontSize: `${fontSize}px`,
      color: inkColor,
      fontFamily: font,
    };

    const bottomLineGradient = (color: string) =>
      `linear-gradient(transparent calc(100% - 1px), ${color} calc(100% - 1px))`;

    const fontBaselineOffsets: Record<string, string> = {
      'var(--font-indie-flower)': '0.64em',
      'var(--font-caveat)': '0.55em',
      'var(--font-shadows)': '0.64em',
      'var(--font-dancing)': '0.62em',
      'var(--font-permanent)': '0.60em',
      'var(--font-sacramento)': '0.50em',
      'var(--font-gloria)': '0.64em',
      'var(--font-kalam)': '0.64em',
      'var(--font-patrick)': '0.62em',
      'var(--font-architects)': '0.64em',
      'var(--font-cedarville)': '0.75em',
      'var(--font-homemade)': '0.75em',
      'var(--font-schoolbell)': '0.64em',
      'var(--font-satisfy)': '0.64em',
      'var(--font-crafty-girls)': '0.64em',
      'var(--font-swanky-moo)': '0.68em',
    };

    const yOffset = fontBaselineOffsets[font] || '0.64em';

    switch (paper) {
      case 'ruled': {
        const paddingTop = '0.5rem';
        const paddingLeft = '4.5rem';
        return {
          ...baseStyle,
          backgroundImage: bottomLineGradient('#9ca3af'),
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          backgroundPosition: `0 calc(${paddingTop} - ${yOffset})`,
          backgroundColor: '#fff',
          paddingTop,
          paddingLeft,
        };
      }
      case 'vintage':
        return {
          ...baseStyle,
          backgroundColor: '#fef3c7',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
        };
      case 'grid': {
        const padding = '3rem';
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: `${padding} calc(${padding} - ${yOffset})`,
          padding,
        };
      }
      case 'assignment-1': {
        const paddingTop = '3rem';
        const paddingLeft = '2rem';
        const paddingRight = '2rem';
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: bottomLineGradient('#9ca3af'),
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          backgroundPosition: `0 calc(${paddingTop} - ${yOffset})`,
          padding: `${paddingTop} ${paddingRight} 2rem ${paddingLeft}`,
          border: '1px solid #d1d5db',
          boxShadow: 'inset 0 0 0 4px #fff, inset 0 0 0 6px #374151',
        };
      }
      case 'assignment-2': {
        const paddingTop = '3rem';
        const paddingH = '3rem';
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: bottomLineGradient('#9ca3af'),
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          backgroundPosition: `0 calc(${paddingTop} - ${yOffset})`,
          padding: `${paddingTop} ${paddingH} 3rem ${paddingH}`,
          border: '1px solid #d1d5db',
          boxShadow: 'inset 0 0 0 15px #fff, inset 0 0 0 18px #1e355e',
        };
      }
      case 'notebook-margin': {
        const paddingTop = '0.5rem';
        const paddingLeft = '4rem';
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          backgroundImage: bottomLineGradient('#9ca3af'),
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          backgroundPosition: `0 calc(${paddingTop} - ${yOffset})`,
          paddingTop,
          paddingLeft,
        };
      }
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
      case 'blueprint': {
        const padding = '4rem';
        return {
          ...baseStyle,
          backgroundColor: '#1e40af',
          color: '#bfdbfe',
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: `${padding} calc(${padding} - ${yOffset})`,
          padding,
        };
      }
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
      case 'wishlist-1': {
        const paddingTop = '6rem';
        const paddingBottom = '8rem';
        const paddingH = '4rem';
        return {
          ...baseStyle,
          backgroundColor: '#fff',
          padding: `${paddingTop} ${paddingH} ${paddingBottom} ${paddingH}`,
          backgroundImage: bottomLineGradient('#e5e7eb'),
          backgroundSize: `100% ${fontSize * lineHeight}px`,
          backgroundPosition: `0 calc(${paddingTop} - ${yOffset})`,
        };
      }
      case 'wishlist-2':
        return { ...baseStyle, backgroundColor: '#fff3ed', padding: '6rem 4rem 10rem 4rem' };
      case 'wishlist-3':
        return { ...baseStyle, backgroundColor: '#fff8f6', padding: '8rem 5rem' };
      case 'wishlist-4':
        return { ...baseStyle, backgroundColor: '#fff', padding: '6rem 4rem 12rem 4rem' };
      case 'wishlist-5':
        return { ...baseStyle, backgroundColor: '#fff5f2', padding: '10rem 5rem 6rem 5rem' };
      case 'border-2':
        return { ...baseStyle, backgroundColor: '#fff', padding: '6rem' };
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
          <p className="text-white/70 text-sm">See your handwriting typing</p>
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

          {/* Wishlist Designs */}
          {paper === 'wishlist-1' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-[24px] border-sky-100/50" />
              <div className="absolute bottom-4 left-4 text-8xl">🍄</div>
              <div className="absolute top-0 right-0 p-8 text-4xl">🍃</div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl font-bold text-sky-800 tracking-widest uppercase">Wishlist</div>
            </div>
          )}

          {paper === 'wishlist-2' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-[20px] border-orange-50" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end gap-2 pb-4">
                <span className="text-7xl">🎁</span>
                <span className="text-6xl pb-2">🌺</span>
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl font-serif italic text-orange-800">Wish List</div>
            </div>
          )}

          {paper === 'wishlist-3' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-24 flex justify-around items-center px-8">
                <span className="text-3xl">🎄</span>
                <span className="text-4xl italic font-serif text-red-800">Wish List</span>
                <span className="text-3xl">🎅</span>
              </div>
              <div className="absolute inset-x-0 top-24 bottom-0 border-x-[30px] border-b-[30px] border-emerald-50/30">
                <div className="absolute -top-4 left-0 text-2xl">🔔</div>
                <div className="absolute -top-4 right-0 text-2xl">🍭</div>
              </div>
            </div>
          )}

          {paper === 'wishlist-4' && (
            <div className="absolute inset-0 pointer-events-none border-[30px] border-orange-400">
              <div className="absolute inset-0 border-[4px] border-white m-1" />
              <div className="absolute top-4 left-4 text-white font-black text-xs uppercase tracking-tighter">My Wishlist</div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 translate-y-4">
                <div className="w-20 h-20 bg-amber-100 rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-lg">👑</div>
                <div className="w-24 h-24 bg-orange-100 rounded-full border-4 border-white flex items-center justify-center text-5xl shadow-lg">🤴</div>
                <div className="w-20 h-20 bg-amber-100 rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-lg">👳</div>
              </div>
            </div>
          )}

          {paper === 'wishlist-5' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 bg-red-50/50 p-12 text-center">
                <span className="text-5xl block mb-2">🌺 🍃 🌺</span>
                <span className="text-4xl font-serif italic text-red-900">Wish List</span>
              </div>
              <div className="absolute bottom-4 right-4 text-6xl opacity-20">🌿</div>
            </div>
          )}

          {paper === 'border-2' && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner Triangles */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-coral-500/10" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)', backgroundColor: '#fb923c22' }} />
              <div className="absolute top-0 right-0 w-32 h-32 bg-coral-500/10" style={{ clipPath: 'polygon(0 0, 100% 100%, 100% 0)', backgroundColor: '#fb923c22' }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-coral-500/10" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)', backgroundColor: '#fb923c22' }} />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-coral-500/10" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)', backgroundColor: '#fb923c22' }} />

              {/* Accents */}
              <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-orange-400" />
              <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-orange-400" />
            </div>
          )}

          <div className="whitespace-pre-wrap wrap-break-word relative z-10">
            {renderedText}
          </div>

          {/* Canvas Elements */}
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={onSelectElement}
              onUpdate={onUpdateElement}
              onDelete={onDeleteElement}
              font={font}
            />
          ))}

          {selectedElementId && elements.find(el => el.id === selectedElementId) && (
            <ElementFormatToolbar
              element={elements.find(el => el.id === selectedElementId)!}
              onUpdate={onUpdateElement}
              onDelete={onDeleteElement}
              onClose={() => onSelectElement(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}