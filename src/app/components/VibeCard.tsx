import { Card } from "@mantine/core";
import { VibeCardProps } from "../types";
import VibeSummaryDisplay from "./vibe_card/VibeSummaryDisplay";
import VibeDataDisplay from "./vibe_card/VibeDataDisplay";

export default function VibeCard({ data }: VibeCardProps) {
    if (!data) {
        return null; // Don't render anything if no data is available
    }

    const { vibe, summary } = data;

    return (
        <Card
            shadow="md"
            padding="lg"
            radius="xl"
            style={{
                background: "linear-gradient(135deg, #2a2a35, #1b1b1f)",
                color: "white",
                margin: "auto",
                width: "300px",
                maxWidth: "500px",
            }}
            className="mx-auto"
        >
            <VibeSummaryDisplay summary={{ ...summary, emoji: summary.emoji ?? "" }} />
            <VibeDataDisplay vibe={vibe} />
        </Card>
    );
}