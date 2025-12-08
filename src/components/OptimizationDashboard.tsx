import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { OptimizationEngine } from '@/lib/optimization-engine';
import { PlanTable } from './PlanTable';
import { MatrixTable } from './MatrixTable';
import { Skeleton } from '@/components/ui/skeleton';
import { StockyardDialog } from './StockyardDialog';
import { OrderDialog } from './OrderDialog';
import { RakeDialog } from './RakeDialog';
import { Zap, Train, TrendingUp, Play, Loader2, Database, Plus, Package, Users, Truck, Edit3, Trash2, RefreshCw } from 'lucide-react';
import { formatIndianNumber } from '@/lib/indian-formatter';
import { useOptimizationData } from '@/hooks/useOptimizationData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OptimizationResult {
  plan: any[];
  utilization: number;
}

export function OptimizationDashboard() {
  const { 
    data, 
    loading, 
    error, 
    refetch,
    saveStockyard,
    deleteStockyard,
    saveOrder,
    deleteOrder,
    saveRake,
    deleteRake
  } = useOptimizationData();
  
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Dialog states
  const [stockyardDialog, setStockyardDialog] = useState<{ open: boolean; stockyard?: any }>({ open: false });
  const [orderDialog, setOrderDialog] = useState<{ open: boolean; order?: any }>({ open: false });
  const [rakeDialog, setRakeDialog] = useState<{ open: boolean; rake?: any }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: string; id: string }>({ open: false, type: '', id: '' });

  const handleOptimize = async () => {
    if (!data) return;
    
    setIsOptimizing(true);
    setOptimizationResult(null);
    
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = OptimizationEngine.optimize(data);
    setOptimizationResult(result);
    setIsOptimizing(false);
  };

  // Delete confirmation handler
  const confirmDelete = async () => {
    switch (deleteDialog.type) {
      case 'stockyard':
        await deleteStockyard(deleteDialog.id);
        break;
      case 'order':
        await deleteOrder(deleteDialog.id);
        break;
      case 'rake':
        await deleteRake(deleteDialog.id);
        break;
    }
    setDeleteDialog({ open: false, type: '', id: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse"></div>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary relative" />
          </div>
          <p className="text-muted-foreground text-lg">Loading data...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-md shadow-xl border-destructive/20 bg-gradient-to-br from-card to-destructive/5">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p className="text-destructive mb-6">{error}</p>
            <Button onClick={refetch} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-x-hidden">
      {/* Header */}
      <header className="relative border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 shadow-lg backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2 sm:p-3 rounded-xl shadow-lg">
                  <Train className="h-6 sm:h-8 w-6 sm:w-8 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                  SAIL Rake Optimization DSS
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Decision Support System - BSP to CMO/Customers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refetch} className="hover-lift shadow-md">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Badge variant="secondary" className="px-2 sm:px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
                <Zap className="h-3 sm:h-4 w-3 sm:w-4 mr-1 text-green-600" />
                <span className="text-xs sm:text-sm font-medium">Live</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-full overflow-x-hidden">
        <Tabs defaultValue="optimization" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50 backdrop-blur-sm shadow-inner">
            <TabsTrigger value="optimization" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-md">
              <Zap className="h-4 w-4 mr-2" />
              Optimization Engine
            </TabsTrigger>
            <TabsTrigger value="matrix" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-md">
              <Database className="h-4 w-4 mr-2" />
              Product Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="optimization" className="space-y-6">
            <div className="grid gap-6">
              {/* Quick Actions */}
                {/* Data Input Tabs */}
              <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm animate-slide-up" style={{animationDelay: '0.1s'}}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    Input Data Management
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Add, edit, or delete stockyards, orders, rakes, and constraints. Data is stored in the backend.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="stockyards" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-2 bg-muted/30 p-2 rounded-xl">
                      <TabsTrigger value="stockyards" className="text-xs sm:text-sm px-3 py-2 rounded-md shadow-sm hover:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                        <Package className="h-3 w-3 mr-1" />
                        Stockyards
                      </TabsTrigger>
                      <TabsTrigger value="orders" className="text-xs sm:text-sm px-3 py-2 rounded-md shadow-sm hover:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                        <Users className="h-3 w-3 mr-1" />
                        Orders
                      </TabsTrigger>
                      <TabsTrigger value="rakes" className="text-xs sm:text-sm px-3 py-2 rounded-md shadow-sm hover:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                        <Train className="h-3 w-3 mr-1" />
                        Rakes
                      </TabsTrigger>
                      <TabsTrigger value="constraints" className="text-xs sm:text-sm px-3 py-2 rounded-md shadow-sm hover:shadow-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200">
                        Constraints
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="stockyards">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Stockyard Inventory ({data?.stockyards?.length || 0} Plants)
                          </h3>
                          <Button size="sm" variant="outline" onClick={() => setStockyardDialog({ open: true })} className="hover-lift shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/50">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Stockyard
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data?.stockyards?.map((stockyard, idx) => (
                            <Card key={stockyard.id} className="hover-lift card-shine shadow-md border-border/50 bg-gradient-to-br from-card to-card/80 animate-slide-up" style={{animationDelay: `${idx * 0.05}s`}}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{stockyard.id}</h4>
                                    <p className="text-xs text-muted-foreground">{stockyard.location}</p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => setStockyardDialog({ open: true, stockyard })}
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                      onClick={() => setDeleteDialog({ open: true, type: 'stockyard', id: stockyard.id })}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                  <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Material:</span>
                                    <Badge variant="secondary" className="text-xs bg-gradient-to-r from-secondary to-secondary/80">{stockyard.material}</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Quantity:</span>
                                    <span className="text-xs font-medium">{formatIndianNumber(stockyard.quantity)} tons</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="orders">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Customer Orders ({data?.orders?.length || 0} Orders)
                          </h3>
                          <Button size="sm" variant="outline" onClick={() => setOrderDialog({ open: true })} className="hover-lift shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/50">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Order
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data?.orders?.map((order, idx) => (
                            <Card key={order.id} className="hover-lift card-shine shadow-md border-border/50 bg-gradient-to-br from-card to-card/80 animate-slide-up" style={{animationDelay: `${idx * 0.05}s`}}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{order.id}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{order.customer}</p>
                                  </div>
                                  <div className="flex gap-1 flex-shrink-0">
                                    <Badge variant={order.priority === 1 ? "destructive" : order.priority === 2 ? "default" : "secondary"} className="text-xs shadow-sm">
                                      P{order.priority}
                                    </Badge>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => setOrderDialog({ open: true, order })}
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                      onClick={() => setDeleteDialog({ open: true, type: 'order', id: order.id })}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Product:</span>
                                    <span className="font-medium">{order.product}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Qty:</span>
                                    <span className="font-medium">{formatIndianNumber(order.quantity)} tons</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mode:</span>
                                    <Badge variant={order.mode === 'rail' ? 'default' : 'outline'} className="text-xs h-5">
                                      {order.mode === 'rail' ? <Train className="h-2.5 w-2.5 mr-0.5" /> : <Truck className="h-2.5 w-2.5 mr-0.5" />}
                                      {order.mode === 'rail' ? 'Rail' : 'Road'}
                                    </Badge>
                                  </div>
                                  {order.destCode && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Dest:</span>
                                      <Badge variant="outline" className="text-xs">{order.destCode}</Badge>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="rakes">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Train className="h-5 w-5 text-primary" />
                            Available Rakes ({data?.rakes?.filter((r) => r.available).length || 0}/{data?.rakes?.length || 0} Available)
                          </h3>
                          <Button size="sm" variant="outline" onClick={() => setRakeDialog({ open: true })} className="hover-lift shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/50">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Rake
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data?.rakes?.map((rake, idx) => (
                            <Card key={rake.id} className={`hover-lift card-shine shadow-md border-border/50 bg-gradient-to-br from-card to-card/80 animate-slide-up ${!rake.available ? 'opacity-60' : ''}`} style={{animationDelay: `${idx * 0.05}s`}}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{rake.id}</h4>
                                    <p className="text-xs text-muted-foreground">{rake.location}</p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Badge variant={rake.available ? "default" : "secondary"} className="text-xs shadow-sm">
                                      {rake.available ? "Available" : "In Use"}
                                    </Badge>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => setRakeDialog({ open: true, rake })}
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                      onClick={() => setDeleteDialog({ open: true, type: 'rake', id: rake.id })}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Type:</span>
                                    <Badge variant="outline" className="text-xs">{rake.type}</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Wagons:</span>
                                    <span className="text-xs font-medium">{rake.wagons} wagons</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Capacity:</span>
                                    <span className="text-xs font-medium">{formatIndianNumber(rake.capacity)} tons</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="constraints">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Rake Constraints</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Max Wagons Per Rake</label>
                            <input
                              type="number"
                              value={data?.constraints?.maxWagonsPerRake || 43}
                              disabled
                              className="w-full p-2 border rounded-md bg-muted"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Fixed at 43 wagons per rake</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Max Wagon Weight (tons)</label>
                            <input
                              type="number"
                              value={data?.constraints?.maxWagonWeight || 64}
                              disabled
                              className="w-full p-2 border rounded-md bg-muted"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Fixed at 64 tons per wagon</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Run Optimization CTA (placed after data readiness) */}
              <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border border-primary/20 shadow-xl p-6 lg:p-8 overflow-hidden relative">
                  {/* SVG Train Graphics Background */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20 pointer-events-none">
                    <svg width="500" height="200" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Locomotive */}
                      <rect x="20" y="80" width="60" height="60" rx="5" fill="currentColor" className="text-primary/40"/>
                      <circle cx="35" cy="140" r="10" fill="currentColor" className="text-primary/60"/>
                      <circle cx="55" cy="140" r="10" fill="currentColor" className="text-primary/60"/>
                      
                      {/* Wagon 1 */}
                      <rect x="85" y="90" width="50" height="50" rx="3" fill="currentColor" className="text-primary/30"/>
                      <circle cx="95" cy="145" r="8" fill="currentColor" className="text-primary/50"/>
                      <circle cx="120" cy="145" r="8" fill="currentColor" className="text-primary/50"/>
                      
                      {/* Wagon 2 */}
                      <rect x="140" y="90" width="50" height="50" rx="3" fill="currentColor" className="text-primary/30"/>
                      <circle cx="150" cy="145" r="8" fill="currentColor" className="text-primary/50"/>
                      <circle cx="175" cy="145" r="8" fill="currentColor" className="text-primary/50"/>
                      
                      {/* Wagon 3 */}
                      <rect x="195" y="90" width="50" height="50" rx="3" fill="currentColor" className="text-primary/30"/>
                      <circle cx="205" cy="145" r="8" fill="currentColor" className="text-primary/50"/>
                      <circle cx="230" cy="145" r="8" fill="currentColor" className="text-primary/50"/>
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 relative z-10">
                    <div className="space-y-4">
                      <p className="text-sm uppercase tracking-wide text-primary font-semibold">Ready to optimize</p>
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">Generate optimal rake plans with current inputs</h3>
                      <p className="text-sm text-muted-foreground max-w-xl">We will combine stockyards, orders, rakes, and constraints to build the best formation plan.</p>
                      
                      <Button 
                        onClick={handleOptimize} 
                        disabled={isOptimizing || !data} 
                        className="mt-4 h-12 px-8 text-base font-semibold relative overflow-hidden group bg-gradient-to-br from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        {isOptimizing ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Optimizing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            Run Optimization
                          </span>
                        )}
                      </Button>
                    </div>

                    {/* Train Graphic on right (visible on larger screens) */}
                    <div className="hidden lg:flex items-center justify-end pr-4">
                      <svg width="380" height="120" viewBox="0 0 380 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
                        {/* Locomotive */}
                        <rect x="10" y="50" width="50" height="50" rx="4" fill="currentColor" className="text-primary/60" fillOpacity="0.8"/>
                        <circle cx="22" cy="100" r="8" fill="currentColor" className="text-primary/80"/>
                        <circle cx="38" cy="100" r="8" fill="currentColor" className="text-primary/80"/>
                        
                        {/* Wagon 1 */}
                        <rect x="65" y="60" width="45" height="40" rx="3" fill="currentColor" className="text-primary/50" fillOpacity="0.7"/>
                        <circle cx="74" cy="100" r="7" fill="currentColor" className="text-primary/70"/>
                        <circle cx="96" cy="100" r="7" fill="currentColor" className="text-primary/70"/>
                        
                        {/* Wagon 2 */}
                        <rect x="115" y="60" width="45" height="40" rx="3" fill="currentColor" className="text-primary/50" fillOpacity="0.7"/>
                        <circle cx="124" cy="100" r="7" fill="currentColor" className="text-primary/70"/>
                        <circle cx="146" cy="100" r="7" fill="currentColor" className="text-primary/70"/>
                        
                        {/* Wagon 3 */}
                        <rect x="165" y="60" width="45" height="40" rx="3" fill="currentColor" className="text-primary/50" fillOpacity="0.7"/>
                        <circle cx="174" cy="100" r="7" fill="currentColor" className="text-primary/70"/>
                        <circle cx="196" cy="100" r="7" fill="currentColor" className="text-primary/70"/>
                        
                        {/* Wagon 4 */}
                        <rect x="215" y="60" width="45" height="40" rx="3" fill="currentColor" className="text-primary/50" fillOpacity="0.7"/>
                        <circle cx="224" cy="100" r="7" fill="currentColor" className="text-primary/70"/>
                        <circle cx="246" cy="100" r="7" fill="currentColor" className="text-primary/70"/>
                        
                        {/* Track */}
                        <line x1="10" y1="108" x2="350" y2="108" stroke="currentColor" strokeWidth="2" className="text-primary/30"/>
                        <line x1="10" y1="113" x2="350" y2="113" stroke="currentColor" strokeWidth="2" className="text-primary/30"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div ref={resultsRef}>
                {isOptimizing ? (
                  <Card className="shadow-xl border-border/50 bg-gradient-to-br from-card to-primary/5 animate-slide-up">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full"></div>
                          <Loader2 className="h-5 w-5 animate-spin text-primary relative" />
                        </div>
                        Running Optimization
                      </CardTitle>
                      <CardDescription>
                        Analyzing orders, matching materials, and generating rake plans...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Skeleton className="h-24 rounded-lg animate-pulse" />
                          <Skeleton className="h-24 rounded-lg animate-pulse" style={{animationDelay: '0.1s'}} />
                        </div>
                        <Skeleton className="h-64 rounded-lg animate-pulse" style={{animationDelay: '0.2s'}} />
                      </div>
                    </CardContent>
                  </Card>
                ) : optimizationResult ? (
                  <Card className="shadow-xl border-border/50 bg-gradient-to-br from-card to-success/5 animate-slide-up">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/10">
                              <TrendingUp className="h-5 w-5 text-success" />
                            </div>
                            Optimization Results
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Generated {optimizationResult.plan.length} rake plans with {optimizationResult.utilization}% average utilization
                          </CardDescription>
                        </div>
                        <Badge className="bg-gradient-to-r from-success to-success/80 text-success-foreground px-4 py-2 text-sm shadow-lg">
                          Success
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-md hover-lift animate-slide-up">
                          <CardContent className="p-6 text-center">
                            <div className="relative inline-block">
                              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                              <p className="text-4xl font-bold text-primary relative">{optimizationResult.plan.length}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 font-medium">Plans Generated</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 shadow-md hover-lift animate-slide-up" style={{animationDelay: '0.1s'}}>
                          <CardContent className="p-6 text-center">
                            <div className="relative inline-block">
                              <div className="absolute inset-0 bg-success/20 blur-xl rounded-full"></div>
                              <p className="text-4xl font-bold text-success relative">{optimizationResult.utilization}%</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 font-medium">Avg Rake Utilization</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Rake Plans Table */}
                      <PlanTable plans={optimizationResult.plan} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed border-2 shadow-md bg-gradient-to-br from-card to-muted/20 animate-slide-up">
                    <CardContent className="p-12 text-center">
                      <div className="relative inline-block animate-float">
                        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full"></div>
                        <Train className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50 relative" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Click "Run Optimization" to generate intelligent rake formation plans based on your current data
                      </p>
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        <span>Optimization engine ready</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="matrix">
            <MatrixTable />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <StockyardDialog
        open={stockyardDialog.open}
        onOpenChange={(open) => setStockyardDialog({ open })}
        stockyard={stockyardDialog.stockyard}
        onSave={saveStockyard}
      />
      <OrderDialog
        open={orderDialog.open}
        onOpenChange={(open) => setOrderDialog({ open })}
        order={orderDialog.order}
        onSave={saveOrder}
      />
      <RakeDialog
        open={rakeDialog.open}
        onOpenChange={(open) => setRakeDialog({ open })}
        rake={rakeDialog.rake}
        onSave={saveRake}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deleteDialog.type} "{deleteDialog.id}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
