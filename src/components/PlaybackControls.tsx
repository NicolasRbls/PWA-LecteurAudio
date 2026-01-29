import { usePlayerStore } from '../store/usePlayerStore';

export const PlaybackControls = () => {
    const { isPlaying, togglePlay, nextTrack, prevTrack, currentTrack } = usePlayerStore();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 p-4 pb-safe flex items-center justify-between z-50 text-white">
            {/* Track Info */}
            <div className="flex items-center w-1/3 min-w-0">
                {currentTrack ? (
                    <>
                        <div className="w-12 h-12 bg-slate-800 rounded-lg mr-3 shadow-lg flex-shrink-0 relative overflow-hidden">
                            {/* Add logic for cover art URL later */}
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-600">
                                🎵
                            </div>
                        </div>
                        <div className="min-w-0">
                            <div className="text-white font-semibold truncate leading-tight">{currentTrack.title}</div>
                            <div className="text-slate-400 text-xs truncate">{currentTrack.artist}</div>
                        </div>
                    </>
                ) : (
                    <div className="text-slate-500 text-sm pl-2">No track selected</div>
                )}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center justify-center w-1/3">
                <div className="flex items-center space-x-4 md:space-x-8 mb-2">
                    <button onClick={prevTrack} className="text-slate-400 hover:text-white transition p-2" aria-label="Previous">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/40"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>

                    <button onClick={nextTrack} className="text-slate-400 hover:text-white transition p-2" aria-label="Next">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                    </button>
                </div>
                {/* Seek Bar */}
                <Seekbar duration={currentTrack?.duration || 0} isPlaying={isPlaying} />
            </div>

            {/* Volume */}
            <div className="w-1/3 flex justify-end items-center pr-4">
                <VolumeControl />
            </div>
        </div>
    );
};

// Subcomponents locally defined for simplicity (would separate in real app)
import { useState, useEffect, useRef } from 'react';
import { audioPlayer } from '../audio/audioPlayer';

const Seekbar = ({ duration, isPlaying }: { duration: number, isPlaying: boolean }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const isDragging = useRef(false);

    useEffect(() => {
        if (!isPlaying) return;

        const frame = () => {
            if (!isDragging.current) {
                setCurrentTime(audioPlayer.currentTime);
            }
            if (isPlaying) requestAnimationFrame(frame);
        };
        const req = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(req);
    }, [isPlaying]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const t = Number(e.target.value);
        setCurrentTime(t);
    };

    const handlePointerDown = () => isDragging.current = true;
    const handlePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
        isDragging.current = false;
        audioPlayer.seek(Number(e.currentTarget.value));
    };

    return (
        <div className="w-full max-w-md flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleChange}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
            />
            <span>{formatTime(duration)}</span>
        </div>
    );
};

const VolumeControl = () => {
    const [volume, setVolume] = useState(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = Number(e.target.value);
        setVolume(v);
        audioPlayer.setVolume(v);
    };

    return (
        <div className="flex items-center space-x-2 w-24">
            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleChange}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400 hover:accent-white"
            />
        </div>
    );
};

function formatTime(s: number) {
    if (!s || isNaN(s)) return "0:00";
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
