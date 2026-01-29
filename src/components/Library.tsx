import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Track } from '../db/db';
import { TrackList } from './TrackList';
import { usePlayerStore } from '../store/usePlayerStore';
import { ImportButton } from './ImportButton';

export const Library = () => {
    const tracks = useLiveQuery(() => db.tracks.toArray());
    const { playTrack, currentTrack, setQueue } = usePlayerStore();

    const handlePlay = (track: Track) => {
        if (tracks) setQueue(tracks);
        playTrack(track);
    }

    if (!tracks) return (
        <div className="flex items-center justify-center h-64 text-slate-500">
            Loading library...
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Library</h1>
                <ImportButton />
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm shadow-xl">
                <TrackList
                    tracks={tracks}
                    onPlay={handlePlay}
                    currentTrackId={currentTrack?.id}
                />
            </div>
        </div>
    );
};
