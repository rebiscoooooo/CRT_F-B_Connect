import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setCurrentMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setCurrentMessage(flash.error);
            setType('error');
            setVisible(true);
        } else if (flash?.info) {
            setCurrentMessage(flash.info);
            setType('info');
            setVisible(true);
        }
    }, [flash]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [visible, currentMessage]);

    if (!visible || !currentMessage) return null;

    const styles = {
        success: {
            bg: 'bg-[#0A3D4F]/90 border-emerald-400/40 text-[#F4FBFC]',
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
        },
        error: {
            bg: 'bg-[#0A3D4F]/90 border-rose-400/40 text-[#F4FBFC]',
            icon: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
        },
        info: {
            bg: 'bg-[#0A3D4F]/90 border-[#2EC4D6]/40 text-[#F4FBFC]',
            icon: <Info className="w-5 h-5 text-[#2EC4D6] flex-shrink-0" />,
        },
    }[type];

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className={`p-4 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-xl ${styles.bg}`}>
                {styles.icon}
                <div className="flex-1 text-sm font-medium leading-relaxed text-[#F4FBFC]">
                    {currentMessage}
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="text-[#A8E6E8]/60 hover:text-[#F4FBFC] transition-colors p-1 -mr-1 -mt-1 rounded-lg"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

