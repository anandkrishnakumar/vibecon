import { VibeVizProps } from "../types";
import { useState, useEffect } from "react";

// Mock data
const mockData = {
    vibe: [
        { aspect: 'danceability', value: 0.5 },
        { aspect: 'energy', value: 0.7 },
        { aspect: 'speechiness', value: 0.1 },
        { aspect: 'acousticness', value: 0.3 },
        { aspect: 'instrumentalness', value: 0.2 },
        { aspect: 'valence', value: 0.6 },
        { aspect: 'tempo', value: 120 },
    ],
    summary: {
        text: '',
        color: '',
        emoji: ''
    }
};

export default function VibeSummary({ data }: VibeVizProps) {
    // Use API data if available, otherwise fall back to mock data
    const summary = data?.summary || mockData.summary;
    const [isVisible, setIsVisible] = useState(false);
    const [displayedSummary, setDisplayedSummary] = useState(summary);

    // Trigger fade-in when data changes
    useEffect(() => {
        if (JSON.stringify(summary) !== JSON.stringify(displayedSummary)) {
            // Fade out first
            setIsVisible(false);
            
            // After fade out completes, update content and fade in
            const updateTimer = setTimeout(() => {
                setDisplayedSummary(summary);
                setIsVisible(true);
            }, 500); // Wait for fade-out to complete (duration-1000)

            return () => clearTimeout(updateTimer);
        } else {
            // First time showing, just fade in
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [data, summary, displayedSummary]);

    // If mockData, don't render the chart (moved AFTER hooks)
    if (summary === mockData.summary) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center p-6">
            {/* Minimal version with slow fade-in */}
            <div className={`text-center space-y-2 transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
                {/* Large emoji with hover effect */}
                <div className="text-5xl hover:scale-110 transition-transform duration-200 cursor-default">
                    {displayedSummary.emoji}
                </div>

                {/* Modern text styling */}
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    {displayedSummary.text}
                </h2>

                {/* Subtle accent */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
        </div>
    );
}