
import React from 'react';
import { FinancialSummary } from './FinancialSummary';
import { FinancialCharts } from './FinancialCharts';
import { ChartConfig } from '@/components/ui/chart';

interface FinancialTabProps {
  salesData: Array<{ name: string; value: number; color: string }>;
  expensesData: Array<{ name: string; value: number; color: string }>;
  profitData: Array<{ name: string; value: number; color: string }>;
}

export function FinancialTab({ salesData, expensesData, profitData }: FinancialTabProps) {
  const salesTotal = salesData.reduce((acc, curr) => acc + curr.value, 0);
  const expensesTotal = expensesData.reduce((acc, curr) => acc + curr.value, 0);
  const profitTotal = profitData.reduce((acc, curr) => acc + curr.value, 0);
  
  const salesChartConfig: ChartConfig = {
    data: salesData,
    width: 700,
    height: 300,
    margin: { top: 10, right: 30, left: 30, bottom: 30 },
    xAxisDataKey: "name",
    yAxisWidth: 80,
    lineDataKey: "value",
    lineColor: "#3B82F6",
    areaColor: "#93C5FD",
    showGrid: true,
    tooltip: true,
  };

  const expensesChartConfig: ChartConfig = {
    data: expensesData,
    width: 700,
    height: 300,
    margin: { top: 10, right: 30, left: 30, bottom: 30 },
    xAxisDataKey: "name",
    yAxisWidth: 80,
    lineDataKey: "value",
    lineColor: "#F59E0B",
    areaColor: "#FCD34D",
    showGrid: true,
    tooltip: true,
  };

  const profitChartConfig: ChartConfig = {
    data: profitData,
    width: 700,
    height: 300,
    margin: { top: 10, right: 30, left: 30, bottom: 30 },
    xAxisDataKey: "name",
    yAxisWidth: 80,
    barDataKey: "value",
    barColor: "#10B981",
    showGrid: true,
    tooltip: true,
  };

  return (
    <div className="space-y-6">
      <FinancialSummary 
        salesTotal={salesTotal}
        expensesTotal={expensesTotal}
        profitTotal={profitTotal}
      />
      
      <FinancialCharts 
        salesChartConfig={salesChartConfig}
        expensesChartConfig={expensesChartConfig}
        profitChartConfig={profitChartConfig}
      />
    </div>
  );
}
