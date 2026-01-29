import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { audioPlayer } from '../audio/audioPlayer';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FullPlayerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FullPlayer = ({ isOpen, onClose }: FullPlayerProps) => {
    const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = usePlayerStore();
    const [progress, setProgress] = useState(0);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    // Cover art effect
    useEffect(() => {
        if (currentTrack?.cover) {
            const url = URL.createObjectURL(currentTrack.cover);
            setCoverUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setCoverUrl(null);
    }, [currentTrack]);

    // Progress
    useEffect(() => {
        if (!isOpen || !isPlaying) return;
        const interval = setInterval(() => {
            setProgress(audioPlayer.currentTime);
        }, 100);
        return () => clearInterval(interval);
    }, [isOpen, isPlaying]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const t = Number(e.target.value);
        audioPlayer.seek(t);
        setProgress(t);
    }

    if (!currentTrack) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                        if (info.offset.y > 100) onClose();
                    }}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-3xl flex flex-col p-6 md:p-12 safe-area-pt safe-area-pb"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><path d="m6 9 6 6 6-6" /></svg>
                        </button>
                        <span className="text-xs font-semibold tracking-widest uppercase text-white/50">Now Playing</span>
                        <div className="w-10" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto w-full">
                        {/* Artwork */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="aspect-square w-full max-w-md bg-white/5 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 relative"
                        >
                            {coverUrl ? (
                                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-8xl">🎵</div>
                            )}
                        </motion.div>

                        {/* Info */}
                        <div className="text-center space-y-2 w-full">
                            <h2 className="text-3xl font-bold text-white truncate">{currentTrack.title}</h2>
                            <p className="text-xl text-white/60 font-medium truncate">{currentTrack.artist}</p>
                        </div>

                        {/* Seek */}
                        <div className="w-full space-y-2">
                            <input
                                type="range"
                                min={0}
                                max={currentTrack.duration || 100}
                                value={progress}
                                onChange={handleSeek}
                                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                            />
                            <div className="flex justify-between text-xs font-mono text-white/40">
                                <span>{formatTime(progress)}</span>
                                <span>{formatTime(currentTrack.duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-8 md:gap-12">
                            <button onClick={prevTrack} className="p-4 text-white/70 hover:text-white transition hover:scale-110 active:scale-95">
                                <SkipBack size={32} />
                            </button>
                            <button
                                onClick={togglePlay}
                                className="p-6 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition shadow-xl shadow-white/10"
                            >
                                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                            </button>
                            <button onClick={nextTrack} className="p-4 text-white/70 hover:text-white transition hover:scale-110 active:scale-95">
                                <SkipForward size={32} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

function formatTime(s: number) {
    if (!s || isNaN(s)) return "0:00";
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
