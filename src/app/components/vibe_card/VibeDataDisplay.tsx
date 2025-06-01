interface VibeDataDisplayProps {
    vibe: {
        danceability: number;
        energy: number;
        speechiness: number;
        acousticness: number;
        instrumentalness: number;
        valence: number;
        tempo?: number;
    };
}

interface VibeDataDisplayProps {
    vibe: {
        danceability: number;
        energy: number;
        speechiness: number;
        acousticness: number;
        instrumentalness: number;
        valence: number;
        tempo?: number;
    };
}

export default function VibeDataDisplay({ vibe }: VibeDataDisplayProps) {
    const vibeItems = [
        { emoji: '🕺', label: 'danceability', value: Math.round(vibe.danceability * 100) },
        { emoji: '🔋', label: 'energy', value: Math.round(vibe.energy * 100) },
        { emoji: '🗣️', label: 'speechiness', value: Math.round(vibe.speechiness * 100) },
        { emoji: '🌲', label: 'acousticness', value: Math.round(vibe.acousticness * 100) },
        { emoji: '🎻', label: 'instrumentalness', value: Math.round(vibe.instrumentalness * 100) },
        { emoji: '😊', label: 'valence', value: Math.round(vibe.valence * 100) },
    ];

    return (
        <div className="grid grid-cols-6 gap-6">
            {vibeItems.map((item) => (
                <div key={item.label} className="flex flex-col items-center p-3 rounded-lg bg-purple-900/20 border border-purple-800/30">
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="text-xs text-gray-300 mb-2 capitalize">{item.label}</span>
                    <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-gray-700"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-purple-400"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={`${item.value}, 100`}
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-300">{item.value}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}