import React from 'react';
import { Type, Menu, Bold, Italic, Underline, ChevronDown, PenLine, List } from 'lucide-react';

interface ControlsProps {
  text: string;
  setText: (text: string) => void;
  font: string;
  setFont: (font: string) => void;
  paper: string;
  setPaper: (paper: string) => void;
  inkColor: string;
  setInkColor: (color: string) => void;
  headingColor: string;
  setHeadingColor: (color: string) => void;
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
  headingColor,
  setHeadingColor,
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

  const toggleFormat = (prefix: string, suffix: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (selectedText.includes('\n')) {
      // Multi-line selection: Apply formatting to each line individually
      const segments = selectedText.split('\n');

      // Check if we should remove or add. 
      // If all non-empty segments are wrapped, we remove. Otherwise we add.
      const areAllWrapped = segments.every(seg =>
        seg.trim().length === 0 || (seg.startsWith(prefix) && seg.endsWith(suffix))
      );

      const newSegments = segments.map(seg => {
        if (seg.trim().length === 0) return seg;

        if (areAllWrapped) {
          // Remove formatting: __Text__ -> Text
          // We check again to be safe
          if (seg.startsWith(prefix) && seg.endsWith(suffix)) {
            return seg.slice(prefix.length, -suffix.length);
          }
          return seg;
        } else {
          // Add formatting: Text -> __Text__
          return prefix + seg + suffix;
        }
      });

      const newSelectedText = newSegments.join('\n');
      const newText = text.substring(0, start) + newSelectedText + text.substring(end);
      setText(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + newSelectedText.length);
      }, 0);

    } else {
      // Single-line selection: Check surrounding context (existing logic)
      const before = text.substring(start - prefix.length, start);
      const after = text.substring(end, end + suffix.length);

      if (before === prefix && after === suffix) {
        const newText = text.substring(0, start - prefix.length) + selectedText + text.substring(end + suffix.length);
        setText(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start - prefix.length, end - prefix.length);
        }, 0);
      } else {
        const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
        setText(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
      }
    }
  };

  const toggleList = (bullet: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const allLines = text.split('\n');
    let startLineIndex = 0;
    let endLineIndex = 0;
    let currentPos = 0;

    for (let i = 0; i < allLines.length; i++) {
      const lineLen = allLines[i].length + 1;
      if (currentPos + lineLen > start && start >= currentPos) startLineIndex = i;
      if (currentPos + lineLen > end && end >= currentPos) {
        endLineIndex = i;
        break;
      }
      currentPos += lineLen;
    }

    const bullets = ['•', '◦', '-', '★', '>'];
    const bulletRegex = new RegExp(`^\\s*([${bullets.map(b => '\\' + b).join('')}])\\s?`);

    const newLines = [...allLines];

    for (let i = startLineIndex; i <= endLineIndex; i++) {
      const line = newLines[i];
      if (line.trim().length === 0) continue;

      const match = line.match(bulletRegex);
      if (match) {
        const existingBullet = match[1];
        if (existingBullet === bullet) {
          newLines[i] = line.replace(bulletRegex, '').trim();
        } else {
          newLines[i] = line.replace(bulletRegex, `${bullet} `);
        }
      } else {
        newLines[i] = `${bullet} ${line}`;
      }
    }

    const newText = newLines.join('\n');
    setText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + (newText.length - text.length));
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
          <h2 className="text-xl font-bold">Turn text into handwriting
          </h2>
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
                  onClick={() => toggleFormat('**', '**')}
                  className="bg-[#2D3E64] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1e2a4a] transition-colors"
                  title="Bold"
                >
                  Bold
                </button>
                <button
                  onClick={() => toggleFormat('*', '*')}
                  className="bg-[#F0F2F5] text-gray-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors italic"
                  title="Italic"
                >
                  Italic
                </button>
                <button
                  onClick={() => toggleFormat('__', '__')}
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

                      // We need to operate on full lines to ensure proper Heading syntax
                      const allLines = text.split('\n');
                      let startLineIndex = 0;
                      let endLineIndex = 0;
                      let currentPos = 0;

                      // Find start and end line indices
                      for (let i = 0; i < allLines.length; i++) {
                        const lineLen = allLines[i].length + 1; // +1 for newline
                        if (currentPos + lineLen > start && start >= currentPos) startLineIndex = i;
                        if (currentPos + lineLen > end && end >= currentPos) {
                          endLineIndex = i;
                          break;
                        }
                        currentPos += lineLen;
                      }

                      const headingRegex = /^(#{1,6})\s/;
                      const targetPrefix = '#'.repeat(level) + ' ';

                      const newLines = [...allLines];

                      for (let i = startLineIndex; i <= endLineIndex; i++) {
                        const line = newLines[i];
                        const match = line.match(headingRegex);

                        if (match) {
                          const currentLevel = match[1].length;
                          if (currentLevel === level) {
                            // Same level -> Remove (Toggle Off)
                            newLines[i] = line.replace(headingRegex, '');
                          } else {
                            // Different level -> Replace
                            newLines[i] = line.replace(headingRegex, targetPrefix);
                          }
                        } else {
                          // No heading -> Add
                          newLines[i] = targetPrefix + line;
                        }
                      }

                      const newText = newLines.join('\n');
                      setText(newText);

                      setTimeout(() => {
                        textarea.focus();
                        // Restore selection loosely (keeping it simple as exact pos tracking is complex with replacements)
                        textarea.setSelectionRange(start, start + (newText.length - text.length));
                      }, 0);
                    }}
                    className="bg-white border border-gray-200 text-[#3B527E] w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold hover:bg-[#3B527E] hover:text-white hover:border-[#3B527E] transition-all shadow-sm"
                    title={`Heading ${level}`}
                  >
                    H{level}
                  </button>
                ))}

                {/* Specific Heading Color Picker */}
                <div className="flex items-center ml-2 border-l border-gray-200 pl-3 gap-2" title="Selected Heading Color">
                  <div className="relative group">
                    <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden cursor-pointer shadow-sm hover:scale-110 transition-transform">
                      <input
                        type="color"
                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0"
                        onChange={(e) => {
                          const color = e.target.value;
                          const textarea = document.querySelector('textarea');
                          if (!textarea) return;

                          const start = textarea.selectionStart;
                          const allLines = text.split('\n');
                          let currentPos = 0;
                          let lineIndex = -1;

                          // Find current line index
                          for (let i = 0; i < allLines.length; i++) {
                            const lineLen = allLines[i].length + 1;
                            if (currentPos + lineLen > start) {
                              lineIndex = i;
                              break;
                            }
                            currentPos += lineLen;
                          }

                          if (lineIndex !== -1) {
                            // Check if line is a heading
                            const line = allLines[lineIndex];
                            const headingRegex = /^(#{1,6})(?:\[color:.*?\])?\s+(.*)$/;
                            const match = line.match(headingRegex);

                            if (match) {
                              // It's a heading, inject color
                              const levelHashes = match[1];
                              const content = match[2];
                              // Reconstruct with new color
                              allLines[lineIndex] = `${levelHashes}[color:${color}] ${content}`;

                              const newText = allLines.join('\n');
                              setText(newText);

                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start, start); // Restore cursor
                              }, 0);
                            }
                          }
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Tint
                    </span>
                  </div>
                </div>
              </div>

              {/* Lists */}
              <div className="flex gap-2 border-l border-gray-200 pl-3">
                <button
                  onClick={() => toggleList('•')}
                  className="bg-white border border-gray-200 text-[#3B527E] w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold hover:bg-[#3B527E] hover:text-white hover:border-[#3B527E] transition-all shadow-sm"
                  title="Bullet List"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => toggleList('◦')}
                  className="bg-white border border-gray-200 text-[#3B527E] w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold hover:bg-[#3B527E] hover:text-white hover:border-[#3B527E] transition-all shadow-sm"
                  title="Hollow Bullet"
                >
                  ◦
                </button>
                <button
                  onClick={() => toggleList('-')}
                  className="bg-white border border-gray-200 text-[#3B527E] w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold hover:bg-[#3B527E] hover:text-white hover:border-[#3B527E] transition-all shadow-sm"
                  title="Dash List"
                >
                  -
                </button>
                <button
                  onClick={() => toggleList('★')}
                  className="bg-white border border-gray-200 text-[#3B527E] w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold hover:bg-[#3B527E] hover:text-white hover:border-[#3B527E] transition-all shadow-sm"
                  title="Star List"
                >
                  ★
                </button>
                <button
                  onClick={() => toggleList('>')}
                  className="bg-white border border-gray-200 text-[#3B527E] w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold hover:bg-[#3B527E] hover:text-white hover:border-[#3B527E] transition-all shadow-sm"
                  title="Arrow List"
                >
                  &gt;
                </button>
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

            {/* Heading Color */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Heading Color</label>
              <div className="relative group">
                <select
                  value={headingColor}
                  onChange={(e) => setHeadingColor(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 appearance-none cursor-pointer focus:bg-white focus:border-[#3B527E] outline-none transition-all"
                >
                  {inkColors.map((c) => (
                    <option key={c.value} value={c.value}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-100 shadow-sm" style={{ backgroundColor: headingColor }} />
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
      </div>
    </div>
  );
}
