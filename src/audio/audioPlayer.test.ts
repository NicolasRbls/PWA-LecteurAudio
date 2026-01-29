import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioPlayer } from './audioPlayer';

describe('AudioPlayer', () => {
    let player: AudioPlayer;
    let mockAudio: any;

    beforeEach(() => {
        // Mock HTMLAudioElement
        mockAudio = {
            play: vi.fn().mockResolvedValue(undefined),
            pause: vi.fn(),
            currentTime: 0,
            duration: 100,
            src: '',
            volume: 1,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            setAttribute: vi.fn(),
        };

        // Mock generic global Audio constructor
        vi.stubGlobal('Audio', class {
            constructor() {
                return mockAudio;
            }
        });

        // Mock MediaSession
        if (!('mediaSession' in navigator)) {
            Object.defineProperty(navigator, 'mediaSession', {
                value: {
                    metadata: null,
                    setActionHandler: vi.fn(),
                },
                writable: true
            });
        }

        player = new AudioPlayer();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should load and play a track', async () => {
        const file = new Blob([''], { type: 'audio/mp3' });
        const trackUrl = 'blob:url';
        URL.createObjectURL = vi.fn(() => trackUrl);

        await player.load(file);
        await player.play();

        expect(mockAudio.src).toBe(trackUrl);
        expect(mockAudio.play).toHaveBeenCalled();
    });

    it('should pause', () => {
        player.pause();
        expect(mockAudio.pause).toHaveBeenCalled();
    });

    it('should seek', () => {
        player.seek(10);
        expect(mockAudio.currentTime).toBe(10);
    });

    it('should set volume', () => {
        player.setVolume(0.5);
        expect(mockAudio.volume).toBe(0.5);
    });
});
