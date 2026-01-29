import { render, screen, fireEvent } from '@testing-library/react';
import { PlaybackControls } from './PlaybackControls';
import { usePlayerStore } from '../store/usePlayerStore';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../store/usePlayerStore');

describe('PlaybackControls', () => {
    it('should call togglePlay when play button clicked', () => {
        const togglePlay = vi.fn();
        // Mock selector return
        (usePlayerStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: any) => {
            // If selector is passed, we might need to handle it.
            // But usually for simple mocks we return the whole state or specific slice.
            // Zustand hooks usually: usePlayerStore(state => state.foo)
            const state = {
                isPlaying: false,
                togglePlay,
                nextTrack: vi.fn(),
                prevTrack: vi.fn(),
                currentTrack: { title: 'T', artist: 'A' },
            };
            return selector ? selector(state) : state;
        });

        render(<PlaybackControls />);
        // Assuming aria-label="Play"
        fireEvent.click(screen.getByLabelText(/play/i));
        expect(togglePlay).toHaveBeenCalled();
    });

    it('should show pause icon when playing', () => {
        (usePlayerStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: any) => {
            const state = {
                isPlaying: true,
                togglePlay: vi.fn(),
                nextTrack: vi.fn(),
                prevTrack: vi.fn(),
                currentTrack: { title: 'T', artist: 'A' },
            };
            return selector ? selector(state) : state;
        });

        render(<PlaybackControls />);
        expect(screen.getByLabelText(/pause/i)).toBeInTheDocument();
    });
});
