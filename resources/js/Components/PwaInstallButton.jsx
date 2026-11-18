import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

export default function PwaInstallButton({
    className = '',
    text = 'Install App',
    iconOnly = false,
    variant = 'outline', // 'outline' | 'primary' | 'ghost'
}) {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Detect standalone
        const standalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
        setIsStandalone(standalone);

        // Detect if prompt is available or iOS device
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;

        if (window.__pwaInstallPrompt || isIos) {
            setIsInstallable(true);
        }

        const handleInstallable = (e) => {
            setIsInstallable(e.detail?.available || false);
        };

        window.addEventListener('pwa:installable', handleInstallable);
        return () => window.removeEventListener('pwa:installable', handleInstallable);
    }, []);

    if (isStandalone || !isInstallable) {
        return null;
    }

    const triggerInstall = () => {
        window.dispatchEvent(new CustomEvent('pwa:trigger-install'));
    };

    const variantClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20',
        outline: 'bg-white/80 hover:bg-white text-blue-600 border border-blue-200/80 shadow-2xs hover:border-blue-400',
        ghost: 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60',
    };

    return (
        <button
            type="button"
            onClick={triggerInstall}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${variantClasses[variant] || variantClasses.outline} ${className}`}
            title="Install CRT F&B Connect on your device"
            aria-label="Install App"
        >
            <Download className="w-3.5 h-3.5" />
            {!iconOnly && <span>{text}</span>}
        </button>
    );
}
