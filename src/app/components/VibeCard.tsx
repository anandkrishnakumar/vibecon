import { Card } from "@mantine/core";
import { VibeCardProps } from "../types";
import VibeSummaryDisplay from "./vibe_card/VibeSummaryDisplay";
import VibeDataDisplay from "./vibe_card/VibeDataDisplay";
import { useEffect, useState } from "react";

export default function VibeCard({ data }: VibeCardProps) {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (data) {
            setAnimationKey(prev => prev + 1);
        }
    }, [data]);

    if (!data) {
        return null; // Don't render anything if no data is available
    }

    const { vibe, summary } = data;

    return (
        <Card
            key={animationKey}
            shadow="md"
            padding="lg"
            radius="xl"
            style={{
                background: "linear-gradient(135deg, #2a2a35, #1b1b1f)",
                color: "white",
                margin: "auto",
                width: "100%",
                maxWidth: "650px",
                animation: "fadeIn 0.6s ease-in-out",
            }}
            className="mx-auto"
        >
            <VibeSummaryDisplay summary={{ ...summary, emoji: summary.emoji ?? "" }} />
            <VibeDataDisplay vibe={vibe} />
        </Card>
    );
}