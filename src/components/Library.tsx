import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Track, type Playlist } from '../db/db';
import { TrackList } from './TrackList';
import { usePlayerStore } from '../store/usePlayerStore';
import { ImportButton } from './ImportButton';

export const Library = () => {
    const [tab, setTab] = useState<'tracks' | 'playlists'>('tracks');
    const tracks = useLiveQuery(() => db.tracks.orderBy('title').toArray());
    const playlists = useLiveQuery(() => db.playlists.toArray());

    const { playTrack, currentTrack, setQueue } = usePlayerStore();

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
            // Preserve order roughly (Dexie returns sorted by index usually, we might want to respect trackIds order)
            // Sorting based on playlist.trackIds order:
            const sorted = playlist.trackIds
                .map(id => playlistTracks.find(t => t.id === id))
                .filter((t): t is Track => !!t);

            if (sorted.length) {
                setQueue(sorted);
                playTrack(sorted[0]);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const createPlaylist = async () => {
        const name = prompt("Playlist Name:");
        if (name) {
            await db.playlists.add({
                name,
                trackIds: [],
                createdAt: Date.now()
            });
        }
    }

    const addToPlaylist = async (track: Track) => {
        if (!playlists || playlists.length === 0) {
            alert("Create a playlist first!");
            return;
        }

        // Simple logic: If 1 playlist, add to it. If more, prompt.
        let targetPl = playlists[0];
        if (playlists.length > 1) {
            const names = playlists.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
            const choice = prompt(`Select Playlist:\n${names}`);
            const idx = parseInt(choice || '0') - 1;
            if (idx >= 0 && idx < playlists.length) {
                targetPl = playlists[idx];
            } else {
                return;
            }
        }

        if (targetPl && targetPl.id) {
            // Check duplicates?
            if (!targetPl.trackIds.includes(track.id!)) {
                await db.playlists.update(targetPl.id, {
                    trackIds: [...targetPl.trackIds, track.id!]
                });
                alert(`Added to ${targetPl.name}`);
            } else {
                alert("Already in playlist");
            }
        }
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => setTab('tracks')}
                        className={`text-3xl font-bold cursor-pointer transition bg-transparent border-none ${tab === 'tracks' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Tracks
                    </button>
                    <button
                        onClick={() => setTab('playlists')}
                        className={`text-3xl font-bold cursor-pointer transition bg-transparent border-none ${tab === 'playlists' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Playlists
                    </button>
                </div>
                <div className="flex space-x-2">
                    {tab === 'tracks' && <ImportButton />}
                    {tab === 'playlists' && (
                        <button onClick={createPlaylist} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full font-medium transition shadow-lg">
                            New Playlist
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-slate-800/40 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm shadow-xl min-h-[50vh]">
                {tab === 'tracks' ? (
                    tracks ? (
                        <TrackList
                            tracks={tracks}
                            onPlay={handlePlayTrack}
                            currentTrackId={currentTrack?.id}
                            onAddToPlaylist={addToPlaylist}
                        />
                    ) : (
                        <div className="p-8 text-center text-slate-500">Loading tracks...</div>
                    )
                ) : (
                    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {playlists?.map(pl => (
                            <div key={pl.id} onClick={() => handlePlayPlaylist(pl)} className="bg-slate-700/30 p-6 rounded-xl hover:bg-slate-700/60 cursor-pointer transition group border border-white/5 hover:border-indigo-500/50">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💿</div>
                                <div className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{pl.name}</div>
                                <div className="text-sm text-slate-400">{pl.trackIds.length} tracks</div>
                            </div>
                        ))}
                        {playlists?.length === 0 && (
                            <div className="col-span-full p-10 text-center text-slate-500">
                                No playlists yet. Create one!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
