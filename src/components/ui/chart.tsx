
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as RechartsBarChart, Bar, Legend } from 'recharts';

export interface ChartConfig {
  data: Array<{ name: string; value: number; color: string }>;
  width: number;
  height: number;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  dataKey?: string;
  nameKey?: string;
  colorKey?: string;
  margin?: { top: number; right: number; left: number; bottom: number };
  xAxisDataKey?: string;
  yAxisWidth?: number;
  lineDataKey?: string;
  lineColor?: string;
  areaColor?: string;
  barDataKey?: string;
  barColor?: string;
  showGrid?: boolean;
  tooltip?: boolean;
}

export function PieChart({ data, width, height, innerRadius = 0, outerRadius = 80, paddingAngle = 0, dataKey = "value", nameKey = "name", colorKey = "color" }: ChartConfig) {
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

export function LineChart({ data, width, height, margin = { top: 10, right: 30, left: 0, bottom: 0 }, xAxisDataKey = "name", yAxisWidth = 80, lineDataKey = "value", lineColor = "#8884d8", areaColor = "#8884d8", showGrid = true, tooltip = true }: ChartConfig) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartsLineChart
        data={data}
        margin={margin}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xAxisDataKey} />
        <YAxis width={yAxisWidth} />
        {tooltip && <Tooltip />}
        <Line 
          type="monotone" 
          dataKey={lineDataKey} 
          stroke={lineColor} 
          fill={areaColor} 
          activeDot={{ r: 8 }} 
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function BarChart({ data, width, height, margin = { top: 10, right: 30, left: 0, bottom: 0 }, xAxisDataKey = "name", yAxisWidth = 80, barDataKey = "value", barColor = "#8884d8", showGrid = true, tooltip = true }: ChartConfig) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartsBarChart
        data={data}
        margin={margin}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xAxisDataKey} />
        <YAxis width={yAxisWidth} />
        {tooltip && <Tooltip />}
        <Bar dataKey={barDataKey} fill={barColor} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
