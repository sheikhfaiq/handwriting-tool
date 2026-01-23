import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-6 py-6">
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#3B527E] hover:text-[#3B527E] transition-all shadow-sm"
        title="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm">
        <span className="text-gray-500 text-sm font-semibold">
          Page <span className="text-[#3B527E]">{currentPage + 1}</span> of <span className="text-gray-400 font-medium">{totalPages}</span>
        </span>
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#3B527E] hover:text-[#3B527E] transition-all shadow-sm"
        title="Next Page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
