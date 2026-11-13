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
            bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
            badge: 'bg-emerald-100 text-emerald-800',
        },
        error: {
            bg: 'bg-rose-50 border-rose-200 text-rose-900',
            icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
            badge: 'bg-rose-100 text-rose-800',
        },
        info: {
            bg: 'bg-blue-50 border-blue-200 text-blue-900',
            icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
            badge: 'bg-blue-100 text-blue-800',
        },
    }[type];

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 backdrop-blur-md ${styles.bg}`}>
                {styles.icon}
                <div className="flex-1 text-sm font-medium leading-relaxed">
                    {currentMessage}
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

