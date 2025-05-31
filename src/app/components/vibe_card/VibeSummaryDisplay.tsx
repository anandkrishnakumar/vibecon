interface VibeSummaryDisplayProps {
    summary: {
        text: string;
        color: string;
        emoji: string;
    };
}

export default function VibeSummaryDisplay({ summary }: VibeSummaryDisplayProps) {
    return (
        <div className="text-center mb-6 relative">
            {/* Emoji and text on same line */}
            <div className="flex items-center justify-center gap-3 mb-2">
                <div className="text-4xl drop-shadow-lg animate-pulse">
                    {summary.emoji}
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent tracking-wide">
                    {summary.text}
                </h2>
            </div>
            
            {/* Decorative underline */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 mx-auto rounded-full opacity-80"></div>
            
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-purple-500/5 rounded-lg blur-xl -z-10"></div>
        </div>
    );
}