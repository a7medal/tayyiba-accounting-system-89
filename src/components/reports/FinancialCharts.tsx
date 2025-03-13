
import React from 'react';
import { LineChart, BarChart } from '@/components/ui/chart';
import { ChartConfig } from '@/components/ui/chart';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

export function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="card-glass rounded-xl p-6">
      <h2 className="text-xl font-medium mb-4">{title}</h2>
      <div className="mt-4 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

interface FinancialChartsProps {
  salesChartConfig: ChartConfig;
  expensesChartConfig: ChartConfig;
  profitChartConfig: ChartConfig;
}

export function FinancialCharts({ salesChartConfig, expensesChartConfig, profitChartConfig }: FinancialChartsProps) {
  return (
    <>
      <ChartContainer title="تقرير المبيعات والمصروفات">
        <LineChart {...salesChartConfig} />
      </ChartContainer>
      
      <ChartContainer title="تقرير المصروفات">
        <LineChart {...expensesChartConfig} />
      </ChartContainer>
      
      <ChartContainer title="تقرير الأرباح">
        <BarChart {...profitChartConfig} />
      </ChartContainer>
    </>
  );
}
