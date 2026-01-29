import { parseBlob } from 'music-metadata';

export interface ParsedMetadata {
    title: string;
    artist: string;
    album: string;
    duration: number;
    cover?: Blob;
}

export async function parseAudioFile(file: File): Promise<ParsedMetadata> {
    try {
        const metadata = await parseBlob(file);
        const { common, format } = metadata;

        let cover: Blob | undefined;
        if (common.picture && common.picture.length > 0) {
            const pic = common.picture[0];
            cover = new Blob([pic.data as unknown as BlobPart], { type: pic.format });
        }

        return {
            title: common.title || file.name.replace(/\.[^/.]+$/, ""),
            artist: common.artist || 'Unknown Artist',
            album: common.album || 'Unknown Album',
            duration: format.duration || 0,
            cover
        };
    } catch (error) {
        console.warn('Failed to parse metadata', error);
        return {
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: 'Unknown Artist',
            album: 'Unknown Album',
            duration: 0
        };
    }
}
