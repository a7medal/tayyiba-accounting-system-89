
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export interface ChartConfig {
  data: Array<{ name: string; value: number; color: string }>;
  width: number;
  height: number;
  innerRadius: number;
  outerRadius: number;
  paddingAngle: number;
  dataKey: string;
  nameKey: string;
  colorKey: string;
}

export function PieChart({ data, width, height, innerRadius, outerRadius, paddingAngle, dataKey, nameKey, colorKey }: ChartConfig) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          dataKey={dataKey}
          nameKey={nameKey}
          label={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry[colorKey as keyof typeof entry] as string} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
