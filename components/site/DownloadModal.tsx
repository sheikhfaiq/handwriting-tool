
import React from 'react';
import { X, Download, FileText, Images } from 'lucide-react';

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (mode: 'single' | 'all') => void;
    title: string;
    isGenerating: boolean;
    progress?: number;
}

export default function DownloadModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    isGenerating,
    progress = 0,
}: DownloadModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900">{isGenerating ? 'Downloading...' : title}</h3>
                    {!isGenerating && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-4 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                                <div className="relative bg-white p-4 rounded-full shadow-md border-2 border-blue-100">
                                    <Download size={32} className="text-blue-600 animate-bounce" />
                                </div>
                            </div>

                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-sm font-medium text-gray-600">
                                    <span>Generating files...</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${Math.max(5, progress)}%` }}
                                    >
                                        <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="text-xs text-center text-gray-400 mt-2">
                                    Please wait while we convert your handwriting...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-6">
                                Would you like to download all pages or just the currently visible page?
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => onConfirm('single')}
                                    className="group flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left w-full"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mr-4 group-hover:scale-110 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Current Page</div>
                                        <div className="text-sm text-gray-500">Download only the page you are viewing</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => onConfirm('all')}
                                    className="group flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left w-full"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mr-4 group-hover:scale-110 transition-transform">
                                        <Images size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">All Pages</div>
                                        <div className="text-sm text-gray-500">
                                            {title.includes('PDF') ? 'Single PDF with all pages' : 'ZIP archive with all pages'}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
