import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, FastForward } from 'lucide-react';

export default function VideoPlayer({ src, title, poster }) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // Check if external youtube or standard url
    const isYouTube = src && (src.includes('youtube.com') || src.includes('youtu.be'));

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0` : url;
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (videoRef.current) {
            videoRef.current.volume = val;
            videoRef.current.muted = val === 0;
            setIsMuted(val === 0);
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        if (isMuted) {
            videoRef.current.muted = false;
            videoRef.current.volume = volume || 1;
            setIsMuted(false);
        } else {
            videoRef.current.muted = true;
            setIsMuted(true);
        }
    };

    const handleSpeedChange = (rate) => {
        setPlaybackRate(rate);
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => console.error(err));
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isYouTube) {
        return (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#061923] shadow-2xl border border-[#A8E6E8]/20">
                <iframe
                    src={getYouTubeEmbedUrl(src)}
                    title={title || 'Video lesson'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="group relative w-full aspect-video rounded-2xl overflow-hidden bg-[#061923] shadow-2xl border border-[#A8E6E8]/20 select-none"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Play Button Overlay (when paused) */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-[#061923]/50 backdrop-blur-xs cursor-pointer transition-opacity"
                    onClick={togglePlay}
                >
                    <div className="p-5 rounded-full bg-gradient-to-br from-[#0B6E8A] to-[#2EC4D6] text-[#F4FBFC] shadow-xl shadow-[#2EC4D6]/30 hover:scale-110 transition-all duration-200 border border-[#A8E6E8]/30">
                        <Play className="w-10 h-10 translate-x-0.5 fill-current" />
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div
                className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#061923]/95 via-[#061923]/75 to-transparent p-4 transition-all duration-300 ${
                    showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
            >
                {/* Progress Bar */}
                <div className="flex items-center gap-3 mb-3">
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-[#0A3D4F] rounded-lg appearance-none cursor-pointer accent-[#2EC4D6] hover:h-2 transition-all"
                    />
                </div>

                <div className="flex items-center justify-between gap-4 text-white">
                    {/* Left Controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={togglePlay}
                            className="p-1.5 rounded-lg hover:bg-[#0B6E8A]/30 transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        <div className="flex items-center gap-2 group/vol">
                            <button
                                onClick={toggleMute}
                                className="p-1.5 rounded-lg hover:bg-[#0B6E8A]/30 transition-colors"
                                aria-label="Toggle mute"
                            >
                                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-16 h-1 bg-[#0A3D4F] rounded-lg appearance-none cursor-pointer accent-[#2EC4D6] hidden sm:block"
                            />
                        </div>

                        <span className="text-xs text-[#A8E6E8]/70 font-mono tracking-tight">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                        {/* Speed selector */}
                        <div className="flex items-center bg-[#0A3D4F]/30 rounded-lg p-0.5 text-xs font-semibold border border-[#A8E6E8]/10">
                            {[1, 1.25, 1.5, 2].map((rate) => (
                                <button
                                    key={rate}
                                    onClick={() => handleSpeedChange(rate)}
                                    className={`px-2 py-0.5 rounded-md transition-colors ${
                                        playbackRate === rate ? 'cyber-glow-btn text-[#F4FBFC]' : 'text-[#A8E6E8]/70 hover:text-[#F4FBFC] hover:bg-[#0B6E8A]/30'
                                    }`}
                                >
                                    {rate}x
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={toggleFullscreen}
                            className="p-1.5 rounded-lg hover:bg-[#0B6E8A]/30 transition-colors"
                            aria-label="Toggle Fullscreen"
                        >
                            <Maximize className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

