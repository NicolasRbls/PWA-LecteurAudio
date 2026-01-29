import { describe, it, expect, vi } from 'vitest';
import { parseAudioFile } from './fileParser';
import * as musicMetadata from 'music-metadata';

// Mock the module
vi.mock('music-metadata', () => ({
    parseBlob: vi.fn()
}));

describe('parseAudioFile', () => {
    it('should extract metadata from file', async () => {
        const mockFile = new File([''], 'test.mp3', { type: 'audio/mp3' });
        const mockMetadata = {
            common: {
                title: 'Test Title',
                artist: 'Test Artist',
                album: 'Test Album',
                picture: [{ data: new Uint8Array([1, 2, 3]), format: 'image/jpeg' }]
            },
            format: {
                duration: 200
            }
        };

        // Cast mocked function
        (musicMetadata.parseBlob as any).mockResolvedValue(mockMetadata);

        const result = await parseAudioFile(mockFile);

        expect(result.title).toBe('Test Title');
        expect(result.artist).toBe('Test Artist');
        expect(result.duration).toBe(200);
        expect(result.cover).toBeDefined();
        expect(result.cover?.type).toBe('image/jpeg');
    });

    it('should handle missing metadata', async () => {
        const mockFile = new File([''], 'unknown.mp3', { type: 'audio/mp3' });
        (musicMetadata.parseBlob as any).mockResolvedValue({ common: {}, format: {} });

        const result = await parseAudioFile(mockFile);
        expect(result.title).toBe('unknown'); // Fallback to filename base
        expect(result.artist).toBe('Unknown Artist');
        expect(result.duration).toBe(0);
    });
});
