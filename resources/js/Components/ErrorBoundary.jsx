import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex items-center justify-center p-6">
                    <div className="max-w-md w-full cyber-glass-card p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-[#F4FBFC]">Something went wrong</h3>
                        <p className="text-xs text-[#A8E6E8]/70 mt-2 mb-6">
                            An unexpected interface issue occurred. You can reload this view or return to your dashboard.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="cyber-glow-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reload Page
                            </button>
                            <a
                                href="/"
                                className="cyber-oauth-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

