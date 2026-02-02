"use client";

import React, { useState, useEffect, useRef } from 'react';
import Controls from './Controls';
import Preview from './Preview';
import Pagination from './Pagination';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export default function ConverterSection() {
  const [text, setText] = useState('');
  const [font, setFont] = useState('var(--font-indie-flower)');
  const [paper, setPaper] = useState('ruled');
  const [inkColor, setInkColor] = useState('#1e3a8a');
  const [headingColor, setHeadingColor] = useState('#1e3a8a');
  const [slant, setSlant] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [wobble, setWobble] = useState(0);
  const [fontSize, setFontSize] = useState(24);
  const [lineHeight, setLineHeight] = useState(2);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [pageDate, setPageDate] = useState('');
  const [titlePos, setTitlePos] = useState({ x: 50, y: 50 });
  const [datePos, setDatePos] = useState({ x: 50, y: 100 });
  const [extraFields, setExtraFields] = useState<{ id: string; text: string; x: number; y: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Pagination Logic
  // Pagination Logic
  useEffect(() => {
    if (!text) {
      setPages(['']);
      return;
    }

    // A4 Dimensions in Pixels (approx at 96dpi)
    const PAGE_HEIGHT = 1123;
    const PAGE_WIDTH = 794;

    // Estimate margins based on paper type
    // These should match the CSS padding in Preview.tsx
    let verticalMarginTop = 48; // p-12 is 3rem = ~48px
    let verticalMarginBottom = 48;
    let horizontalMarginLeft = 48;
    let horizontalMarginRight = 48;

    if (paper === 'ruled') {
      horizontalMarginLeft = 72; // 4.5rem = ~72px
      verticalMarginTop = 8; // 0.5rem
      verticalMarginBottom = 8; // Reduce bottom margin to match top and maximize space
    } else if (paper === 'notebook-margin') {
      horizontalMarginLeft = 64; // 4rem
      verticalMarginTop = 8; // 0.5rem
    } else if (paper === 'assignment-1' || paper === 'assignment-2') {
      verticalMarginTop = 48; // 3rem
      horizontalMarginLeft = 32; // 2rem or 3rem
      horizontalMarginRight = 32;
    }

    // Adjust usable width/height
    const availableWidth = PAGE_WIDTH - (horizontalMarginLeft + horizontalMarginRight) - 20;

    // We need to measure the text precisely using the DOM
    const measureDiv = document.createElement('div');
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.position = 'absolute';
    measureDiv.style.whiteSpace = 'pre';
    measureDiv.style.fontFamily = font;
    measureDiv.style.fontSize = `${fontSize}px`;
    measureDiv.style.lineHeight = `${lineHeight}`;

    document.body.appendChild(measureDiv);

    // Calculate lines per page using Pixel Height
    const baseLineHeightPx = fontSize * lineHeight;
    // Subtract a safety buffer (e.g. 40px) to ensure we don't write to the very edge and risk clipping
    // Subtract a safety buffer (reduced to 3px to absolute maximum page usage) to ensure we don't write to the very edge
    const safetyBuffer = 3;
    const availableHeight = PAGE_HEIGHT - (verticalMarginTop + verticalMarginBottom + safetyBuffer);

    const newPages: string[] = [];
    let currentHeightUsed = 0;
    let currentPageContent = '';

    // Helper to add a visual line to the current page
    const addLineToPage = (lineContent: string) => {
      // Determine height of this specific line
      // Update regex to support optional color syntax: ##[color:#ff0000] Title
      const headingMatch = lineContent.match(/^(#{1,6})(?:\[color:(.*?)\])?\s/);
      const headingLevel = headingMatch ? headingMatch[1].length : 0;

      let scale = 1;
      if (headingLevel > 0) {
        const headingScales: Record<number, number> = {
          1: 2, 2: 1.75, 3: 1.5, 4: 1.3, 5: 1.2, 6: 1.1,
        };
        scale = headingScales[headingLevel] || 1;
      }

      // Snap to grid: Align with ruled lines by rounding up to nearest integer multiple
      // This matches Preview.tsx logic to ensure pagination is accurate
      const thisLineHeight = Math.ceil(scale) * baseLineHeightPx;

      // Check if this line fits
      if (currentHeightUsed + thisLineHeight > availableHeight) {
        // Push current page
        // If currentPageContent is empty, it means this single line is HUGE or we just started.
        // But usually it means we are overflowing.
        if (currentPageContent.length > 0) {
          newPages.push(currentPageContent);
          currentPageContent = lineContent;
          currentHeightUsed = thisLineHeight;
        } else {
          // Edge case: Line is taller than entire page? Just add it.
          newPages.push(lineContent);
          currentPageContent = '';
          currentHeightUsed = 0;
        }
      } else {
        // Fits on current page
        if (currentPageContent.length > 0) {
          currentPageContent += '\n' + lineContent;
        } else {
          currentPageContent = lineContent;
        }
        currentHeightUsed += thisLineHeight;
      }
    };

    const paragraphs = text.split('\n');

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];

      if (paragraph === '') {
        addLineToPage('');
        continue;
      }

      const words = paragraph.split(/(\s+)/);
      let currentLineWidth = 0;
      let currentLineBuffer = '';

      // We need to keep track if the *original* paragraph started with #
      // If it wraps, subsequent lines lose the # prefix by default in this logic, which is correct for Markdown.

      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        if (word === '') continue;

        // Measure word width
        let wordWidth = 0;
        for (let charIndex = 0; charIndex < word.length; charIndex++) {
          measureDiv.textContent = word[charIndex];
          wordWidth += measureDiv.offsetWidth;
        }
        wordWidth += (word.length * wordSpacing);

        if (currentLineWidth + wordWidth > availableWidth) {
          if (currentLineWidth > 0) {
            // Wrap to next line
            addLineToPage(currentLineBuffer);
            currentLineBuffer = '';
            currentLineWidth = 0;
          }

          // Check if word itself causes overflow
          if (wordWidth > availableWidth) {
            // Split word char by char
            let currentSubWord = '';
            let currentSubWidth = 0;

            for (let k = 0; k < word.length; k++) {
              const char = word[k];
              measureDiv.textContent = char;
              const charWidth = measureDiv.offsetWidth + wordSpacing;

              if (currentSubWidth + charWidth > availableWidth) {
                addLineToPage(currentSubWord);
                currentSubWord = char;
                currentSubWidth = charWidth;
              } else {
                currentSubWord += char;
                currentSubWidth += charWidth;
              }
            }
            currentLineBuffer = currentSubWord;
            currentLineWidth = currentSubWidth;
          } else {
            // Word fits on new line
            currentLineBuffer = word;
            currentLineWidth = wordWidth;
          }
        } else {
          // Fits on current line
          currentLineBuffer += word;
          currentLineWidth += wordWidth;
        }
      }

      // Flush remainder of paragraph
      if (currentLineBuffer.length > 0 || currentLineWidth > 0) { // Check length or width to be safe
        addLineToPage(currentLineBuffer);
      }
    }

    if (currentPageContent) {
      newPages.push(currentPageContent);
    }

    document.body.removeChild(measureDiv);

    if (newPages.length === 0) setPages(['']);
    else setPages(newPages);

    if (currentPage >= newPages.length) {
      setCurrentPage(0);
    }
  }, [text, fontSize, lineHeight, paper, font, wordSpacing]);



  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(previewRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `handwriting-page-${currentPage + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const pageEl = document.getElementById(`page-export-${i}`);
        if (pageEl) {
          const dataUrl = await toPng(pageEl, { quality: 0.95 });
          const imgProps = pdf.getImageProperties(dataUrl);
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

          if (i > 0) pdf.addPage();
          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);
        }
      }

      pdf.save('handwriting.pdf');
    } catch (err) {
      console.error('Failed to download PDF', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-12 bg-[#F5F5F7] min-h-screen w-full relative overflow-hidden" id="convert">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4]"
        style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-8">
            <Controls
              text={text}
              setText={setText}
              font={font}
              setFont={setFont}
              paper={paper}
              setPaper={setPaper}
              inkColor={inkColor}
              setInkColor={setInkColor}
              headingColor={headingColor}
              setHeadingColor={setHeadingColor}
              slant={slant}
              setSlant={setSlant}
              rotate={rotate}
              setRotate={setRotate}
              wobble={wobble}
              setWobble={setWobble}
              fontSize={fontSize}
              setFontSize={setFontSize}
              lineHeight={lineHeight}
              setLineHeight={setLineHeight}
              wordSpacing={wordSpacing}
              setWordSpacing={setWordSpacing}
              pageTitle={pageTitle}
              setPageTitle={setPageTitle}
              pageDate={pageDate}
              setPageDate={setPageDate}
              extraFields={extraFields}
              setExtraFields={setExtraFields}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7 space-y-8">
            <div className="sticky top-8">
              <Preview
                pages={pages}
                currentPage={currentPage}
                font={font}
                paper={paper}
                inkColor={inkColor}
                headingColor={headingColor}
                slant={slant}
                rotate={rotate}
                wobble={wobble}
                fontSize={fontSize}
                lineHeight={lineHeight}
                wordSpacing={wordSpacing}
                pageTitle={pageTitle}
                pageDate={pageDate}
                titlePos={titlePos}
                setTitlePos={setTitlePos}
                datePos={datePos}
                setDatePos={setDatePos}
                extraFields={extraFields}
                setExtraFields={setExtraFields}
                previewRef={previewRef}
                onDownloadImage={handleDownloadImage}
                onDownloadPDF={handleDownloadPDF}
                isGenerating={isGenerating}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={pages.length}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

        {/* Hidden container for generating all pages */}
        <div style={{ position: 'absolute', top: -10000, left: -10000, pointerEvents: 'none' }}>
          {pages.map((page, index) => (
            <div key={index} id={`page-export-${index}`}>
              <Preview
                pages={pages}
                currentPage={index}
                font={font}
                paper={paper}
                inkColor={inkColor}
                headingColor={headingColor}
                slant={slant}
                rotate={rotate}
                wobble={wobble}
                fontSize={fontSize}
                lineHeight={lineHeight}
                wordSpacing={wordSpacing}
                pageTitle={pageTitle}
                pageDate={pageDate}
                titlePos={titlePos}
                setTitlePos={() => { }}
                datePos={datePos}
                setDatePos={() => { }}
                extraFields={extraFields}
                setExtraFields={() => { }} // No-op for export
                previewRef={null}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
