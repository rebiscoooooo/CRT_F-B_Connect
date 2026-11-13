import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, show, onClose, title, children, maxWidth = 'max-w-lg' }) {
    const isVisible = Boolean(isOpen !== undefined ? isOpen : show);

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

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />

            {/* Modal Dialog Card */}
            <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all z-10 animate-in fade-in zoom-in-95 duration-200 my-8`}>
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

