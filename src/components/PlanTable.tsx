import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Train, MapPin, Clock, TrendingUp } from 'lucide-react';


interface Plan {
  rakeId: string;
  orderId: string;
  source: string;
  destination: string;
  loadPoint: string;
  mode: string;
  priority: number;
  wagonsUsed: number;
  totalWagons: number;
  utilization: number;
  status: string;
}

interface PlanTableProps {
  plans: Plan[];
}

export function PlanTable({ plans }: PlanTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimized': return 'bg-success text-success-foreground';
      case 'Pending': return 'bg-accent text-accent-foreground';
      case 'In Progress': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getModeIcon = (mode: string) => {
    return mode === 'Rail' ? <Train className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Mobile Card Layout */}
      <div className="block sm:hidden space-y-4">
          {plans.map((plan, index) => (
            <div key={index} className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary text-sm">{plan.rakeId}</span>
                  <Badge variant={plan.priority === 1 ? 'destructive' : plan.priority === 2 ? 'default' : 'secondary'} className="text-xs">
                    P{plan.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {getModeIcon(plan.mode)}
                  <span className="text-xs">{plan.mode}</span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order:</span>
                  <span className="font-medium">{plan.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wagons:</span>
                  <span className="font-medium">{plan.wagonsUsed}/{plan.totalWagons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Utilization:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${plan.utilization}%` }}
                      />
                    </div>
                    <span className="w-8 text-xs">{plan.utilization}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block rounded-lg border overflow-hidden max-w-full">
        <div className="overflow-x-auto max-w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold min-w-[100px]">Rake ID</TableHead>
                  <TableHead className="font-semibold min-w-[100px]">Order ID</TableHead>
                  <TableHead className="font-semibold min-w-[100px] hidden sm:table-cell">Source</TableHead>
                  <TableHead className="font-semibold min-w-[100px] hidden sm:table-cell">Destination</TableHead>
                  <TableHead className="font-semibold min-w-[100px] hidden lg:table-cell">Load Point</TableHead>
                  <TableHead className="font-semibold min-w-[80px]">Priority</TableHead>
                  <TableHead className="font-semibold min-w-[100px] hidden md:table-cell">Wagons</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Utilization</TableHead>
                  <TableHead className="font-semibold min-w-[100px] hidden sm:table-cell">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan, index) => (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-primary text-xs sm:text-sm">{plan.rakeId}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{plan.orderId}</TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{plan.source}</TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{plan.destination}</TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{plan.loadPoint}</TableCell>
                    <TableCell>
                      <Badge variant={plan.priority === 1 ? 'destructive' : plan.priority === 2 ? 'default' : 'secondary'} className="text-xs">
                        P{plan.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden md:table-cell">{plan.wagonsUsed}/{plan.totalWagons}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-2 min-w-[60px]">
                          <div 
                            className="bg-success h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${plan.utilization}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10">{plan.utilization}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={`${getStatusColor(plan.status)} text-xs`}>
                        {plan.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {plans.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No optimization results yet. Run the optimization to generate rake formation plans.</p>
          </div>
        )}

        {plans.length > 0 && (
          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="font-semibold text-success">Optimization Summary</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Generated {plans.length} rake formations with average utilization of{' '}
              {plans.length > 0 ? (plans.reduce((sum, plan) => sum + plan.utilization, 0) / plans.length).toFixed(1) : 0}%.
              Total wagons used: {plans.reduce((sum, plan) => sum + plan.wagonsUsed, 0)}.
            </div>
          </div>
        )}
    </div>
  );
}