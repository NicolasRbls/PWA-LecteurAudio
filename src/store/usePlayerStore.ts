import { create } from 'zustand';
import { type Track } from '../db/db';
import { audioPlayer } from '../audio/audioPlayer';

interface PlayerState {
    currentTrack: Track | null;
    queue: Track[];
    currentIndex: number;
    isPlaying: boolean;
    playTrack: (track: Track) => Promise<void>;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setQueue: (tracks: Track[]) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentTrack: null,
    queue: [],
    currentIndex: -1,
    isPlaying: false,

    playTrack: async (track) => {
        try {
            await audioPlayer.load(track.file);
            await audioPlayer.play();

            // Generate Object URL for cover if needed/possible, but here we pass raw data or handle it.
            // audioPlayer.setMetadata handles artwork URL creation? No, it expects string.
            // We can convert Blob to URL if we want cover art in OS control center
            let coverUrl: string | undefined;
            if (track.cover) {
                coverUrl = URL.createObjectURL(track.cover);
            }

            audioPlayer.setMetadata(track.title, track.artist, track.album, coverUrl);

            set({
                currentTrack: track,
                isPlaying: true,
            });
        } catch (error) {
            console.error("Playback error:", error);
        }
    },

    togglePlay: () => {
        const { isPlaying, currentTrack } = get();
        if (!currentTrack) return;

        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        set({ isPlaying: !isPlaying });
    },

    setQueue: (tracks) => set({ queue: tracks }),

    nextTrack: () => {
        const { queue, currentIndex } = get();
        if (currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            const nextTrack = queue[nextIndex];
            set({ currentIndex: nextIndex });
            get().playTrack(nextTrack);
        }
    },

    prevTrack: () => {
        const { queue, currentIndex } = get();
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const prevTrack = queue[prevIndex];
            set({ currentIndex: prevIndex });
            get().playTrack(prevTrack);
        }
    }
}));
