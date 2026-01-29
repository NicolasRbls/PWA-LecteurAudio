export class AudioPlayer {
    private audio: HTMLAudioElement;

    constructor() {
        this.audio = new Audio();
    }

    async load(source: Blob | string) {
        if (this.audio.src) {
            URL.revokeObjectURL(this.audio.src);
        }

        if (typeof source === 'string') {
            this.audio.src = source;
        } else {
            this.audio.src = URL.createObjectURL(source);
        }
    }

    async play() {
        return this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    seek(time: number) {
        this.audio.currentTime = time;
    }

    setVolume(value: number) {
        this.audio.volume = value;
    }

    get currentTime() {
        return this.audio.currentTime;
    }

    get duration() {
        return this.audio.duration;
    }

    get paused() {
        return this.audio.paused;
    }

    setMetadata(title: string, artist: string, album: string, artwork?: string) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title,
                artist,
                album,
                artwork: artwork ? [{ src: artwork, sizes: '512x512', type: 'image/png' }] : []
            });
        }
    }
}

export const audioPlayer = new AudioPlayer();
