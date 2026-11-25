import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download, Maximize2, X } from 'lucide-react';

export default function ImageViewer({ src, title, downloadUrl }) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
    const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
    const handleRotate = () => setRotation((r) => (r + 90) % 360);
    const handleReset = () => {
        setScale(1);
        setRotation(0);
    };

    return (
        <div className="w-full">
            {/* Inline Preview Container */}
            <div className="relative group rounded-2xl overflow-hidden bg-[#061923] border border-[#A8E6E8]/20 shadow-lg flex items-center justify-center min-h-[380px] p-4">
                <img
                    src={src}
                    alt={title || 'Illustration preview'}
                    style={{
                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                        transition: 'transform 0.2s ease-in-out',
                    }}
                    className="max-h-[500px] w-auto object-contain cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
                />

                {/* Floating toolbar */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#061923]/85 backdrop-blur-md p-1.5 rounded-xl border border-[#A8E6E8]/20 text-[#F4FBFC] shadow-xl">
                    <button
                        onClick={handleZoomIn}
                        title="Zoom In"
                        className="p-1.5 hover:bg-[#0B6E8A]/40 hover:text-[#2EC4D6] rounded-lg transition-colors cursor-pointer"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        title="Zoom Out"
                        className="p-1.5 hover:bg-[#0B6E8A]/40 hover:text-[#2EC4D6] rounded-lg transition-colors cursor-pointer"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleRotate}
                        title="Rotate"
                        className="p-1.5 hover:bg-[#0B6E8A]/40 hover:text-[#2EC4D6] rounded-lg transition-colors cursor-pointer"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleReset}
                        title="Reset"
                        className="px-2 py-1 text-xs font-semibold hover:bg-[#0B6E8A]/40 hover:text-[#2EC4D6] rounded-lg transition-colors cursor-pointer"
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        title="Full Screen Lightbox"
                        className="p-1.5 hover:bg-[#0B6E8A]/40 hover:text-[#2EC4D6] rounded-lg transition-colors border-l border-[#A8E6E8]/20 pl-2 cursor-pointer"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            title="Download Illustration"
                            className="cyber-glow-btn p-1.5 rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-[#061923]/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between text-[#F4FBFC] z-10">
                        <h4 className="text-sm font-semibold truncate max-w-md">{title}</h4>
                        <div className="flex items-center gap-2">
                            {downloadUrl && (
                                <a
                                    href={downloadUrl}
                                    className="cyber-glow-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </a>
                            )}
                            <button
                                onClick={() => setIsLightboxOpen(false)}
                                className="cyber-oauth-btn p-2 rounded-xl transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="max-w-6xl max-h-[85vh] overflow-auto p-4 flex items-center justify-center">
                        <img
                            src={src}
                            alt={title || 'Full illustration'}
                            className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

