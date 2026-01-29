import { type Track } from '../db/db';
import { Play, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TrackListProps {
    tracks: Track[];
    onPlay: (track: Track) => void;
    currentTrackId?: number;
    onAddToPlaylist?: (track: Track) => void;
}

export const TrackList = ({ tracks, onPlay, currentTrackId, onAddToPlaylist }: TrackListProps) => {
    if (tracks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-2xl font-bold text-white">Your Library is Empty</h3>
                <p className="text-slate-400">Import some music to get started!</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-white/30 border-b border-white/5 text-xs uppercase tracking-wider font-medium">
                        <th className="p-4 w-12 text-center">#</th>
                        <th className="p-4">Title</th>
                        <th className="p-4 hidden md:table-cell">Album</th>
                        <th className="p-4 text-right">Time</th>
                        <th className="p-4 w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track, index) => {
                        const isCurrent = track.id === currentTrackId;
                        return (
                            <TrackRow
                                key={track.id}
                                track={track}
                                index={index}
                                isCurrent={isCurrent}
                                onPlay={() => onPlay(track)}
                                onAdd={() => onAddToPlaylist?.(track)}
                            />
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

const TrackRow = ({ track, index, isCurrent, onPlay, onAdd }: { track: Track, index: number, isCurrent: boolean, onPlay: () => void, onAdd: () => void }) => {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    useEffect(() => {
        if (track.cover) {
            const url = URL.createObjectURL(track.cover);
            setCoverUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [track.cover]);

    return (
        <tr
            onClick={onPlay}
            className={`group hover:bg-white/5 cursor-pointer transition-colors border-b border-transparent ${isCurrent ? 'bg-white/10' : ''}`}
        >
            <td className="p-4 text-center text-xs text-white/50">
                {isCurrent ? (
                    <span className="text-indigo-400 animate-pulse">▶</span>
                ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                )}
                {!isCurrent && <Play size={12} className="hidden group-hover:inline text-white" fill="currentColor" />}
            </td>
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                        {coverUrl ? <img src={coverUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">🎵</div>}
                    </div>
                    <div>
                        <div className={`font-medium ${isCurrent ? 'text-indigo-300' : 'text-white'} truncate max-w-[200px] md:max-w-xs`}>{track.title}</div>
                        <div className="text-xs text-white/50">{track.artist}</div>
                    </div>
                </div>
            </td>
            <td className="p-4 text-white/50 text-sm hidden md:table-cell">{track.album}</td>
            <td className="p-4 text-right text-sm text-white/50 font-mono">
                {formatDuration(track.duration)}
            </td>
            <td className="p-4 text-right">
                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(); }}
                    className="p-2 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition opacity-0 group-hover:opacity-100"
                >
                    <Plus size={16} />
                </button>
            </td>
        </tr>
    );
}

function formatDuration(seconds: number) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
