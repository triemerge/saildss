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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">Error loading data: {error}</p>
            <Button onClick={refetch}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Train className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-foreground">SAIL Rake Optimization DSS</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">AI/ML Decision Support System - BSP to CMO/Customers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Badge variant="secondary" className="px-2 sm:px-3 py-1">
                <Zap className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                <span className="text-xs sm:text-sm">Live</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-full overflow-x-hidden">
        <Tabs defaultValue="optimization" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="optimization" className="text-xs sm:text-sm">Optimization Engine</TabsTrigger>
            <TabsTrigger value="matrix" className="text-xs sm:text-sm">Product Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="optimization" className="space-y-6">
            <div className="grid gap-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-4 max-w-md">
                <Button onClick={handleOptimize} disabled={isOptimizing || !data} className="h-20 flex-col">
                  {isOptimizing ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin mb-2" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Play className="h-6 w-6 mb-2" />
                      Run Optimization
                    </>
                  )}
                </Button>
              </div>

              {/* Data Input Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Input Data Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, or delete stockyards, orders, rakes, and constraints. Data is stored in the backend.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="stockyards" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
                      <TabsTrigger value="stockyards" className="text-xs sm:text-sm px-2">Stockyards</TabsTrigger>
                      <TabsTrigger value="orders" className="text-xs sm:text-sm px-2">Orders</TabsTrigger>
                      <TabsTrigger value="rakes" className="text-xs sm:text-sm px-2">Rakes</TabsTrigger>
                      <TabsTrigger value="constraints" className="text-xs sm:text-sm px-2">Constraints</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stockyards">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Stockyard Inventory ({data?.stockyards?.length || 0} Plants)
                          </h3>
                          <Button size="sm" variant="outline" onClick={() => setStockyardDialog({ open: true })}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Stockyard
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data?.stockyards?.map((stockyard) => (
                            <Card key={stockyard.id} className="hover:shadow-md transition-shadow">
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
                                    <Badge variant="secondary" className="text-xs">{stockyard.material}</Badge>
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
                          <Button size="sm" variant="outline" onClick={() => setOrderDialog({ open: true })}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Order
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {data?.orders?.map((order) => (
                            <Card key={order.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{order.id}</h4>
                                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Badge variant={order.priority === 1 ? "destructive" : order.priority === 2 ? "default" : "secondary"} className="text-xs">
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
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Product:</span>
                                    <span className="text-xs font-medium">{order.product}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Quantity:</span>
                                    <span className="text-xs font-medium">{formatIndianNumber(order.quantity)} tons</span>
                                  </div>
                                  {order.mode === 'rail' && order.destCode && (
                                    <div className="flex justify-between">
                                      <span className="text-xs text-muted-foreground">Dest Code:</span>
                                      <Badge variant="outline" className="text-xs">{order.destCode}</Badge>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Mode:</span>
                                    <Badge variant={order.mode === 'rail' ? 'default' : 'outline'} className="text-xs">
                                      {order.mode === 'rail' ? <Train className="h-3 w-3 mr-1" /> : <Truck className="h-3 w-3 mr-1" />}
                                      {order.mode.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Deadline:</span>
                                    <span className="text-xs font-medium">{new Date(order.deadline).toLocaleDateString()}</span>
                                  </div>
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
                          <Button size="sm" variant="outline" onClick={() => setRakeDialog({ open: true })}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Rake
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data?.rakes?.map((rake) => (
                            <Card key={rake.id} className={`hover:shadow-md transition-shadow ${!rake.available ? 'opacity-60' : ''}`}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{rake.id}</h4>
                                    <p className="text-xs text-muted-foreground">{rake.location}</p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Badge variant={rake.available ? "default" : "secondary"} className="text-xs">
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

              {/* Results Section */}
              <div ref={resultsRef}>
                {isOptimizing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Running Optimization
                      </CardTitle>
                      <CardDescription>
                        Analyzing orders, matching materials, and generating rake plans...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Skeleton className="h-24 rounded-lg" />
                          <Skeleton className="h-24 rounded-lg" />
                        </div>
                        <Skeleton className="h-64 rounded-lg" />
                      </div>
                    </CardContent>
                  </Card>
                ) : optimizationResult ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Optimization Results
                      </CardTitle>
                      <CardDescription>
                        Generated {optimizationResult.plan.length} rake plans
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-muted/50">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-primary">{optimizationResult.plan.length}</p>
                            <p className="text-sm text-muted-foreground">Plans Generated</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/50">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-primary">{optimizationResult.utilization}%</p>
                            <p className="text-sm text-muted-foreground">Avg Rake Utilization</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Rake Plans Table */}
                      <PlanTable plans={optimizationResult.plan} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                      <Train className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Click "Run Optimization" to generate rake formation plans
                      </p>
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
