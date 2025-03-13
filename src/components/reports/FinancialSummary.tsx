
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number;
  changePercentage: number;
  compareText: string;
}

export function SummaryCard({ title, value, changePercentage, compareText }: SummaryCardProps) {
  const isPositive = changePercentage >= 0;
  
  return (
    <div className="card-glass rounded-xl p-4">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="flex items-end">
        <p className="text-3xl font-bold">{value.toLocaleString()} ريال</p>
        <span className={`text-sm mr-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{changePercentage}%
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{compareText}</p>
    </div>
  );
}

interface FinancialSummaryProps {
  salesTotal: number;
  expensesTotal: number;
  profitTotal: number;
}

export function FinancialSummary({ salesTotal, expensesTotal, profitTotal }: FinancialSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard 
        title="إجمالي المبيعات"
        value={salesTotal}
        changePercentage={12.5}
        compareText="مقارنة بالفترة السابقة"
      />
      <SummaryCard 
        title="إجمالي المصروفات"
        value={expensesTotal}
        changePercentage={8.2}
        compareText="مقارنة بالفترة السابقة"
      />
      <SummaryCard 
        title="صافي الأرباح"
        value={profitTotal}
        changePercentage={15.3}
        compareText="مقارنة بالفترة السابقة"
      />
    </div>
  );
}
