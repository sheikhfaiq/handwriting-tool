import React from 'react';
import { Type, Menu, Bold, Italic, Underline, ChevronDown, PenLine } from 'lucide-react';

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
  extraFields: { id: string; text: string; x: number; y: number }[];
  setExtraFields: (fields: { id: string; text: string; x: number; y: number }[]) => void;
}

const fonts = [
  { name: 'Casual Script', value: 'var(--font-indie-flower)' },
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
  extraFields,
  setExtraFields,
}: ControlsProps) {

  const insertFormat = (prefix: string, suffix: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    setText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-[#3B527E] p-6 text-white flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <PenLine size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Text to Handwriting</h2>
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
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 p-5 rounded-2xl border border-gray-200 bg-gray-50/50 text-black focus:bg-white focus:border-[#3B527E] focus:ring-4 focus:ring-[#3B527E]/5 transition-all outline-none resize-none"
              placeholder="Enter your text here..."
            />
            {/* Formatting Pills */}
            <div className="flex flex-wrap gap-3 mt-4">
              {/* Basic Formatting */}
              <div className="flex gap-2">
                <button
                  onClick={() => insertFormat('**', '**')}
                  className="bg-[#2D3E64] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1e2a4a] transition-colors"
                  title="Bold"
                >
                  Bold
                </button>
                <button
                  onClick={() => insertFormat('*', '*')}
                  className="bg-[#F0F2F5] text-gray-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors italic"
                  title="Italic"
                >
                  Italic
                </button>
                <button
                  onClick={() => insertFormat('__', '__')}
                  className="bg-[#F0F2F5] text-gray-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors underline underline-offset-4"
                  title="Underline"
                >
                  Underline
                </button>
              </div>

              {/* Heading Levels */}
              <div className="flex gap-2 border-l border-gray-200 pl-3">
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      const textarea = document.querySelector('textarea');
                      if (!textarea) return;

                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const prefix = '#'.repeat(level) + ' ';

                      if (start !== end) {
                        // Case: Text is selected
                        const selectedText = text.substring(start, end);
                        const beforeText = text.substring(0, start);
                        const afterText = text.substring(end);

                        // Ensure heading starts on a new line and move rest of text down
                        const needsNewLineBefore = start > 0 && !beforeText.endsWith('\n');
                        const needsNewLineAfter = !afterText.startsWith('\n');

                        const inserted = (needsNewLineBefore ? '\n' : '') + prefix + selectedText + (needsNewLineAfter ? '\n' : '');
                        const newContent = beforeText + inserted + afterText;

                        setText(newContent);

                        setTimeout(() => {
                          textarea.focus();
                          const newCursorPos = start + inserted.length;
                          textarea.setSelectionRange(newCursorPos, newCursorPos);
                        }, 0);
                      } else {
                        // Case: No selection, transform current line
                        const textLines = text.substring(0, start).split('\n');
                        const currentLineIndex = textLines.length - 1;
                        const allLines = text.split('\n');
                        const currentLine = allLines[currentLineIndex];

                        // Remove existing heading markers if any
                        const cleanLine = currentLine.replace(/^#{1,6}\s/, '');
                        const newLineContent = prefix + cleanLine;

                        allLines[currentLineIndex] = newLineContent;

                        // Ensure there's a next line for content
                        if (currentLineIndex === allLines.length - 1) {
                          allLines.push('');
                        }

                        const updatedText = allLines.join('\n');
                        setText(updatedText);

                        setTimeout(() => {
                          textarea.focus();
                          const pos = allLines.slice(0, currentLineIndex + 1).join('\n').length + 1;
                          textarea.setSelectionRange(pos, pos);
                        }, 0);
                      }
                    }}
                    className="bg-white border border-gray-200 text-[#3B527E] w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold hover:bg-[#3B527E] hover:text-white hover:border-[#3B527E] transition-all shadow-sm"
                    title={`Heading ${level}`}
                  >
                    H{level}
                  </button>
                ))}
              </div>
            </div>
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
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B527E]"
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
      </div>
    </div>
  );
}
