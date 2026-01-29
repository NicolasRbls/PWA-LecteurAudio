import { describe, it, expect, vi, beforeEach } from 'vitest';
import { importFiles } from './importService';
import { db } from '../db/db';
import * as fileParser from '../utils/fileParser';

// Mock DB
vi.mock('../db/db', () => ({
    db: {
        tracks: {
            bulkAdd: vi.fn().mockResolvedValue(true)
        }
    }
}));

// Mock Parser
vi.mock('../utils/fileParser', () => ({
    parseAudioFile: vi.fn()
}));

describe('importFiles', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should parse and save files to database', async () => {
        const file1 = new File([''], 'song1.mp3', { type: 'audio/mp3' });
        const mockMetadata = {
            title: 'Song 1',
            artist: 'Artist 1',
            album: 'Album 1',
            duration: 100,
            cover: undefined
        };

        vi.mocked(fileParser.parseAudioFile).mockResolvedValue(mockMetadata);

        const count = await importFiles([file1]);

        expect(count).toBe(1);
        expect(fileParser.parseAudioFile).toHaveBeenCalledWith(file1);
        expect(db.tracks.bulkAdd).toHaveBeenCalledWith([
            expect.objectContaining({
                title: 'Song 1',
                artist: 'Artist 1',
                file: file1,
                addedAt: expect.any(Number)
            })
        ]);
    });
});
