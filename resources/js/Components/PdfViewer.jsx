import React, { useState } from 'react';
import { Download, Maximize2, ExternalLink, FileText } from 'lucide-react';

export default function PdfViewer({ src, title, downloadUrl }) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <div className="w-full space-y-3">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold truncate max-w-sm">{title || 'PDF Document'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                    {src && (
                        <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open in New Tab
                        </a>
                    )}
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download PDF
                        </a>
                    )}
                </div>
            </div>

            {/* Embedded PDF iframe / object container */}
            <div
                className={`relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md ${
                    isFullscreen ? 'fixed inset-4 z-50 shadow-2xl h-[calc(100vh-2rem)]' : 'h-[650px] w-full'
                }`}
            >
                {src ? (
                    <iframe
                        src={`${src}#toolbar=1&navpanes=1`}
                        title={title || 'PDF Viewer'}
                        className="w-full h-full border-0 rounded-2xl"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                        <FileText className="w-16 h-16 text-slate-500 mb-3" />
                        <p className="text-base font-semibold text-slate-200">PDF preview is not available</p>
                        <p className="text-sm text-slate-400 mt-1">Please use the download button above to view the file locally.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

