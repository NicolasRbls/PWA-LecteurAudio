import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlayerStore } from './usePlayerStore';
import { audioPlayer } from '../audio/audioPlayer';
import { type Track } from '../db/db';

// Mock audioPlayer
vi.mock('../audio/audioPlayer', () => ({
    audioPlayer: {
        load: vi.fn(),
        play: vi.fn(),
        pause: vi.fn(),
        seek: vi.fn(),
        setMetadata: vi.fn(),
        setVolume: vi.fn()
    }
}));

describe('usePlayerStore', () => {
    beforeEach(() => {
        usePlayerStore.setState({
            currentTrack: null,
            isPlaying: false,
            queue: [],
            currentIndex: -1
        });
        vi.clearAllMocks();
    });

    it('should set current track and play', async () => {
        const track = { id: 1, title: 'T', artist: 'A', album: 'Alb', duration: 100, addedAt: 0, file: new Blob() } as Track;
        const { result } = renderHook(() => usePlayerStore());

        await act(async () => {
            await result.current.playTrack(track);
        });

        expect(result.current.currentTrack).toEqual(track);
        expect(result.current.isPlaying).toBe(true);
        expect(audioPlayer.load).toHaveBeenCalled();
        expect(audioPlayer.play).toHaveBeenCalled();
    });

    it('should pause playback', () => {
        const { result } = renderHook(() => usePlayerStore());
        // Set initial state
        usePlayerStore.setState({
            isPlaying: true,
            currentTrack: { id: 1 } as Track
        });

        act(() => {
            result.current.togglePlay();
        });

        expect(result.current.isPlaying).toBe(false);
        expect(audioPlayer.pause).toHaveBeenCalled();
    });
});
