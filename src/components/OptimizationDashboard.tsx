import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { OptimizationEngine, MockDataService, OptimizationParams } from '@/lib/optimization-engine';
import { PlanTable } from './PlanTable';
import { MatrixTable } from './MatrixTable';
import { CostBreakdown } from './CostBreakdown';
import { Skeleton } from '@/components/ui/skeleton';
import { StockyardDialog } from './StockyardDialog';
import { OrderDialog } from './OrderDialog';
import { RakeDialog } from './RakeDialog';
import { LoadingPointDialog } from './LoadingPointDialog';
import { Zap, Train, TrendingUp, Clock, DollarSign, Settings, Play, Loader2, Database, Plus, Bot, Package, Users, Truck, MapPin, Edit3, Trash2, Brain, Sparkles } from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/indian-formatter';
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
  totalCost: number;
  utilization: number;
  suggestions: string;
  costBreakdown: {
    loading: number;
    transport: number;
    penalty: number;
    idle: number;
  };
  metrics: {
    onTimeDispatch: number;
    rakeUtilization: number;
    costSaving: number;
  };
}

const STORAGE_KEY = 'sail_optimization_input_data';

export function OptimizationDashboard() {
  const [inputData, setInputData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        JSON.parse(saved); // Validate it's valid JSON
        return saved;
      } catch {
        // Invalid JSON in storage, use defaults
        localStorage.removeItem(STORAGE_KEY);
        return JSON.stringify(MockDataService.getDefaultData(), null, 2);
      }
    }
    return JSON.stringify(MockDataService.getDefaultData(), null, 2);
  });
  const [parsedData, setParsedData] = useState<any>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationParams, setOptimizationParams] = useState<OptimizationParams>({
    priorityWeight: 5,
    costStrategy: 'balanced',
    utilizationTarget: 95,
    maxWaitTime: 24,
    clubbingAllowed: true
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // Dialog states
  const [stockyardDialog, setStockyardDialog] = useState<{ open: boolean; stockyard?: any }>({ open: false });
  const [orderDialog, setOrderDialog] = useState<{ open: boolean; order?: any }>({ open: false });
  const [rakeDialog, setRakeDialog] = useState<{ open: boolean; rake?: any }>({ open: false });
  const [loadingPointDialog, setLoadingPointDialog] = useState<{ open: boolean; loadingPoint?: any }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: string; id: string }>({ open: false, type: '', id: '' });

  // Parse and validate JSON whenever inputData changes
  useEffect(() => {
    try {
      const parsed = JSON.parse(inputData);
      setParsedData(parsed);
      setJsonError(null);
      localStorage.setItem(STORAGE_KEY, inputData);
    } catch (error) {
      setParsedData(null);
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  }, [inputData]);

  const handleOptimize = async () => {
    if (!parsedData) {
      return; // Don't run if JSON is invalid
    }
    
    setIsOptimizing(true);
    setOptimizationResult(null); // Clear previous results
    
    // Scroll to results immediately
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const result = OptimizationEngine.optimize(parsedData, optimizationParams);
    setOptimizationResult(result);
    setIsOptimizing(false);
  };

  const handleResetData = () => {
    const defaultData = JSON.stringify(MockDataService.getDefaultData(), null, 2);
    setInputData(defaultData);
    localStorage.setItem(STORAGE_KEY, defaultData);
  };

  // Update data helper
  const updateData = (newData: any) => {
    setInputData(JSON.stringify(newData, null, 2));
  };

  // Stockyard handlers
  const handleSaveStockyard = (stockyard: any) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    const index = newData.stockyards.findIndex((s: any) => s.id === stockyard.id);
    if (index >= 0) {
      newData.stockyards[index] = stockyard;
    } else {
      newData.stockyards.push(stockyard);
    }
    updateData(newData);
  };

  const handleDeleteStockyard = (id: string) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    newData.stockyards = newData.stockyards.filter((s: any) => s.id !== id);
    updateData(newData);
  };

  // Order handlers
  const handleSaveOrder = (order: any) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    const index = newData.orders.findIndex((o: any) => o.id === order.id);
    if (index >= 0) {
      newData.orders[index] = order;
    } else {
      newData.orders.push(order);
    }
    updateData(newData);
  };

  const handleDeleteOrder = (id: string) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    newData.orders = newData.orders.filter((o: any) => o.id !== id);
    updateData(newData);
  };

  // Rake handlers
  const handleSaveRake = (rake: any) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    const index = newData.rakes.findIndex((r: any) => r.id === rake.id);
    if (index >= 0) {
      newData.rakes[index] = rake;
    } else {
      newData.rakes.push(rake);
    }
    updateData(newData);
  };

  const handleDeleteRake = (id: string) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    newData.rakes = newData.rakes.filter((r: any) => r.id !== id);
    updateData(newData);
  };

  // Loading Point handlers
  const handleSaveLoadingPoint = (loadingPoint: any) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    const index = newData.loadingPoints.findIndex((lp: any) => lp.id === loadingPoint.id);
    if (index >= 0) {
      newData.loadingPoints[index] = loadingPoint;
    } else {
      newData.loadingPoints.push(loadingPoint);
    }
    updateData(newData);
  };

  const handleDeleteLoadingPoint = (id: string) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    newData.loadingPoints = newData.loadingPoints.filter((lp: any) => lp.id !== id);
    updateData(newData);
  };

  // Constraints handler
  const handleUpdateConstraint = (field: string, value: number) => {
    if (!parsedData) return;
    const newData = { ...parsedData };
    newData.constraints[field] = value;
    updateData(newData);
  };

  // Delete confirmation handler
  const confirmDelete = () => {
    switch (deleteDialog.type) {
      case 'stockyard':
        handleDeleteStockyard(deleteDialog.id);
        break;
      case 'order':
        handleDeleteOrder(deleteDialog.id);
        break;
      case 'rake':
        handleDeleteRake(deleteDialog.id);
        break;
      case 'loadingPoint':
        handleDeleteLoadingPoint(deleteDialog.id);
        break;
    }
    setDeleteDialog({ open: false, type: '', id: '' });
  };

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
            <Badge variant="secondary" className="px-2 sm:px-3 py-1 self-start sm:self-auto">
              <Zap className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">Demo Mode</span>
            </Badge>
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
              {/* Optimization Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Optimization Parameters
                  </CardTitle>
                  <CardDescription>
                    Configure optimization settings and constraints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority Weight: {optimizationParams.priorityWeight}</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={optimizationParams.priorityWeight}
                        onChange={(e) => setOptimizationParams(prev => ({ ...prev, priorityWeight: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground mt-1">1 = Cost Focus, 10 = Priority Focus</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Cost Strategy</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={optimizationParams.costStrategy}
                        onChange={(e) => setOptimizationParams(prev => ({ ...prev, costStrategy: e.target.value as any }))}
                      >
                        <option value="aggressive">Aggressive (Max Cost Saving)</option>
                        <option value="balanced">Balanced (Optimal Mix)</option>
                        <option value="conservative">Conservative (Risk Averse)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Utilization Target (%)</label>
                      <input
                        type="number"
                        min="80"
                        max="100"
                        value={optimizationParams.utilizationTarget}
                        onChange={(e) => setOptimizationParams(prev => ({ ...prev, utilizationTarget: parseInt(e.target.value) }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Wait Time (hrs)</label>
                      <input
                        type="number"
                        min="1"
                        max="72"
                        value={optimizationParams.maxWaitTime}
                        onChange={(e) => setOptimizationParams(prev => ({ ...prev, maxWaitTime: parseInt(e.target.value) }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <span className="font-medium">AI Configuration</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={optimizationParams.clubbingAllowed}
                            onChange={(e) => setOptimizationParams(prev => ({ ...prev, clubbingAllowed: e.target.checked }))}
                            className="rounded"
                          />
                          Allow Order Clubbing
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-4 max-w-md">
                <Button onClick={handleOptimize} disabled={isOptimizing || !parsedData} className="h-20 flex-col">
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

              {/* JSON Error Display */}
              {jsonError && (
                <Card className="border-destructive bg-destructive/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-destructive mb-1">Invalid JSON Data</h3>
                        <p className="text-sm text-destructive/80 mb-3">{jsonError}</p>
                        <Button size="sm" variant="outline" onClick={handleResetData}>
                          Reset to Default Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Data Input Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Input Data Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, or delete stockyards, orders, rakes, loading points, and constraints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="stockyards" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto gap-1">
                      <TabsTrigger value="stockyards" className="text-xs sm:text-sm px-2">Stockyards</TabsTrigger>
                      <TabsTrigger value="orders" className="text-xs sm:text-sm px-2">Orders</TabsTrigger>
                      <TabsTrigger value="rakes" className="text-xs sm:text-sm px-2">Rakes</TabsTrigger>
                      <TabsTrigger value="loadingpoints" className="text-xs sm:text-sm px-2">Loading Points</TabsTrigger>
                      <TabsTrigger value="constraints" className="text-xs sm:text-sm px-2">Constraints</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stockyards">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Stockyard Inventory ({parsedData?.stockyards?.length || 0} Plants)
                          </h3>
                          <Button size="sm" variant="outline" onClick={() => setStockyardDialog({ open: true })}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Stockyard
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {parsedData?.stockyards?.map((stockyard: any, index: number) => (
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
                                   <div className="flex justify-between">
                                     <span className="text-xs text-muted-foreground">Cost/Ton:</span>
                                     <span className="text-xs font-medium">{formatIndianCurrency(stockyard.costPerTon)}</span>
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
                            Customer Orders ({parsedData?.orders?.length || 0} Orders)
                          </h3>
                          <Button size="sm" variant="outline" onClick={() => setOrderDialog({ open: true })}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Order
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {parsedData?.orders?.map((order: any, index: number) => (
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
                            Available Rakes ({parsedData?.rakes?.filter((r: any) => r.available).length || 0}/{parsedData?.rakes?.length || 0} Available)
                          </h3>
                          <Button size="sm" variant="outline" onClick={() => setRakeDialog({ open: true })}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Rake
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {parsedData?.rakes?.map((rake: any, index: number) => (
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
                                    <span className="text-xs font-medium">~{rake.wagons * 50} tons</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="loadingpoints">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Loading Points ({parsedData?.loadingPoints?.length || 0} Points)
                          </h3>
                          <Button size="sm" variant="outline" onClick={() => setLoadingPointDialog({ open: true })}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Loading Point
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {parsedData?.loadingPoints?.map((point: any, index: number) => (
                            <Card key={point.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{point.id}</h4>
                                    <p className="text-xs text-muted-foreground">{point.location}</p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => setLoadingPointDialog({ open: true, loadingPoint: point })}
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                      onClick={() => setDeleteDialog({ open: true, type: 'loadingPoint', id: point.id })}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                   <div className="flex justify-between">
                                     <span className="text-xs text-muted-foreground">Capacity:</span>
                                     <span className="text-xs font-medium">{formatIndianNumber(point.capacity)} tons</span>
                                   </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-xs text-muted-foreground">Utilization:</span>
                                      <span className="text-xs font-medium">{point.utilization}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          point.utilization > 80 ? 'bg-destructive' : 
                                          point.utilization > 60 ? 'bg-warning' : 'bg-success'
                                        }`}
                                        style={{ width: `${point.utilization}%` }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-muted-foreground">Status:</span>
                                    <Badge variant={point.utilization > 80 ? "destructive" : point.utilization > 60 ? "default" : "secondary"} className="text-xs">
                                      {point.utilization > 80 ? "High Load" : point.utilization > 60 ? "Medium Load" : "Available"}
                                    </Badge>
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
                        <h3 className="text-lg font-medium">Optimization Constraints</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Min Rake Size</label>
                            <input
                              type="number"
                              value={parsedData?.constraints?.minRakeSize || 0}
                              onChange={(e) => handleUpdateConstraint('minRakeSize', parseInt(e.target.value))}
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Siding Capacity</label>
                            <input
                              type="number"
                              value={parsedData?.constraints?.sidingCapacity || 0}
                              onChange={(e) => handleUpdateConstraint('sidingCapacity', parseInt(e.target.value))}
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Max Loading Time (hrs)</label>
                            <input
                              type="number"
                              value={parsedData?.constraints?.maxLoadingTime || 0}
                              onChange={(e) => handleUpdateConstraint('maxLoadingTime', parseInt(e.target.value))}
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Rail Capacity Limit</label>
                            <input
                              type="number"
                              value={parsedData?.constraints?.railCapacityLimit || 0}
                              onChange={(e) => handleUpdateConstraint('railCapacityLimit', parseInt(e.target.value))}
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Loading State - AI Generation */}
              {isOptimizing && (
                <div ref={resultsRef} className="space-y-6 max-w-full overflow-x-hidden">
                  {/* AI Processing Header */}
                  <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center gap-3">
                        <Brain className="h-6 w-6 text-primary animate-pulse" />
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                            <span className="text-lg font-semibold">AI Optimization in Progress</span>
                            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Analyzing constraints and generating optimal rake formation...</p>
                        </div>
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Loading Skeletons for Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-3">
                          <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-8 w-32 mb-2" />
                          <Skeleton className="h-3 w-20" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Loading Skeleton for Table */}
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Results Section */}
              {optimizationResult && !isOptimizing && (
                <div className="space-y-6 max-w-full overflow-x-hidden">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <Card className="bg-gradient-primary text-primary-foreground">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-90">Plans Generated</p>
                            <p className="text-2xl font-bold">{optimizationResult.plan.length}</p>
                          </div>
                          <Zap className="h-8 w-8 opacity-80" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-success text-success-foreground">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-90">Utilization</p>
                            <p className="text-2xl font-bold">{optimizationResult.utilization.toFixed(1)}%</p>
                          </div>
                          <TrendingUp className="h-8 w-8 opacity-80" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-accent text-accent-foreground">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-90">Cost Saving</p>
                            <p className="text-2xl font-bold">{optimizationResult.metrics?.costSaving.toFixed(1)}%</p>
                          </div>
                          <Clock className="h-8 w-8 opacity-80" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-destructive/20 bg-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                           <div>
                             <p className="text-sm text-muted-foreground">Total Cost</p>
                             <p className="text-2xl font-bold text-foreground">{formatIndianCurrency(optimizationResult.totalCost)}</p>
                           </div>
                          <DollarSign className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cost Breakdown */}
                  <CostBreakdown costData={optimizationResult.costBreakdown} costSaving={optimizationResult.metrics.costSaving} />

                   {/* Optimization Plans */}
                  <Card className="max-w-full overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <Train className="h-5 w-5" />
                          Optimized Rake Formation Plans
                        </span>
                        <div className="flex gap-2">
                          <select className="p-2 border rounded-md text-sm w-full sm:w-auto">
                            <option>All Plans</option>
                            <option>Priority 1 Only</option>
                            <option>Rail Only</option>
                            <option>Road Only</option>
                          </select>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-w-full overflow-x-hidden">
                      <PlanTable plans={optimizationResult.plan} />
                    </CardContent>
                  </Card>

                  {/* AI Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        AI Insights & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <p className="text-sm">{optimizationResult.suggestions}</p>
                      </div>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm text-muted-foreground">On-Time Dispatch:</span>
                          <Badge variant="secondary">{optimizationResult.metrics?.onTimeDispatch.toFixed(1)}%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm text-muted-foreground">Rake Efficiency:</span>
                          <Badge variant="secondary">{optimizationResult.utilization.toFixed(1)}%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm text-muted-foreground">Predictive Analytics:</span>
                          <Badge variant="secondary">Machine Learning</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="space-y-6">
            <MatrixTable />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <StockyardDialog
        open={stockyardDialog.open}
        onOpenChange={(open) => setStockyardDialog({ open })}
        stockyard={stockyardDialog.stockyard}
        onSave={handleSaveStockyard}
      />
      <OrderDialog
        open={orderDialog.open}
        onOpenChange={(open) => setOrderDialog({ open })}
        order={orderDialog.order}
        onSave={handleSaveOrder}
      />
      <RakeDialog
        open={rakeDialog.open}
        onOpenChange={(open) => setRakeDialog({ open })}
        rake={rakeDialog.rake}
        onSave={handleSaveRake}
      />
      <LoadingPointDialog
        open={loadingPointDialog.open}
        onOpenChange={(open) => setLoadingPointDialog({ open })}
        loadingPoint={loadingPointDialog.loadingPoint}
        onSave={handleSaveLoadingPoint}
      />
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {deleteDialog.type}. This action cannot be undone.
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