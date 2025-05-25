import { BarChart } from '@mantine/charts';
import { data } from '../../../data/data';

export default function Demo() {
  return (
    <BarChart
      h={300}
      data={data}
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
    />
  );
}