import React from 'react';

interface DownloadButtonsProps {
  onDownloadImage: () => void;
  onDownloadPDF: () => void;
  isGenerating: boolean;
}

export default function DownloadButtons({
  onDownloadImage,
  onDownloadPDF,
  isGenerating,
}: DownloadButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      <button
        onClick={onDownloadImage}
        disabled={isGenerating}
        className="bg-[#1e355e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a4a80] transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-wait"
      >
        <span>🖼️</span>
        <span>{isGenerating ? 'Generating...' : 'Download Image'}</span>
      </button>

      <button
        onClick={onDownloadPDF}
        disabled={isGenerating}
        className="bg-[#1e355e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a4a80] transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-wait"
      >
        <span>📄</span>
        <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
      </button>
    </div>
  );
}
