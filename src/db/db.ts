import Dexie, { type Table } from 'dexie';

export interface Track {
    id?: number;
    title: string;
    artist: string;
    album: string;
    duration: number;
    file: Blob;
    cover?: Blob;
    addedAt: number;
}

export interface Playlist {
    id?: number;
    name: string;
    trackIds: number[]; // References to Track.id
    createdAt: number;
}

export class MusicDatabase extends Dexie {
    tracks!: Table<Track, number>;
    playlists!: Table<Playlist, number>;

    constructor() {
        super('MusicDatabase');
        this.version(1).stores({
            tracks: '++id, title, artist, album, addedAt',
            playlists: '++id, name, createdAt'
        });
    }
}

export const db = new MusicDatabase();
