import { type Track } from '../db/db';

interface TrackListProps {
    tracks: Track[];
    onPlay: (track: Track) => void;
    currentTrackId?: number;
}

export const TrackList = ({ tracks, onPlay, currentTrackId }: TrackListProps) => {
    if (tracks.length === 0) {
        return <div className="p-10 text-center text-slate-500">No tracks found. Import some music to get started!</div>
    }

    return (
        <div className="w-full pb-32">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-slate-500 border-b border-white/5 text-xs uppercase tracking-wider font-semibold">
                        <th className="p-4 w-12 text-center">#</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Artist</th>
                        <th className="p-4 hidden md:table-cell">Album</th>
                        <th className="p-4 text-right">Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track, index) => {
                        const isCurrent = track.id === currentTrackId;
                        return (
                            <tr
                                key={track.id}
                                onClick={() => onPlay(track)}
                                className={`group hover:bg-white/5 cursor-pointer transition-colors border-b border-transparent ${isCurrent ? 'text-green-400 bg-white/5' : 'text-slate-300'}`}
                            >
                                <td className="p-4 rounded-l-lg text-center text-xs group-hover:text-white">
                                    {isCurrent ? (
                                        <span className="animate-pulse">▶</span>
                                    ) : (
                                        <span className="opacity-50 group-hover:opacity-100">{index + 1}</span>
                                    )}
                                </td>
                                <td className="p-4 font-medium text-white group-hover:text-green-400 transition-colors">
                                    {track.title}
                                </td>
                                <td className="p-4 opacity-75">{track.artist}</td>
                                <td className="p-4 opacity-75 hidden md:table-cell">{track.album}</td>
                                <td className="p-4 opacity-75 text-right rounded-r-lg tabular-nums text-sm">
                                    {formatDuration(track.duration)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

function formatDuration(seconds: number) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
