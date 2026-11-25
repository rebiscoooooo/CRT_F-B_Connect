import React, { useState } from 'react';
import { BookOpen, Copy, Check, Printer, Download, Clock } from 'lucide-react';

export default function TextLessonViewer({ content, title, downloadUrl }) {
    const [copied, setCopied] = useState(false);
    const [fontSize, setFontSize] = useState('text-base');

    const wordCount = content ? content.trim().split(/\s+/).length : 0;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const handleCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full cyber-glass-card rounded-2xl border border-[#A8E6E8]/20 shadow-sm overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#A8E6E8]/15 bg-[#0A3D4F]/30">
                <div className="flex items-center gap-4 text-xs font-medium text-[#A8E6E8]/70">
                    <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#2EC4D6]" />
                        {wordCount} words
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#A8E6E8]/50" />
                        ~{readingTimeMinutes} min read
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Font size toggles */}
                    <div className="flex items-center bg-[#0A3D4F]/30 border border-[#A8E6E8]/20 rounded-lg p-0.5 text-xs font-semibold text-[#A8E6E8]/70">
                        <button
                            onClick={() => setFontSize('text-sm')}
                            className={`px-2 py-1 rounded ${fontSize === 'text-sm' ? 'bg-[#0B6E8A]/40 text-[#2EC4D6]' : 'hover:bg-[#0B6E8A]/20'}`}
                            title="Small font"
                        >
                            A-
                        </button>
                        <button
                            onClick={() => setFontSize('text-base')}
                            className={`px-2 py-1 rounded ${fontSize === 'text-base' ? 'bg-[#0B6E8A]/40 text-[#2EC4D6]' : 'hover:bg-[#0B6E8A]/20'}`}
                            title="Standard font"
                        >
                            A
                        </button>
                        <button
                            onClick={() => setFontSize('text-lg')}
                            className={`px-2 py-1 rounded ${fontSize === 'text-lg' ? 'bg-[#0B6E8A]/40 text-[#2EC4D6]' : 'hover:bg-[#0B6E8A]/20'}`}
                            title="Large font"
                        >
                            A+
                        </button>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3D4F]/30 border border-[#A8E6E8]/20 hover:bg-[#0B6E8A]/30 text-[#F4FBFC] transition-colors shadow-xs"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#2EC4D6]" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy Text'}
                    </button>

                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0A3D4F]/30 border border-[#A8E6E8]/20 hover:bg-[#0B6E8A]/30 text-[#F4FBFC] transition-colors shadow-xs"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                    </button>

                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg cyber-glow-btn text-[#F4FBFC] transition-colors shadow-sm"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download
                        </a>
                    )}
                </div>
            </div>

            {/* Reading Content Pane */}
            <div className="p-8 sm:p-12 max-w-4xl mx-auto">
                <article className={`prose max-w-none ${fontSize} leading-relaxed font-sans text-[#F4FBFC]`}>
                    {content ? (
                        <div className="whitespace-pre-line">
                            {content}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-[#A8E6E8]/50">
                            <BookOpen className="w-12 h-12 mx-auto text-[#2EC4D6] mb-2" />
                            <p className="text-[#F4FBFC]">No text content available for this lesson.</p>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
}

