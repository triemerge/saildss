import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Train, Clock, TrendingUp, List, Eye } from 'lucide-react';
import { TrainVisualization } from './TrainVisualization';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Plan {
  rakeId: string;
  orderIds: string[];
  source: string;
  destCode: string;
  material: string;
  totalQuantity: number;
  wagonsUsed: number;
  totalWagons: number;
  utilization: number;
  status: string;
}

interface PlanTableProps {
  plans: Plan[];
}

export function PlanTable({ plans }: PlanTableProps) {
  const [viewMode, setViewMode] = useState<'normal' | 'visual'>('normal');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimized': return 'bg-success text-success-foreground';
      case 'Pending': return 'bg-accent text-accent-foreground';
      case 'In Progress': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Train className="h-5 w-5 text-primary" />
          Rake Formations
        </h3>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'normal' | 'visual')} className="w-auto">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
            <TabsTrigger value="normal" className="text-xs sm:text-sm px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
              <List className="h-4 w-4 mr-2" />
              Normal View
            </TabsTrigger>
            <TabsTrigger value="visual" className="text-xs sm:text-sm px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
              <Eye className="h-4 w-4 mr-2" />
              Visual View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Visual Train Plans */}
      {viewMode === 'visual' && (
        <div className="space-y-4 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plans.map((plan, index) => (
              <div key={index} className="p-4 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
                <TrainVisualization 
                  wagonsUsed={plan.wagonsUsed}
                  totalWagons={plan.totalWagons}
                  rakeId={plan.rakeId}
                />
                <div className="mt-4 space-y-1 text-xs border-t border-border/30 pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orders:</span>
                    <span className="font-medium">{plan.orderIds.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium">{plan.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{plan.totalQuantity} tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destination:</span>
                    <Badge variant="outline" className="text-xs">{plan.destCode}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={`${getStatusColor(plan.status)} text-xs`}>{plan.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Normal Table View */}
      {viewMode === 'normal' && (
        <div className="animate-slide-up">
          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-4">
            {plans.map((plan, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-card hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Train className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary text-sm">{plan.rakeId}</span>
                  </div>
                  <Badge className="text-xs">{plan.destCode}</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orders:</span>
                    <span className="font-medium">{plan.orderIds.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium">{plan.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{plan.totalQuantity} tons</span>
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
                          style={{ width: `${Math.min(plan.utilization, 100)}%` }}
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
                    <TableHead className="font-semibold min-w-[150px]">Order IDs</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Source</TableHead>
                    <TableHead className="font-semibold min-w-[80px]">Dest Code</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Material</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Quantity</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Wagons</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Utilization</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan, index) => (
                    <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-primary text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <Train className="h-4 w-4" />
                          {plan.rakeId}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{plan.orderIds.join(', ')}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{plan.source}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{plan.destCode}</Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{plan.material}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{plan.totalQuantity} tons</TableCell>
                      <TableCell className="text-xs sm:text-sm">{plan.wagonsUsed}/{plan.totalWagons}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary rounded-full h-2 min-w-[60px]">
                            <div 
                              className="bg-success h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(plan.utilization, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-10">{plan.utilization}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
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
        </div>
      )}
      
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
            Total quantity loaded: {plans.reduce((sum, plan) => sum + plan.totalQuantity, 0)} tons.
            Total wagons used: {plans.reduce((sum, plan) => sum + plan.wagonsUsed, 0)}.
          </div>
        </div>
      )}
    </div>
  );
}
