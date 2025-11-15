import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/indian-formatter';

interface CostData {
  loading: number;
  transport: number;
  penalty: number;
  idle: number;
}

interface CostBreakdownProps {
  costData: CostData;
  costSaving?: number;
}

export function CostBreakdown({ costData, costSaving = 0 }: CostBreakdownProps) {
  const totalCost = costData.loading + costData.transport + costData.penalty + costData.idle;
  
  const costItems = [
    {
      label: 'Loading Costs',
      amount: costData.loading,
      percentage: (costData.loading / totalCost * 100).toFixed(1),
      color: 'bg-primary',
      description: 'Material handling and loading operations'
    },
    {
      label: 'Transport Costs',
      amount: costData.transport,
      percentage: (costData.transport / totalCost * 100).toFixed(1),
      color: 'bg-accent',
      description: 'Railway freight and fuel charges'
    },
    {
      label: 'Penalty/Delay',
      amount: costData.penalty,
      percentage: (costData.penalty / totalCost * 100).toFixed(1),
      color: 'bg-destructive',
      description: 'Demurrage and delay penalties'
    },
    {
      label: 'Idle Freight',
      amount: costData.idle,
      percentage: (costData.idle / totalCost * 100).toFixed(1),
      color: 'bg-muted-foreground',
      description: 'Unutilized capacity costs'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Cost Breakdown Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Cost */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">Total Optimized Cost</span>
               <div className="text-right">
                 <span className="text-2xl font-bold text-primary">{formatIndianCurrency(totalCost)}</span>
                <div className="flex items-center gap-1 text-success text-sm">
                  <TrendingDown className="h-3 w-3" />
                  {costSaving.toFixed(1)}% saved vs manual
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-3">
            {costItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                 <div className="text-right">
                   <span className="font-semibold">{formatIndianCurrency(item.amount)}</span>
                  <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Distribution Bar */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Cost Distribution</span>
            <div className="flex h-3 rounded-full overflow-hidden bg-secondary">
              {costItems.map((item, index) => (
                <div
                  key={index}
                  className={item.color}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.label}: ${item.percentage}%`}
                />
              ))}
            </div>
          </div>

          {/* Optimization Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">Cost Savings</span>
              </div>
              <p className="text-xs text-muted-foreground">Penalty reduction through better planning</p>
            </div>
            
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Efficiency</span>
              </div>
              <p className="text-xs text-muted-foreground">Optimized loading and utilization</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}