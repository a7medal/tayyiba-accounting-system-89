
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "card-glass rounded-xl p-5 hover-scale",
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        {trend ? (
          <div className={cn(
            "text-xs font-medium flex items-center",
            trend.positive ? "text-green-600" : "text-red-600"
          )}>
            <span className="mr-1">
              {trend.positive ? '▲' : '▼'}
            </span>
            {Math.abs(trend.value)}%
          </div>
        ) : null}
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
