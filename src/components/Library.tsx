import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Track, type Playlist } from '../db/db';
import { TrackList } from './TrackList';
import { usePlayerStore } from '../store/usePlayerStore';
import { ImportButton } from './ImportButton';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const Library = () => {
    const [tab, setTab] = useState<'tracks' | 'playlists'>('tracks');
    const tracks = useLiveQuery(() => db.tracks.orderBy('title').toArray());
    const playlists = useLiveQuery(() => db.playlists.toArray());

    const { playTrack, currentTrack, setQueue } = usePlayerStore();

    // ... (Handlers same as before, simplified for this snippet but crucial to keep)
    // We will just copy the handlers from previous version or re-implement if replacing whole file.
    // Wait, replacing line 1-99 replaces the whole file top. I need to keep handlers.
    // I should use a strategy to keep handlers or rewrite them.
    // I will rewrite them to be safe.

    const handlePlayTrack = (track: Track) => {
        if (tracks && tab === 'tracks') setQueue(tracks);
        playTrack(track);
    }

    const handlePlayPlaylist = async (playlist: Playlist) => {
        if (!playlist.trackIds.length) {
            alert("Playlist is empty!");
            return;
        }
        try {
            const playlistTracks = await db.tracks.where('id').anyOf(playlist.trackIds).toArray();
            const sorted = playlist.trackIds
                .map(id => playlistTracks.find(t => t.id === id))
                .filter((t): t is Track => !!t);

            if (sorted.length) {
                setQueue(sorted);
                playTrack(sorted[0]);
            }
        } catch (e) { console.error(e); }
    }

    const createPlaylist = async () => {
        const name = prompt("Playlist Name:");
        if (name) {
            await db.playlists.add({ name, trackIds: [], createdAt: Date.now() });
        }
    }

    const addToPlaylist = async (track: Track) => {
        if (!playlists?.length) { alert("Create a playlist first!"); return; }

        let targetPl = playlists[0];
        if (playlists.length > 1) {
            const names = playlists.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
            const choice = prompt(`Select Playlist:\n${names}`);
            const idx = parseInt(choice || '0') - 1;
            if (idx >= 0 && idx < playlists.length) targetPl = playlists[idx];
            else return;
        }

        if (targetPl?.id && !targetPl.trackIds.includes(track.id!)) {
            await db.playlists.update(targetPl.id, { trackIds: [...targetPl.trackIds, track.id!] });
            alert(`Added to ${targetPl.name}`);
        }
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
                <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-full flex relative">
                    {['tracks', 'playlists'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={cn(
                                "relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10 capitalize",
                                tab === t ? "text-white" : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            {tab === t && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm border border-white/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {tab === 'tracks' && <ImportButton />}
                    {tab === 'playlists' && (
                        <button
                            onClick={createPlaylist}
                            className="bg-indigo-500/80 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full font-medium transition shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] backdrop-blur-md border border-white/10 flex items-center"
                        >
                            <span className="mr-2 text-lg">+</span> New Playlist
                        </button>
                    )}
                </div>
            </header>

            <motion.div
                layout
                className="bg-black/20 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-xl shadow-2xl min-h-[60vh]"
            >
                {tab === 'tracks' ? (
                    tracks ? (
                        <TrackList
                            tracks={tracks}
                            onPlay={handlePlayTrack}
                            currentTrackId={currentTrack?.id}
                            onAddToPlaylist={addToPlaylist}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )
                ) : (
                    <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {playlists?.map(pl => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={pl.id}
                                onClick={() => handlePlayPlaylist(pl)}
                                className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl cursor-pointer transition-all group border border-white/5 hover:border-white/10 hover:shadow-xl aspect-square flex flex-col justify-between relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg">▶</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-5xl group-hover:scale-110 transition-transform duration-500 origin-bottom-left">💿</div>
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-white group-hover:text-indigo-200 transition-colors truncate">{pl.name}</div>
                                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{pl.trackIds.length} tracks</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
