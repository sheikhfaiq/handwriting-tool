import React, { useRef } from 'react';
import { Type, Menu, ChevronDown, PenLine, MousePointer2, Bold, Italic, Underline } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface ControlsProps {
  text: string;
  setText: (text: string) => void;
  font: string;
  setFont: (font: string) => void;
  paper: string;
  setPaper: (paper: string) => void;
  inkColor: string;
  setInkColor: (color: string) => void;
  slant: number;
  setSlant: (slant: number) => void;
  rotate: number;
  setRotate: (rotate: number) => void;
  wobble: number;
  setWobble: (wobble: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  wordSpacing: number;
  setWordSpacing: (spacing: number) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
  pageDate: string;
  setPageDate: (date: string) => void;
  headingColor: string;
  setHeadingColor: (color: string) => void;
  addElement: (type: 'text' | 'heading') => void;
}

const fonts = [
  { name: 'Indie Flower', value: 'var(--font-indie-flower)' },
  { name: 'Handwritten', value: 'var(--font-caveat)' },
  { name: 'Neat Print', value: 'var(--font-shadows)' },
  { name: 'Cursive', value: 'var(--font-dancing)' },
  { name: 'Marker', value: 'var(--font-permanent)' },
  { name: 'Elegant', value: 'var(--font-sacramento)' },
  { name: 'Playful', value: 'var(--font-gloria)' },
  { name: 'Notebook', value: 'var(--font-kalam)' },
  { name: 'Messy', value: 'var(--font-patrick)' },
  { name: 'Architect', value: 'var(--font-architects)' },
  { name: 'Cedarville', value: 'var(--font-cedarville)' },
  { name: 'Homemade', value: 'var(--font-homemade)' },
  { name: 'Schoolbell', value: 'var(--font-schoolbell)' },
  { name: 'Satisfy', value: 'var(--font-satisfy)' },
  { name: 'Crafty Girls', value: 'var(--font-crafty-girls)' },
  { name: 'Swanky Moo', value: 'var(--font-swanky-moo)' },
];

const papers = [
  { name: 'Ruled Lines', value: 'ruled' },
  { name: 'Plain White', value: 'plain' },
  { name: 'Vintage Paper', value: 'vintage' },
  { name: 'Grid Paper', value: 'grid' },
  { name: 'Assignment (Simple)', value: 'assignment-1' },
  { name: 'Assignment (Border)', value: 'assignment-2' },
  { name: 'Notebook (Margin)', value: 'notebook-margin' },
  { name: 'Floral Rose', value: 'floral-rose' },
  { name: 'Floral Lavender', value: 'floral-lavender' },
  { name: 'Tropical Leaves', value: 'floral-tropical' },
  { name: 'Old Parchment', value: 'parchment' },
  { name: 'Sketchbook Cream', value: 'sketchbook' },
  { name: 'Blueprint Style', value: 'blueprint' },
  { name: 'Heart Border', value: 'heart-border' },
  { name: 'Geometric Modern', value: 'geometric' },
  { name: 'Classic Scroll', value: 'classic-scroll' },
  { name: 'Antique Blue', value: 'antique-blue' },
  { name: 'Wishlist (Forest)', value: 'wishlist-1' },
  { name: 'Wishlist (Gift)', value: 'wishlist-2' },
  { name: 'Wishlist (Christmas)', value: 'wishlist-3' },
  { name: 'Wishlist (Kings)', value: 'wishlist-4' },
  { name: 'Wishlist (Floral)', value: 'wishlist-5' },
  { name: 'Border (Geometric)', value: 'border-2' },
];

const inkColors = [
  { name: 'Blue', value: '#1e3a8a' },
  { name: 'Black', value: '#171717' },
  { name: 'Red', value: '#b91c1c' },
  { name: 'Green', value: '#15803d' },
  { name: 'Purple', value: '#7e22ce' },
];

export default function Controls({
  text,
  setText,
  font,
  setFont,
  paper,
  setPaper,
  inkColor,
  setInkColor,
  slant,
  setSlant,
  rotate,
  setRotate,
  wobble,
  setWobble,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  wordSpacing,
  setWordSpacing,
  pageTitle,
  setPageTitle,
  pageDate,
  setPageDate,
  headingColor,
  setHeadingColor,
  addElement,
}: ControlsProps) {
  const editorRef = useRef<any>(null);

  const toggleFormat = (marker: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;

    const selectedText = text.substring(start, end);
    const isWrapped = selectedText.startsWith(marker) && selectedText.endsWith(marker);

    let newText = '';
    let finalWrapped = '';

    if (isWrapped) {
      finalWrapped = selectedText.substring(marker.length, selectedText.length - marker.length);
      newText = text.substring(0, start) + finalWrapped + text.substring(end);
    } else {
      finalWrapped = `${marker}${selectedText}${marker}`;
      newText = text.substring(0, start) + finalWrapped + text.substring(end);
    }

    setText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + finalWrapped.length);
    }, 0);
  };

  const toggleBullet = (symbol: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Find the full lines covered by the selection
    const beforeText = text.substring(0, start);
    const lineStartIdx = beforeText.lastIndexOf('\n') + 1;
    const affectedText = text.substring(lineStartIdx, end);
    const lines = affectedText.split('\n');

    const bulletSymbols = ['•', '◦', '-', '★', '>'];
    const marker = `${symbol} `;

    const transformedLines = lines.map(line => {
      const trimmedLine = line.trimStart();
      const currentSymbol = bulletSymbols.find(s => trimmedLine.startsWith(`${s} `));

      if (currentSymbol === symbol) {
        // Toggle off: remove exact same symbol
        return line.replace(`${symbol} `, '');
      } else if (currentSymbol) {
        // Swap: replace existing different symbol
        return line.replace(`${currentSymbol} `, `${symbol} `);
      } else {
        // Toggle on: add symbol
        return `${symbol} ${line}`;
      }
    });

    const newAffectedText = transformedLines.join('\n');
    const newText = text.substring(0, lineStartIdx) + newAffectedText + text.substring(end);

    setText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStartIdx, lineStartIdx + newAffectedText.length);
    }, 0);
  };

  const toggleHeading = (level: number) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Get the exact selected text
    const selectedText = text.substring(start, end);
    const hasSelection = start !== end;

    // If no selection, fall back to current line logic
    let targetStart = start;
    let targetEnd = end;
    let content = selectedText;

    if (!hasSelection) {
      const beforeText = text.substring(0, start);
      targetStart = beforeText.lastIndexOf('\n') + 1;
      const afterText = text.substring(start);
      targetEnd = start + (afterText.indexOf('\n') !== -1 ? afterText.indexOf('\n') : afterText.length);
      content = text.substring(targetStart, targetEnd);
    }

    const bulletSymbols = ['•', '◦', '-', '★', '>'];
    const bulletMatch = content.match(/^([•◦★>\-] )/);
    const bulletPrefix = bulletMatch ? bulletMatch[0] : '';
    const textAfterBullet = bulletPrefix ? content.substring(bulletPrefix.length) : content;

    const headingMatch = textAfterBullet.match(/^(#{1,6})\s(.*)/);
    const currentLevel = headingMatch ? headingMatch[1].length : 0;
    const cleanContent = headingMatch ? headingMatch[2] : textAfterBullet;

    const marker = '#'.repeat(level) + ' ';
    let newText = '';
    let finalLine = '';

    if (currentLevel === level) {
      // Toggle off
      finalLine = cleanContent;
    } else {
      // Swap or Add
      finalLine = marker + cleanContent;
    }

    // Ensure leading/trailing newlines for "Auto Line Break"
    const prefix = (targetStart > 0 && text[targetStart - 1] !== '\n') ? '\n' : '';
    const suffix = (targetEnd < text.length && text[targetEnd] !== '\n') ? '\n' : '';

    const replacement = prefix + finalLine + suffix;
    newText = text.substring(0, targetStart) + replacement + text.substring(targetEnd);

    setText(newText);
    setTimeout(() => {
      textarea.focus();
      // Select the newly formatted line (including marker)
      const newStart = targetStart + prefix.length;
      const newEnd = newStart + finalLine.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };
  const selectionRef = useRef<{ start: number; end: number } | null>(null);
  const originalTextRef = useRef<string>('');

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-[#3B527E] p-6 text-white flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <PenLine size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Turn text into handwriting</h2>
          <p className="text-white/70 text-sm">Type or paste your text here</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Your Text Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#3B527E] font-semibold">
            <Menu size={18} />
            <span>Your Text</span>
          </div>
          <div className="relative">
            <RichTextEditor
              ref={editorRef}
              value={text}
              onChange={setText}
              placeholder="Enter your text here..."
            />
          </div>
        </div>

        {/* Text Formatting Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#3B527E] font-semibold">
            <PenLine size={18} />
            <span>Text Formatting</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => toggleFormat('**')}
              className="flex items-center justify-center gap-2 p-3 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-white hover:border-[#3B527E] hover:shadow-sm transition-all text-gray-700 hover:text-[#3B527E]"
              title="Bold"
            >
              <Bold size={20} />
            </button>
            <button
              onClick={() => toggleFormat('*')}
              className="flex items-center justify-center gap-2 p-3 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-white hover:border-[#3B527E] hover:shadow-sm transition-all text-gray-700 hover:text-[#3B527E]"
              title="Italic"
            >
              <Italic size={20} />
            </button>
            <button
              onClick={() => toggleFormat('__')}
              className="flex items-center justify-center gap-2 p-3 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-white hover:border-[#3B527E] hover:shadow-sm transition-all text-gray-700 hover:text-[#3B527E]"
              title="Underline"
            >
              <Underline size={20} />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {['•', '◦', '-', '★', '>'].map((symbol) => (
              <button
                key={symbol}
                onClick={() => toggleBullet(symbol)}
                className="flex items-center justify-center p-2 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-white hover:border-[#3B527E] hover:shadow-sm transition-all text-xl font-bold text-gray-700 hover:text-[#3B527E]"
                title={`Bullet ${symbol}`}
              >
                {symbol}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                onClick={() => toggleHeading(level)}
                className="flex items-center justify-center p-2 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-white hover:border-[#3B527E] hover:shadow-sm transition-all text-xs font-bold text-gray-700 hover:text-[#3B527E]"
                title={`Heading ${level}`}
              >
                H{level}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Heading Color</label>
            <div className="flex flex-wrap gap-2">
              {['#1e3a8a', '#1e293b', '#475569', '#b91c1c', '#15803d', '#92400e', '#6b21a8', '#db2777'].map((color) => (
                <button
                  key={color}
                  onClick={() => setHeadingColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm transform hover:scale-110 ${headingColor === color ? 'border-[#3B527E] scale-110' : 'border-white'
                    }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#3B527E] font-semibold">
            <MousePointer2 size={18} />
            <span>Elements</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => addElement('text')}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:border-[#3B527E] hover:shadow-md transition-all group"
            >
              <div className="flex items-end gap-0.5">
                <span className="text-red-600 font-bold text-lg leading-none">T</span>
                <span className="text-red-600 font-bold text-2xl leading-none">T</span>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-[#3B527E]">Text Field</span>
            </button>
            <button
              onClick={() => addElement('heading')}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:border-[#3B527E] hover:shadow-md transition-all group"
            >
              <span className="text-red-600 font-bold text-3xl leading-none">H</span>
              <span className="text-sm font-medium text-gray-600 group-hover:text-[#3B527E]">Heading</span>
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Style & Appearance Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#3B527E] font-semibold">
            <Type size={18} />
            <span>Style & Appearance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Handwriting Style */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Handwriting Style</label>
              <div className="relative group">
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 appearance-none cursor-pointer focus:bg-white focus:border-[#3B527E] outline-none transition-all"
                >
                  {fonts.map((f) => (
                    <option key={f.value} value={f.value}>{f.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" size={16} />
              </div>
            </div>

            {/* Paper Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paper Type</label>
              <div className="relative group">
                <select
                  value={paper}
                  onChange={(e) => setPaper(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 appearance-none cursor-pointer focus:bg-white focus:border-[#3B527E] outline-none transition-all"
                >
                  {papers.map((p) => (
                    <option key={p.value} value={p.value}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" size={16} />
              </div>
            </div>

            {/* Ink Color */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ink Color</label>
              <div className="relative group">
                <select
                  value={inkColor}
                  onChange={(e) => setInkColor(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 appearance-none cursor-pointer focus:bg-white focus:border-[#3B527E] outline-none transition-all"
                >
                  {inkColors.map((c) => (
                    <option key={c.value} value={c.value}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-100 shadow-sm" style={{ backgroundColor: inkColor }} />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" size={16} />
              </div>
            </div>


            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                <span>Font Size</span>
                <span className="text-[#3B527E]">{fontSize}px</span>
              </label>
              <input
                type="range"
                min="12"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B527E]"
              />
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                <span>Line Height</span>
                <span className="text-[#3B527E]">{lineHeight}</span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B527E]"
              />
            </div>

            {/* Realism: Slant */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                <span>Slant (Realism)</span>
                <span className="text-[#3B527E]">{slant}°</span>
              </label>
              <input
                type="range"
                min="-10"
                max="10"
                value={slant}
                onChange={(e) => setSlant(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B527E]"
              />
            </div>
          </div>

          {/* Additional Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Spacing */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                <span>Word Spacing</span>
                <span className="text-[#3B527E]">{wordSpacing}px</span>
              </label>
              <input
                type="range"
                min="-5"
                max="15"
                value={wordSpacing}
                onChange={(e) => setWordSpacing(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B527E]"
              />
            </div>

            {/* Randomness/Wobble */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                <span>Wobble (Realism)</span>
                <span className="text-[#3B527E]">{wobble}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={wobble}
                onChange={(e) => setWobble(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B527E]"
              />
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}