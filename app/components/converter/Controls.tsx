import React from 'react';

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
];

const papers = [
  { name: 'Ruled Lines', value: 'ruled' },
  { name: 'Plain White', value: 'plain' },
  { name: 'Vintage Paper', value: 'vintage' },
  { name: 'Grid Paper', value: 'grid' },
  { name: 'Assignment (Simple)', value: 'assignment-1' },
  { name: 'Assignment (Border)', value: 'assignment-2' },
  { name: 'Notebook (Margin)', value: 'notebook-margin' },
];

const inkColors = [
  { name: 'Blue', value: '#1e3a8a' }, // blue-900
  { name: 'Black', value: '#171717' }, // neutral-900
  { name: 'Red', value: '#b91c1c' }, // red-700
  { name: 'Green', value: '#15803d' }, // green-700
  { name: 'Purple', value: '#7e22ce' }, // purple-700
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

    // If nothing selected, just insert markers
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    setText(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const insertHeading = () => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;

    // Find start of current line
    const lastNewLine = text.lastIndexOf('\n', start - 1);
    const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;

    // Check if already a heading
    const currentLine = text.substring(lineStart, text.indexOf('\n', lineStart) === -1 ? text.length : text.indexOf('\n', lineStart));
    const isHeading = currentLine.startsWith('# ');

    let newText;
    let newCursorPos;

    if (isHeading) {
      // Remove heading
      newText = text.substring(0, lineStart) + currentLine.substring(2) + text.substring(lineStart + currentLine.length);
      newCursorPos = start - 2;
    } else {
      // Add heading
      newText = text.substring(0, lineStart) + '# ' + currentLine + text.substring(lineStart + currentLine.length);
      newCursorPos = start + 2;
    }

    setText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const addTextField = () => {
    const newField = {
      id: Date.now().toString(),
      text: 'New Text',
      x: 50, // Default position
      y: 50,
    };
    setExtraFields([...extraFields, newField]);
  };

  return (
    <div className="bg-white p-8 rounded-xl border-4 border-[#1e355e] shadow-[8px_8px_0px_0px_#1e355e] mb-12">
      <h2 className="text-3xl font-black text-[#1e355e] mb-8 text-center uppercase tracking-tight">Convert Your Text Now</h2>

      {/* Text Input */}
      <div className="mb-8">
        <label className="text-sm font-bold text-[#1e355e] mb-3 uppercase tracking-wide flex justify-between">Enter Your Text:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-5 border-4 border-[#1e355e] rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_#1e355e] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all bg-white text-gray-800 text-lg placeholder-gray-400 font-medium"
          placeholder="Type or paste your text here to convert it into handwriting..."
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          <button onClick={() => insertFormat('**', '**')} className="px-3 py-1 text-sm font-bold border-2 border-[#1e355e] rounded bg-[#1e355e] text-white hover:bg-[#1e355e]/90">Bold</button>
          <button onClick={() => insertFormat('*', '*')} className="px-3 py-1 text-sm italic border-2 border-[#1e355e] rounded bg-[#1e355e] text-white hover:bg-[#1e355e]/90">Italic</button>
          <button onClick={() => insertFormat('__', '__')} className="px-3 py-1 text-sm underline border-2 border-[#1e355e] rounded bg-[#1e355e] text-white hover:bg-[#1e355e]/90">Underline</button>
          {/* <button onClick={insertHeading} className="px-3 py-1 text-sm font-bold border-2 border-[#1e355e] rounded bg-[#1e355e] text-white hover:bg-[#1e355e]/90">Heading</button>
          <button onClick={addTextField} className="px-3 py-1 text-sm font-bold border-2 border-[#1e355e] rounded bg-white text-[#1e355e] hover:bg-gray-50">Add Text Field</button> */}
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Handwriting Style */}
        <div>
          <label className="text-sm font-bold text-[#1e355e] mb-3 uppercase tracking-wide flex justify-between">Handwriting Style:</label>
          <div className="relative">
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full p-4 border-4 border-[#1e355e] rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_#1e355e] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all bg-white text-gray-800 appearance-none cursor-pointer font-bold"
            >
              {fonts.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#1e355e]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Paper Type */}
        <div>
          <label className="text-sm font-bold text-[#1e355e] mb-3 uppercase tracking-wide flex justify-between">Paper Type:</label>
          <div className="relative">
            <select
              value={paper}
              onChange={(e) => setPaper(e.target.value)}
              className="w-full p-4 border-4 border-[#1e355e] rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_#1e355e] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all bg-white text-gray-800 appearance-none cursor-pointer font-bold"
            >
              {papers.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#1e355e]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Ink Color */}
        <div>
          <label className="text-sm font-bold text-[#1e355e] mb-3 uppercase tracking-wide flex justify-between">Ink Color:</label>
          <div className="relative">
            <select
              value={inkColor}
              onChange={(e) => setInkColor(e.target.value)}
              className="w-full p-4 border-4 border-[#1e355e] rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_#1e355e] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all bg-white text-gray-800 appearance-none cursor-pointer font-bold"
            >
              {inkColors.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#1e355e]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Formatting & Header Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t-2 border-[#1e355e]/20 pt-8">
        {/* Text Formatting */}
        <div>
          <h3 className="text-xl font-bold text-[#1e355e] mb-6 uppercase tracking-wide">Text Formatting</h3>
          <div className="space-y-6">
            {/* Font Size */}
            <div>
              <label className="text-sm font-bold text-[#1e355e] mb-3 flex justify-between">
                <span className="uppercase tracking-wide">Font Size</span>
                <span>{fontSize}px</span>
              </label>
              <input
                type="range"
                min="12"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e355e]"
              />
            </div>

            {/* Line Height */}
            <div>
              <label className="text-sm font-bold text-[#1e355e] mb-3 flex justify-between">
                <span className="uppercase tracking-wide">Line Spacing</span>
                <span>{lineHeight}</span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e355e]"
              />
            </div>

            {/* Word Spacing */}
            <div>
              <label className="text-sm font-bold text-[#1e355e] mb-3 flex justify-between">
                <span className="uppercase tracking-wide">Word Spacing</span>
                <span>{wordSpacing}px</span>
              </label>
              <input
                type="range"
                min="-2"
                max="10"
                value={wordSpacing}
                onChange={(e) => setWordSpacing(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e355e]"
              />
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div>
          <h3 className="text-xl font-bold text-[#1e355e] mb-6 uppercase tracking-wide">Page Header</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-[#1e355e] mb-2 uppercase tracking-wide flex justify-between">Title / Heading</label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="w-full p-3 border-2 border-[#1e355e] rounded-lg focus:outline-none focus:shadow-[2px_2px_0px_0px_#1e355e] transition-all bg-white text-gray-800 font-medium"
                placeholder="e.g. Assignment 1"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[#1e355e] mb-2 uppercase tracking-wide flex justify-between">Date / Subtitle</label>
              <input
                type="text"
                value={pageDate}
                onChange={(e) => setPageDate(e.target.value)}
                className="w-full p-3 border-2 border-[#1e355e] rounded-lg focus:outline-none focus:shadow-[2px_2px_0px_0px_#1e355e] transition-all bg-white text-gray-800 font-medium"
                placeholder="e.g. October 24, 2023"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Humanization Controls */}
      <div className="border-t-2 border-[#1e355e]/20 pt-8">
        <h3 className="text-xl font-bold text-[#1e355e] mb-6 uppercase tracking-wide">Humanize Handwriting</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Slant */}
          <div>
            <label className="text-sm font-bold text-[#1e355e] mb-3 flex justify-between">
              <span className="uppercase tracking-wide">Slant</span>
              <span>{slant}°</span>
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              value={slant}
              onChange={(e) => setSlant(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e355e]"
            />
          </div>

          {/* Rotation */}
          <div>
            <label className="text-sm font-bold text-[#1e355e] mb-3 flex justify-between">
              <span className="uppercase tracking-wide">Random Rotation</span>
              <span>{rotate}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={rotate}
              onChange={(e) => setRotate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e355e]"
            />
          </div>

          {/* Wobble */}
          <div>
            <label className="text-sm font-bold text-[#1e355e] mb-3 flex justify-between">
              <span className="uppercase tracking-wide">Wobble</span>
              <span>{wobble}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={wobble}
              onChange={(e) => setWobble(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e355e]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
