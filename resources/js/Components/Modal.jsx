import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({
    isOpen,
    show,
    onClose,
    title,
    children,
    footer,
    maxWidth = 'max-w-lg',
}) {
    const isVisible = Boolean(isOpen !== undefined ? isOpen : show);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isVisible) {
                onClose();
            }
        };

        if (isVisible) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible, onClose]);

    if (!isVisible || !mounted || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop: covers entire viewport, including sidebar and navbar */}
            <div 
                className="fixed inset-0 bg-[#061923]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200" 
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog Card */}
            <div className={`relative w-full ${maxWidth} cyber-glass-card rounded-2xl sm:rounded-3xl shadow-2xl border border-[#A8E6E8]/25 overflow-hidden transform transition-all z-10 animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col`}>
                {title && (
                    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#A8E6E8]/15 bg-[#0A3D4F]/40 shrink-0">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#F4FBFC] truncate pr-2">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-[#A8E6E8]/60 hover:text-[#F4FBFC] hover:bg-[#0B6E8A]/30 transition-colors shrink-0 cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
                    {children}
                </div>
                {footer && (
                    <div className="px-5 sm:px-6 py-3.5 border-t border-[#A8E6E8]/15 bg-[#0A3D4F]/30 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

