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
  const [slant, setSlant] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [wobble, setWobble] = useState(0);
  const [fontSize, setFontSize] = useState(24);
  const [lineHeight, setLineHeight] = useState(1.5);
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
    } else if (paper === 'notebook-margin') {
      horizontalMarginLeft = 64; // 4rem
      verticalMarginTop = 8; // 0.5rem
    } else if (paper === 'assignment-1' || paper === 'assignment-2') {
      verticalMarginTop = 48; // 3rem
      horizontalMarginLeft = 32; // 2rem or 3rem
      horizontalMarginRight = 32;
    }

    // Adjust usable width/height
    const availableWidth = PAGE_WIDTH - (horizontalMarginLeft + horizontalMarginRight);

    // We need to measure the text precisely using the DOM
    const measureDiv = document.createElement('div');
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.position = 'absolute';
    measureDiv.style.whiteSpace = 'pre';
    measureDiv.style.fontFamily = font;
    measureDiv.style.fontSize = `${fontSize}px`;
    measureDiv.style.lineHeight = `${lineHeight}`;

    document.body.appendChild(measureDiv);

    // Calculate lines per page
    // Content height is influenced by line-height * font-size
    const singleLineHeightPx = fontSize * lineHeight;
    const availableHeight = PAGE_HEIGHT - (verticalMarginTop + verticalMarginBottom);
    const maxLinesPerPage = Math.floor(availableHeight / singleLineHeightPx);

    const newPages: string[] = [];
    let currentPageLines = 0;
    let currentPageContent = '';

    const paragraphs = text.split('\n');

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];

      if (paragraph === '') {
        if (currentPageLines + 1 > maxLinesPerPage) {
          newPages.push(currentPageContent);
          currentPageContent = '';
          currentPageLines = 0;
        }
        currentPageContent += '\n';
        currentPageLines++;
        continue;
      }

      const words = paragraph.split(/(\s+)/);
      let currentLineWidth = 0;

      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        if (word === '') continue;

        // Measure word width
        measureDiv.textContent = word;
        // Add spacing adjustment: (word.length - 1) * wordSpacing, plus wordSpacing after?
        // In Preview, wordSpacing is applied to EACH char.
        // So total width += length * wordSpacing.
        let wordWidth = measureDiv.offsetWidth + (word.length * wordSpacing);

        if (currentLineWidth + wordWidth > availableWidth) {
          // Use a tolerance?
          if (currentLineWidth > 0) {
            // Wrap
            currentPageLines++;
            if (currentPageLines >= maxLinesPerPage) {
              newPages.push(currentPageContent);
              currentPageContent = '';
              currentPageLines = 0;
            }
            currentLineWidth = wordWidth;
          } else {
            // Word is wider than entire line, forced break or clip
            currentPageLines++;
            if (currentPageLines >= maxLinesPerPage) {
              newPages.push(currentPageContent);
              currentPageContent = '';
              currentPageLines = 0;
            }
            currentLineWidth = wordWidth;
          }
        } else {
          currentLineWidth += wordWidth;
        }

        currentPageContent += word;
      }

      if (i < paragraphs.length - 1) {
        currentPageContent += '\n';
        currentPageLines++;
        currentLineWidth = 0;
        if (currentPageLines >= maxLinesPerPage) {
          newPages.push(currentPageContent);
          currentPageContent = '';
          currentPageLines = 0;
        }
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
