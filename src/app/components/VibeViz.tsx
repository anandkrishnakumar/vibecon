import { BarChart } from '@mantine/charts';

// Mock data - will be replaced with API call later
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
  text: 'sleepy',
  color: 'blue'
};

// Types
import type { VibeVizProps } from "../types";

export default function VibeViz({ data }: VibeVizProps) {
  // Use API data if available, otherwise fall back to mock data
  const chartData = data?.vibe || mockData.vibe;


  // Remove tempo from the chart data
  const filteredData = chartData.filter(item => item.aspect !== 'tempo');

  // If mockData, don't render the chart
  if (chartData === mockData.vibe) {
    return null;
  }
  // Render the bar chart with the filtered data
  return (
    <BarChart
      h={300}
      data={filteredData}
      dataKey="aspect"
      type="stacked"
      orientation="vertical"
      yAxisProps={{ width: 130 }}
      series={[
        { name: 'value', color: 'violet.6' },
      ]}
      gridAxis="none"
      withXAxis={true}
      withYAxis={true}
      withTooltip={false}
    // barProps={{maxBarSize:18 }}
    />
  );
}
