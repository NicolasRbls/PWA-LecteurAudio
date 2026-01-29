import { describe, it, expect, beforeEach } from 'vitest';
import { db, Track } from './db';
import 'fake-indexeddb/auto';

describe('MusicDatabase', () => {
    beforeEach(async () => {
        await db.delete();
        await db.open();
    });

    it('should add and retrieve a track', async () => {
        const newTrack: Omit<Track, 'id'> = {
            title: 'Test Song',
            artist: 'Test Artist',
            album: 'Test Album',
            duration: 120,
            file: new Blob(['dummy content'], { type: 'audio/mp3' }),
            addedAt: Date.now(),
        };

        const id = await db.tracks.add(newTrack as Track);
        const retrievedTrack = await db.tracks.get(id);

        expect(retrievedTrack).toBeDefined();
        expect(retrievedTrack?.title).toBe('Test Song');
        expect(retrievedTrack?.artist).toBe('Test Artist');
    });

    it('should create and retrieve a playlist', async () => {
        const playlistId = await db.playlists.add({
            name: 'My Playlist',
            trackIds: [],
            createdAt: Date.now(),
        });

        const playlist = await db.playlists.get(playlistId);
        expect(playlist).toBeDefined();
        expect(playlist?.name).toBe('My Playlist');
        expect(playlist?.trackIds).toEqual([]);
    });
});
