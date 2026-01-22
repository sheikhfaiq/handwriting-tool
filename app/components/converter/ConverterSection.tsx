"use client";

import React, { useState, useEffect, useRef } from 'react';
import Controls from './Controls';
import Preview from './Preview';
import Pagination from './Pagination';
import DownloadButtons from './DownloadButtons';
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

    // Word boundary pagination
    // A standard A4 page with handwriting might hold ~800-1000 chars depending on font size
    const CHARS_PER_PAGE = 800;
    const words = text.split(/(\s+)/); // Split by whitespace, keeping delimiters
    const newPages = [];
    let currentPageContent = '';

    for (const word of words) {
      if ((currentPageContent + word).length > CHARS_PER_PAGE) {
        if (currentPageContent) newPages.push(currentPageContent);
        currentPageContent = word;
      } else {
        currentPageContent += word;
      }
    }
    if (currentPageContent) newPages.push(currentPageContent);

    setPages(newPages);

    // Reset to first page if current page is out of bounds
    if (currentPage >= newPages.length) {
      setCurrentPage(0);
    }
  }, [text]);

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
    <section className="py-16 bg-indigo-50/50 min-h-screen w-full" id="convert">
      <div className="w-full px-4 md:px-8 lg:px-12">
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
        />

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

        <Pagination
          currentPage={currentPage}
          totalPages={pages.length}
          onPageChange={setCurrentPage}
        />

        <DownloadButtons
          onDownloadImage={handleDownloadImage}
          onDownloadPDF={handleDownloadPDF}
          isGenerating={isGenerating}
        />
      </div>
    </section>
  );
}
