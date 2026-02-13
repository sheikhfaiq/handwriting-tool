"use client";

import React, { useState, useEffect, useRef } from 'react';
import Controls from './Controls';
import Preview from './Preview';
import Pagination from './Pagination';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import DownloadModal from './DownloadModal';

export interface ElementStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  lineHeight?: number;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  isList?: boolean;
  isOrderedList?: boolean;
}

export interface Element {
  id: string;
  type: 'text' | 'heading';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: ElementStyle;
}

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
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadType, setDownloadType] = useState<'image' | 'pdf'>('image');
  const [progress, setProgress] = useState(0);
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
      horizontalMarginLeft = 72; // 4.5rem
      verticalMarginTop = 8; // 0.5rem
      verticalMarginBottom = 8;
    } else if (paper === 'notebook-margin') {
      horizontalMarginLeft = 64; // 4rem
      verticalMarginTop = 8; // 0.5rem
    } else if (paper === 'assignment-1') {
      verticalMarginTop = 48; // 3rem
      horizontalMarginLeft = 32; // 2rem
      horizontalMarginRight = 32;
    } else if (paper === 'assignment-2') {
      verticalMarginTop = 48; // 3rem
      horizontalMarginLeft = 48; // 3rem
      horizontalMarginRight = 48;
    } else if (paper === 'floral-rose' || paper === 'floral-lavender' || paper === 'floral-tropical' || paper === 'heart-border' || paper === 'geometric' || paper === 'wishlist-3' || paper === 'wishlist-5') {
      horizontalMarginLeft = 80; // 5rem
      horizontalMarginRight = 80;
      verticalMarginTop = 80;
    } else if (paper === 'parchment' || paper === 'sketchbook' || paper === 'blueprint' || paper === 'antique-blue' || paper === 'wishlist-2' || paper === 'wishlist-4') {
      horizontalMarginLeft = 64; // 4rem
      horizontalMarginRight = 64;
      verticalMarginTop = 64;
    } else if (paper === 'classic-scroll') {
      horizontalMarginLeft = 80; // 5rem
      horizontalMarginRight = 80;
      verticalMarginTop = 96; // 6rem
    } else if (paper === 'wishlist-1') {
      horizontalMarginLeft = 64; // 4rem
      horizontalMarginRight = 64;
      verticalMarginTop = 96; // 6rem
    } else if (paper === 'border-2') {
      horizontalMarginLeft = 96; // 6rem
      horizontalMarginRight = 96;
      verticalMarginTop = 96;
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
      let scale = 1;

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

    // Helper to remove markdown for measurement
    const removeMarkdown = (txt: string) => {
      return txt; // No longer removing markdown since we've simplified to plain text
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

      for (let j = 0; j < words.length; j++) {
        const word = words[j];
        if (word === '') continue;

        // Measure word width
        const cleanWord = removeMarkdown(word);
        measureDiv.textContent = cleanWord;
        let wordWidth = measureDiv.offsetWidth;

        // Add letter spacing (wordSpacing is applied to each character)
        wordWidth += (cleanWord.length * wordSpacing);

        if (currentLineWidth + wordWidth > availableWidth) {
          if (currentLineWidth > 0) {
            // Wrap to next line
            addLineToPage(currentLineBuffer);
            currentLineBuffer = '';
            currentLineWidth = 0;
          }

          // Check if word itself causes overflow
          if (wordWidth > availableWidth) {
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
      if (currentLineBuffer.length > 0 || currentLineWidth > 0) {
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

  const addElement = (type: 'text' | 'heading') => {
    const newElement: Element = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: type === 'heading' ? 'Heading...' : 'Enter text here...',
      x: 100,
      y: 100,
      width: type === 'heading' ? 300 : 250,
      height: type === 'heading' ? 80 : 150,
      style: {
        fontSize: type === 'heading' ? 48 : 24,
        lineHeight: 1.2,
        color: inkColor,
        bold: type === 'heading',
        textAlign: 'left'
      }
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleDownloadImage = () => {
    setDownloadType('image');
    setDownloadModalOpen(true);
  };

  const handleDownloadPDF = () => {
    setDownloadType('pdf');
    setDownloadModalOpen(true);
  };

  const handleDownloadConfirm = async (mode: 'single' | 'all') => {
    setIsGenerating(true);
    setProgress(0);

    // Wait for modal to close and state to update
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      if (downloadType === 'image') {
        if (mode === 'single') {
          setProgress(10);
          if (!previewRef.current) return;
          setProgress(30);
          const dataUrl = await toPng(previewRef.current, { quality: 0.95 });
          setProgress(70);
          saveAs(dataUrl, `handwriting-page-${currentPage + 1}.png`);
          setProgress(100);
        } else {
          // Download all pages as ZIP
          const zip = new JSZip();

          for (let i = 0; i < pages.length; i++) {
            const pageEl = document.getElementById(`page-export-${i}`);
            if (pageEl) {
              const dataUrl = await toPng(pageEl, { quality: 0.95 });
              // Remove data:image/png;base64, prefix
              const base64Data = dataUrl.split(',')[1];
              zip.file(`handwriting-page-${i + 1}.png`, base64Data, { base64: true });

              // Update progress based on page processing (0-50%)
              const percent = Math.round(((i + 1) / pages.length) * 50);
              setProgress(percent);
              // Small delay to allow UI to update
              await new Promise(r => setTimeout(r, 50));
            }
          }

          // Generate zip (50-100%)
          const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
            setProgress(50 + (metadata.percent / 2));
          });
          saveAs(content, 'handwriting-pages.zip');
          setProgress(100);
        }
      } else {
        // PDF Download
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        if (mode === 'single') {
          setProgress(10);
          // For single page PDF, we can use the hidden export element for the current page
          // to ensure clean export without UI wrapper, simply accessing by index
          const pageEl = document.getElementById(`page-export-${currentPage}`);
          if (pageEl) {
            setProgress(30);
            const dataUrl = await toPng(pageEl, { quality: 0.95 });
            setProgress(50);
            const imgProps = pdf.getImageProperties(dataUrl);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);
            setProgress(80);
            pdf.save(`handwriting-page-${currentPage + 1}.pdf`);
            setProgress(100);
          }
        } else {
          // All pages
          for (let i = 0; i < pages.length; i++) {
            const pageEl = document.getElementById(`page-export-${i}`);
            if (pageEl) {
              const dataUrl = await toPng(pageEl, { quality: 0.95 });
              const imgProps = pdf.getImageProperties(dataUrl);
              const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

              if (i > 0) pdf.addPage();
              pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);

              const percent = Math.round(((i + 1) / pages.length) * 100);
              setProgress(percent);
              await new Promise(r => setTimeout(r, 50));
            }
          }
          pdf.save('handwriting.pdf');
          setProgress(100);
        }
      }
    } catch (err) {
      console.error('Failed to download', err);
    } finally {
      // Small delay before closing modal to show 100%
      setTimeout(() => {
        setIsGenerating(false);
        setDownloadModalOpen(false);
        setProgress(0);
      }, 500);
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
              headingColor={headingColor}
              setHeadingColor={setHeadingColor}
              addElement={addElement}
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
                headingColor={headingColor}
                titlePos={titlePos}
                setTitlePos={setTitlePos}
                datePos={datePos}
                setDatePos={setDatePos}
                addElement={addElement}
                elements={elements}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
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
                headingColor={headingColor}
                titlePos={titlePos}
                setTitlePos={() => { }}
                datePos={datePos}
                setDatePos={() => { }}
                addElement={addElement}
                elements={elements}
                selectedElementId={null}
                onSelectElement={() => { }}
                onUpdateElement={() => { }}
                onDeleteElement={() => { }}
                previewRef={null}
                isExport={true}
              />
            </div>
          ))}
        </div>
      </div>

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        onConfirm={handleDownloadConfirm}
        title={downloadType === 'image' ? 'Download PNG' : 'Download PDF'}
        isGenerating={isGenerating}
        progress={progress}
      />
    </section>
  );
}
