
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ArrowDownToLine } from 'lucide-react';

interface ReportFilterProps {
  reportPeriod: string;
  setReportPeriod: (period: string) => void;
}

export function ReportFilter({ reportPeriod, setReportPeriod }: ReportFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <select 
        value={reportPeriod}
        onChange={(e) => setReportPeriod(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
      >
        <option value="month">الشهر الحالي</option>
        <option value="3months">آخر 3 أشهر</option>
        <option value="6months">آخر 6 أشهر</option>
        <option value="year">السنة الحالية</option>
      </select>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Filter className="h-4 w-4" />
        تصفية
      </Button>
      <Button size="sm" className="flex items-center gap-1">
        <ArrowDownToLine className="h-4 w-4" />
        تصدير
      </Button>
    </div>
  );
}
