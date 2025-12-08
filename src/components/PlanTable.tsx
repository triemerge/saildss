import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Train, Clock, TrendingUp, List, Eye } from 'lucide-react';
import { TrainVisualization } from './TrainVisualization';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WagonLoad {
  orderId: string;
  product: string;
  load: number;
}

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
  wagons: WagonLoad[];
  status: string;
}

interface PlanTableProps {
  plans: Plan[];
}

export function PlanTable({ plans }: PlanTableProps) {
  const [viewMode, setViewMode] = useState<'normal' | 'visual'>('normal');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimized': return 'bg-success text-success-foreground';
      case 'Pending': return 'bg-accent text-accent-foreground';
      case 'In Progress': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const selectedPlan = useMemo(() => {
    if (selectedPlanIndex === null) return null;
    return plans[selectedPlanIndex] || null;
  }, [plans, selectedPlanIndex]);

  const getRakeSequence = (plan: Plan | null, fallbackIndex: number) => {
    if (!plan) return fallbackIndex + 1;
    const match = plan.rakeId?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) || fallbackIndex + 1 : fallbackIndex + 1;
  };

  const getDisplayRakeId = (plan: Plan, index: number) => {
    return plan.rakeId || `Rake-${index + 1}`;
  };

  const openPlanDialog = (index: number) => {
    setSelectedPlanIndex(index);
    setDialogOpen(true);
  };

  const normalizeWagons = (plan: Plan | null) => {
    const totalWagons = 43;
    if (!plan) return new Array(totalWagons).fill({ orderId: '', product: '', load: 0 });
    const wagons: WagonLoad[] = plan.wagons || [];
    const padded = [...wagons];
    while (padded.length < totalWagons) {
      padded.push({ orderId: '', product: '', load: 0 });
    }
    return padded.slice(0, totalWagons);
  };

  const selectedWagons = useMemo(() => normalizeWagons(selectedPlan), [selectedPlan]);
  const selectedRakeSeq = useMemo(() => getRakeSequence(selectedPlan, selectedPlanIndex ?? 0), [selectedPlan, selectedPlanIndex]);

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
            {plans.map((plan, index) => {
              const displayRakeId = getDisplayRakeId(plan, index);
              return (
                <div
                  key={index}
                  className="p-4 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openPlanDialog(index)}
                >
                  <TrainVisualization 
                    wagonsUsed={plan.wagonsUsed}
                    totalWagons={plan.totalWagons}
                    rakeId={displayRakeId}
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
              );
            })}
          </div>
        </div>
      )}

      {/* Normal Table View */}
      {viewMode === 'normal' && (
        <div className="animate-slide-up">
          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-4">
            {plans.map((plan, index) => {
              const displayRakeId = getDisplayRakeId(plan, index);
              return (
                <div 
                  key={index} 
                  className="p-4 border border-border rounded-lg bg-card hover-lift cursor-pointer"
                  onClick={() => openPlanDialog(index)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Train className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary text-sm">{displayRakeId}</span>
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
              );
            })}
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
                  {plans.map((plan, index) => {
                    const displayRakeId = getDisplayRakeId(plan, index);
                    return (
                      <TableRow key={index} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => openPlanDialog(index)}>
                        <TableCell className="font-medium text-primary text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Train className="h-4 w-4" />
                            {displayRakeId}
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
                    );
                  })}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[80vh] overflow-hidden p-0">
          <div className="px-6 pt-6 pb-2">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Train className="h-5 w-5 text-primary" />
                {selectedPlan ? getDisplayRakeId(selectedPlan, selectedPlanIndex ?? 0) : 'Rake Detail'}
              </DialogTitle>
              {selectedPlan && (
                <DialogDescription className="text-xs sm:text-sm space-y-1">
                  <div className="flex flex-wrap gap-3 text-muted-foreground">
                    <span><span className="font-semibold text-foreground">Orders:</span> {selectedPlan.orderIds.join(', ')}</span>
                    <span><span className="font-semibold text-foreground">Product:</span> {selectedPlan.material}</span>
                    <span><span className="font-semibold text-foreground">Dest:</span> {selectedPlan.destCode}</span>
                    <span><span className="font-semibold text-foreground">Total Qty:</span> {selectedPlan.totalQuantity} tons</span>
                  </div>
                </DialogDescription>
              )}
            </DialogHeader>
          </div>

          {selectedPlan && (
            <div className="px-6 pb-6 space-y-3 overflow-y-auto max-h-[64vh]">
              <div className="text-xs text-muted-foreground flex items-center gap-3">
                <Badge variant="outline" className="text-[11px]">43 Wagons</Badge>
                <span>Max per wagon: 64 tons</span>
                <span>Wagons loaded: {selectedPlan.wagonsUsed}/{selectedPlan.totalWagons}</span>
              </div>
              <div className="w-full pb-3">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 min-h-[260px] pr-2">
                  {selectedWagons.map((wagon, wagonIndex) => {
                    const wagonLabel = `WR${selectedRakeSeq}-${String(wagonIndex + 1).padStart(2, '0')}`;
                    const isLoaded = wagon.load > 0;
                    return (
                      <div
                        key={wagonLabel}
                        className={`w-full rounded-lg border p-3 shadow-sm transition-all duration-200 ${isLoaded ? 'bg-primary/10 border-primary/30' : 'bg-muted/50 border-border/70'}`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground mb-1">
                          <span>{wagonLabel}</span>
                          <Badge variant={isLoaded ? 'default' : 'outline'} className="text-[10px] px-2 py-0.5">
                            {isLoaded ? 'Loaded' : 'Empty'}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground mb-1">
                          Product: <span className="text-foreground font-medium">{isLoaded ? wagon.product : '—'}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">Load: <span className="text-foreground font-semibold">{wagon.load}t</span> / 64t</div>
                        <div className="mt-1 h-2 rounded-full bg-secondary">
                          <div
                            className={`h-2 rounded-full ${isLoaded ? 'bg-success' : 'bg-muted-foreground/30'}`}
                            style={{ width: `${Math.min((wagon.load / 64) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
