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
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        {wordCount} words
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        ~{readingTimeMinutes} min read
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Font size toggles */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold text-slate-600">
                        <button
                            onClick={() => setFontSize('text-sm')}
                            className={`px-2 py-1 rounded ${fontSize === 'text-sm' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'}`}
                            title="Small font"
                        >
                            A-
                        </button>
                        <button
                            onClick={() => setFontSize('text-base')}
                            className={`px-2 py-1 rounded ${fontSize === 'text-base' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'}`}
                            title="Standard font"
                        >
                            A
                        </button>
                        <button
                            onClick={() => setFontSize('text-lg')}
                            className={`px-2 py-1 rounded ${fontSize === 'text-lg' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'}`}
                            title="Large font"
                        >
                            A+
                        </button>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy Text'}
                    </button>

                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                    </button>

                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Download
                        </a>
                    )}
                </div>
            </div>

            {/* Reading Content Pane */}
            <div className="p-8 sm:p-12 max-w-4xl mx-auto">
                <article className={`prose prose-slate max-w-none ${fontSize} leading-relaxed font-sans text-slate-800`}>
                    {content ? (
                        <div className="whitespace-pre-line">
                            {content}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                            <p>No text content available for this lesson.</p>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
}

