import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { Play, Pause, SkipForward } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MiniPlayerProps {
    onExpand: () => void;
}

export const MiniPlayer = ({ onExpand }: MiniPlayerProps) => {
    const { currentTrack, isPlaying, togglePlay, nextTrack } = usePlayerStore();
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    useEffect(() => {
        if (currentTrack?.cover) {
            const url = URL.createObjectURL(currentTrack.cover);
            setCoverUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setCoverUrl(null);
    }, [currentTrack]);

    if (!currentTrack) return null;

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl z-40 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl overflow-hidden flex items-center justify-between cursor-pointer hover:bg-white/15 transition-colors"
            onClick={onExpand}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 relative overflow-hidden">
                    {coverUrl ? (
                        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover animate-[spin_10s_linear_infinite]" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">🎵</div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{currentTrack.title}</p>
                    <p className="text-white/60 text-xs truncate">{currentTrack.artist}</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="p-3 text-white hover:bg-white/10 rounded-full transition"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); nextTrack(); }}
                    className="p-3 text-white hover:bg-white/10 rounded-full transition"
                >
                    <SkipForward size={20} />
                </button>
            </div>
        </motion.div>
    );
};
