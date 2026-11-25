import React, { useState } from 'react';
import { Download, Maximize2, ExternalLink, FileText } from 'lucide-react';

export default function PdfViewer({ src, title, downloadUrl }) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <div className="w-full space-y-3">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0A3D4F]/30 rounded-xl border border-[#A8E6E8]/20">
                <div className="flex items-center gap-2 text-[#A8E6E8]/80">
                    <FileText className="w-5 h-5 text-[#2EC4D6]" />
                    <span className="text-sm font-semibold truncate max-w-sm">{title || 'PDF Document'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3D4F]/30 border border-[#A8E6E8]/20 hover:bg-[#0B6E8A]/30 text-[#F4FBFC] transition-colors shadow-xs"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                    {src && (
                        <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3D4F]/30 border border-[#A8E6E8]/20 hover:bg-[#0B6E8A]/30 text-[#F4FBFC] transition-colors shadow-xs"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open in New Tab
                        </a>
                    )}
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg cyber-glow-btn text-[#F4FBFC] transition-colors shadow-sm"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download PDF
                        </a>
                    )}
                </div>
            </div>

            {/* Embedded PDF iframe / object container */}
            <div
                className={`relative rounded-2xl overflow-hidden border border-[#A8E6E8]/20 bg-[#061923]/80 shadow-md ${
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
                    <div className="flex flex-col items-center justify-center h-full text-[#A8E6E8]/50 p-8 text-center">
                        <FileText className="w-16 h-16 text-[#2EC4D6] mb-3" />
                        <p className="text-base font-semibold text-[#F4FBFC]">PDF preview is not available</p>
                        <p className="text-sm text-[#A8E6E8]/70 mt-1">Please use the download button above to view the file locally.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

