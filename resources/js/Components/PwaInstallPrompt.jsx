import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Share, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIos, setIsIos] = useState(false);
    const [showIosGuide, setShowIosGuide] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        // Check if already running in standalone mode (already installed app)
        const checkStandalone = () => {
            const isStandAloneMode =
                window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true ||
                document.referrer.includes('android-app://');
            setIsStandalone(isStandAloneMode);
            return isStandAloneMode;
        };

        if (checkStandalone()) {
            return;
        }

        // Check if user dismissed prompt recently (within last 3 days)
        const dismissedTimestamp = localStorage.getItem('pwa_prompt_dismissed');
        if (dismissedTimestamp) {
            const daysSinceDismiss = (Date.now() - parseInt(dismissedTimestamp, 10)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismiss < 3) {
                setIsDismissed(true);
            }
        }

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
        const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
        setIsIos(isIosDevice && isSafari);

        // Capture PWA beforeinstallprompt on Chrome, Edge, Android, etc.
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
            // Notify other components (like navbars) that install is ready
            window.__pwaInstallPrompt = e;
            window.dispatchEvent(new CustomEvent('pwa:installable', { detail: { available: true } }));
        };

        const handleAppInstalled = () => {
            setInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
            window.__pwaInstallPrompt = null;
            window.dispatchEvent(new CustomEvent('pwa:installable', { detail: { available: false } }));
            setTimeout(() => setInstalled(false), 5000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Listen for custom trigger from navbar/sidebar buttons
        const handleManualTrigger = () => {
            if (window.__pwaInstallPrompt) {
                promptInstall(window.__pwaInstallPrompt);
            } else if (isIosDevice) {
                setShowIosGuide(true);
            }
        };
        window.addEventListener('pwa:trigger-install', handleManualTrigger);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('pwa:trigger-install', handleManualTrigger);
        };
    }, []);

    const promptInstall = async (promptEvent = deferredPrompt) => {
        if (!promptEvent) {
            if (isIos) {
                setShowIosGuide(true);
            }
            return;
        }

        try {
            promptEvent.prompt();
            const { outcome } = await promptEvent.userChoice;
            if (outcome === 'accepted') {
                setIsInstallable(false);
                setDeferredPrompt(null);
                window.__pwaInstallPrompt = null;
            } else {
                dismissPrompt();
            }
        } catch (err) {
            console.warn('PWA install prompt error:', err);
        }
    };

    const dismissPrompt = () => {
        setIsDismissed(true);
        localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    };

    // If already in standalone mode, or neither installable nor iOS, or dismissed, don't show the floating banner
    if (isStandalone) {
        return null;
    }

    return (
        <>
            {/* Installed Success Toast */}
            {installed && (
                <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <CheckCircle2 className="w-6 h-6 text-emerald-200 shrink-0" />
                    <div>
                        <p className="text-sm font-bold">App Installed Successfully!</p>
                        <p className="text-xs text-emerald-100">You can now launch CRT F&amp;B Connect from your home screen or desktop.</p>
                    </div>
                </div>
            )}

            {/* iOS Safari Installation Guide Modal */}
            {showIosGuide && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200/80 animate-in slide-in-from-bottom-6 duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-blue-500/20 shadow-xs flex items-center justify-center bg-white shrink-0">
                                    <img src="/images/icons/icon-192x192.png" alt="CRT F&B Connect" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Install on iPhone / iPad</h3>
                                    <p className="text-xs text-slate-500">CRT F&amp;B Connect App</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowIosGuide(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3.5 text-xs text-slate-600 py-2 border-y border-slate-100">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                    1
                                </div>
                                <p className="pt-1">
                                    Tap the <strong className="text-slate-900 font-semibold inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 bg-slate-100 rounded-md"><Share className="w-3.5 h-3.5 text-blue-600 inline" /> Share</strong> icon in your Safari bottom bar.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                    2
                                </div>
                                <p className="pt-1">
                                    Scroll down and tap <strong className="text-slate-900 font-semibold inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 bg-slate-100 rounded-md"><PlusSquare className="w-3.5 h-3.5 text-blue-600 inline" /> Add to Home Screen</strong>.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                    3
                                </div>
                                <p className="pt-1">
                                    Tap <strong className="text-blue-600 font-bold">Add</strong> at the top right to complete installation.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowIosGuide(false)}
                            className="mt-5 w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20"
                        >
                            Got It
                        </button>
                    </div>
                </div>
            )}

            {/* Floating App Install Banner for Mobile & Desktop */}
            {!isDismissed && (isInstallable || isIos) && (
                <aside
                    aria-label="Install CRT F&B Connect Application"
                    className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(15,23,42,0.15)] animate-in fade-in slide-in-from-bottom-5 duration-300 ring-1 ring-blue-500/15"
                >
                    <div className="flex items-start gap-3.5">
                        {/* App Icon */}
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-blue-500/30 shadow-md bg-white flex items-center justify-center">
                                <img
                                    src="/images/icons/icon-192x192.png"
                                    alt="CRT F&B Connect Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                <Sparkles className="w-2.5 h-2.5" />
                            </div>
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug truncate">
                                    Install CRT F&amp;B Connect
                                </h4>
                                <button
                                    onClick={dismissPrompt}
                                    className="p-1 -mr-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    title="Dismiss"
                                    aria-label="Dismiss install prompt"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                Install as an app on your phone, tablet, or PC for faster load times and offline access.
                            </p>

                            {/* Actions */}
                            <div className="mt-3 flex items-center gap-2">
                                <button
                                    onClick={() => promptInstall()}
                                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-sm shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Install App</span>
                                </button>
                                <button
                                    onClick={dismissPrompt}
                                    className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            )}
        </>
    );
}
