import { db, type Track } from '../db/db';
import { parseAudioFile } from '../utils/fileParser';

export async function importFiles(files: File[] | FileList): Promise<number> {
    const fileArray = Array.from(files);
    const tracksToAdd: Track[] = [];

    for (const file of fileArray) {
        // Only process audio types or file with audio extensions
        // Sometimes file.type is empty or OS specific, but we check prefix or known extensions
        if (file.type && !file.type.startsWith('audio/')) {
            // Optional: allow empty type if extension is audio?
            // For now strict check + extension fallback logic if needed
            // But simpler to just trust audio/*
            // Let's just create logic:
        }

        // Basic check, might need refinement
        if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
            continue;
        }

        const metadata = await parseAudioFile(file);

        tracksToAdd.push({
            title: metadata.title,
            artist: metadata.artist,
            album: metadata.album,
            duration: metadata.duration,
            cover: metadata.cover,
            file: file,
            addedAt: Date.now()
        });
    }

    if (tracksToAdd.length > 0) {
        await db.tracks.bulkAdd(tracksToAdd);
    }

    return tracksToAdd.length;
}
