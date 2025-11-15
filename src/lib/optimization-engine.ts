// AI/ML Optimization Engine for SAIL Rake Formation
// Simulates advanced optimization algorithms for demo purposes
import { formatIndianNumber } from './indian-formatter';

export interface StockYard {
  id: string;
  material: string;
  quantity: number;
  costPerTon: number;
  location: string;
}

export interface Order {
  id: string;
  customer: string;
  quantity: number;
  priority: number;
  deadline: string;
  mode: 'rail' | 'road';
  product: string;
}

export interface Rake {
  id: string;
  wagons: number;
  type: string;
  available: boolean;
  location: string;
}

export interface LoadingPoint {
  id: string;
  capacity: number;
  utilization: number;
  location: string;
}

export interface Constraints {
  minRakeSize: number;
  sidingCapacity: number;
  maxLoadingTime: number;
  railCapacityLimit: number;
}

export interface InputData {
  stockyards: StockYard[];
  orders: Order[];
  rakes: Rake[];
  loadingPoints: LoadingPoint[];
  constraints: Constraints;
}

export class MockDataService {
  static getDefaultData(): InputData {
    return {
      stockyards: [
        { id: 'BSP-SY1', material: 'Steel Coils', quantity: 12500, costPerTon: 1750, location: 'BSP Plant 1' },
        { id: 'BSP-SY2', material: 'Steel Plates', quantity: 9200, costPerTon: 1850, location: 'BSP Plant 2' },
        { id: 'BSP-SY3', material: 'TMT Bars', quantity: 11800, costPerTon: 1600, location: 'BSP Plant 3' },
        { id: 'BSP-SY4', material: 'Wire Rods', quantity: 7500, costPerTon: 1900, location: 'BSP Plant 4' },
        { id: 'BSP-SY5', material: 'Steel Billets', quantity: 14200, costPerTon: 1650, location: 'BSP Plant 5' },
        { id: 'RSP-SY1', material: 'Steel Coils', quantity: 8900, costPerTon: 1800, location: 'RSP Plant 1' },
        { id: 'RSP-SY2', material: 'Steel Plates', quantity: 6800, costPerTon: 1950, location: 'RSP Plant 2' },
        { id: 'BSL-SY1', material: 'TMT Bars', quantity: 13500, costPerTon: 1550, location: 'BSL Plant 1' },
        { id: 'BSL-SY2', material: 'Steel Billets', quantity: 16700, costPerTon: 1700, location: 'BSL Plant 2' },
        { id: 'DSP-SY1', material: 'Wire Rods', quantity: 5200, costPerTon: 2000, location: 'DSP Plant 1' }
      ],
      orders: [
        { id: 'ORD-001', customer: 'CMO Delhi', quantity: 75, priority: 1, deadline: '2025-09-27', mode: 'rail', product: 'Steel Coils' },
        { id: 'ORD-002', customer: 'CMO Mumbai', quantity: 95, priority: 2, deadline: '2025-09-28', mode: 'rail', product: 'Steel Plates' },
        { id: 'ORD-003', customer: 'Tata Steel', quantity: 65, priority: 1, deadline: '2025-09-26', mode: 'rail', product: 'TMT Bars' },
        { id: 'ORD-004', customer: 'JSW Steel', quantity: 55, priority: 3, deadline: '2025-09-29', mode: 'road', product: 'Wire Rods' },
        { id: 'ORD-005', customer: 'CMO Kolkata', quantity: 90, priority: 2, deadline: '2025-09-28', mode: 'rail', product: 'Steel Billets' },
        { id: 'ORD-006', customer: 'Jindal Steel', quantity: 85, priority: 1, deadline: '2025-09-27', mode: 'rail', product: 'Steel Coils' },
        { id: 'ORD-007', customer: 'CMO Chennai', quantity: 80, priority: 2, deadline: '2025-09-29', mode: 'rail', product: 'Steel Plates' },
        { id: 'ORD-008', customer: 'Mahindra Steel', quantity: 70, priority: 1, deadline: '2025-09-26', mode: 'rail', product: 'TMT Bars' },
        { id: 'ORD-009', customer: 'CMO Hyderabad', quantity: 100, priority: 2, deadline: '2025-09-30', mode: 'rail', product: 'Steel Billets' },
        { id: 'ORD-010', customer: 'Reliance Industries', quantity: 95, priority: 1, deadline: '2025-09-28', mode: 'rail', product: 'Steel Coils' },
        { id: 'ORD-011', customer: 'L&T Construction', quantity: 50, priority: 3, deadline: '2025-10-01', mode: 'road', product: 'Wire Rods' },
        { id: 'ORD-012', customer: 'CMO Pune', quantity: 85, priority: 2, deadline: '2025-09-29', mode: 'rail', product: 'Steel Plates' }
      ],
      rakes: [
        { id: 'RAKE-001', wagons: 4, type: 'BOXN', available: true, location: 'BSP Yard 1' },
        { id: 'RAKE-002', wagons: 5, type: 'BCN', available: true, location: 'BSP Yard 1' },
        { id: 'RAKE-003', wagons: 4, type: 'BOXN', available: true, location: 'BSP Yard 2' },
        { id: 'RAKE-004', wagons: 3, type: 'BCNHL', available: true, location: 'BSP Yard 2' },
        { id: 'RAKE-005', wagons: 5, type: 'BOXN', available: true, location: 'BSP Yard 3' },
        { id: 'RAKE-006', wagons: 4, type: 'BCN', available: true, location: 'BSP Yard 3' },
        { id: 'RAKE-007', wagons: 3, type: 'BOXN', available: true, location: 'RSP Yard 1' },
        { id: 'RAKE-008', wagons: 5, type: 'BCN', available: true, location: 'RSP Yard 1' },
        { id: 'RAKE-009', wagons: 4, type: 'BOXN', available: true, location: 'BSL Yard 1' },
        { id: 'RAKE-010', wagons: 3, type: 'BCNHL', available: true, location: 'BSL Yard 1' },
        { id: 'RAKE-011', wagons: 5, type: 'BOXN', available: true, location: 'BSL Yard 2' },
        { id: 'RAKE-012', wagons: 4, type: 'BCN', available: true, location: 'DSP Yard 1' }
      ],
      loadingPoints: [
        { id: 'LP-001', capacity: 500, utilization: 65, location: 'BSP Loading Bay 1' },
        { id: 'LP-002', capacity: 400, utilization: 45, location: 'BSP Loading Bay 2' },
        { id: 'LP-003', capacity: 600, utilization: 70, location: 'BSP Loading Bay 3' },
        { id: 'LP-004', capacity: 350, utilization: 30, location: 'BSP Loading Bay 4' },
        { id: 'LP-005', capacity: 450, utilization: 55, location: 'RSP Loading Bay 1' },
        { id: 'LP-006', capacity: 550, utilization: 40, location: 'RSP Loading Bay 2' },
        { id: 'LP-007', capacity: 650, utilization: 75, location: 'BSL Loading Bay 1' },
        { id: 'LP-008', capacity: 400, utilization: 35, location: 'DSP Loading Bay 1' }
      ],
      constraints: {
        minRakeSize: 3,
        sidingCapacity: 6,
        maxLoadingTime: 4,
        railCapacityLimit: 1000
      }
    };
  }
}

export interface OptimizationParams {
  priorityWeight: number; // 1-10 scale
  costStrategy: 'aggressive' | 'balanced' | 'conservative';
  utilizationTarget: number; // 80-100%
  maxWaitTime: number; // hours
  clubbingAllowed: boolean;
}

export class OptimizationEngine {
  static optimize(data: InputData, params?: OptimizationParams) {
    const optimizationParams: OptimizationParams = {
      priorityWeight: 5,
      costStrategy: 'balanced',
      utilizationTarget: 95,
      maxWaitTime: 24,
      clubbingAllowed: true,
      ...params
    };
    
    // AI/ML Simulation: Advanced multi-objective optimization
    console.log('Running Advanced AI/ML Optimization Engine...', optimizationParams);
    
    // Step 1: Advanced multi-criteria order sorting
    const sortedOrders = [...data.orders].sort((a, b) => {
      // Multi-objective scoring: priority, deadline, quantity, cost
      const scoreA = this.calculateOrderScore(a, optimizationParams);
      const scoreB = this.calculateOrderScore(b, optimizationParams);
      return scoreB - scoreA; // Higher score = better priority
    });

    const plans: any[] = [];
    const usedRakes = new Set<string>();
    const stockyardInventory = new Map(data.stockyards.map(s => [s.id, s.quantity]));
    
    let totalCost = 0;
    const costBreakdown = { loading: 0, transport: 0, penalty: 0, idle: 0 };

    // Step 2: Advanced matching algorithm
    for (const order of sortedOrders) {
      // Skip road orders for rake optimization (handle separately)
      if (order.mode === 'road') {
        // Handle road transport differently
        const selectedStockyard = data.stockyards.find(s => 
          s.material === order.product && 
          (stockyardInventory.get(s.id) || 0) >= order.quantity
        );
        
        if (selectedStockyard) {
          const loadingCost = order.quantity * selectedStockyard.costPerTon;
          const transportCost = order.quantity * 1200; // Road transport rate per ton
          const penaltyCost = this.calculatePenalty(order.deadline);
          const planCost = loadingCost + transportCost + penaltyCost;
          
          plans.push({
            rakeId: 'TRUCK-' + order.id,
            orderId: order.id,
            source: selectedStockyard.id,
            destination: order.customer,
            clubbing: 'Road Transport',
            loadPoint: 'Road Loading Bay',
            mode: 'Road',
            cost: planCost,
            priority: order.priority,
            utilization: 100, // Trucks are fully utilized for their capacity
            status: 'Road Optimized'
          });
          
          totalCost += planCost;
          costBreakdown.transport += transportCost;
          costBreakdown.loading += loadingCost;
          costBreakdown.penalty += penaltyCost;
          
          stockyardInventory.set(selectedStockyard.id, 
            (stockyardInventory.get(selectedStockyard.id) || 0) - order.quantity);
        }
        continue;
      }

      // Rail transport logic (existing logic for rail orders only)
      const compatibleStockyards = data.stockyards.filter(s => 
        s.material === order.product && 
        (stockyardInventory.get(s.id) || 0) >= order.quantity
      ).sort((a, b) => a.costPerTon - b.costPerTon);

      if (compatibleStockyards.length === 0) continue;

      // Find available rake with optimal capacity
      const availableRakes = data.rakes.filter(r => 
        r.available && 
        !usedRakes.has(r.id) && 
        r.wagons >= data.constraints.minRakeSize
      ).sort((a, b) => b.wagons - a.wagons);

      if (availableRakes.length === 0) continue;

      const selectedStockyard = compatibleStockyards[0];
      const selectedRake = availableRakes[0];

      // Find optimal loading point
      const availableLoadingPoints = data.loadingPoints.filter(lp => 
        lp.utilization < 90
      ).sort((a, b) => a.utilization - b.utilization);

      if (availableLoadingPoints.length === 0) continue;

      const selectedLoadingPoint = availableLoadingPoints[0];

      // Calculate costs with AI/ML optimization
      const loadingCost = order.quantity * selectedStockyard.costPerTon;
      const transportCost = this.calculateTransportCost(order.quantity, order.customer);
      const penaltyCost = this.calculatePenalty(order.deadline);
      const wagonsNeeded = Math.ceil(order.quantity / 25); // 25 tons per wagon
      const utilization = Math.min(100, (wagonsNeeded / selectedRake.wagons) * 100);
      const idleCost = (selectedRake.wagons - wagonsNeeded) * 800; // Idle wagon cost per day

      const planCost = loadingCost + transportCost + penaltyCost + idleCost;
      totalCost += planCost;

      costBreakdown.loading += loadingCost;
      costBreakdown.transport += transportCost;
      costBreakdown.penalty += penaltyCost;
      costBreakdown.idle += idleCost;

      // Multi-destination clubbing logic (only for rail)
      const clubbing = order.priority === 1 && order.mode === 'rail' ? 
        'Multi-destination clubbed' : 'Single destination';

      // Mode is already validated as rail at this point
      const optimizedMode = 'Rail';

      plans.push({
        rakeId: selectedRake.id,
        orderId: order.id,
        source: selectedStockyard.id,
        destination: order.customer,
        clubbing,
        loadPoint: selectedLoadingPoint.id,
        mode: optimizedMode,
        cost: planCost,
        priority: order.priority,
        utilization: Math.round(utilization),
        status: 'Optimized'
      });

      // Update availability
      usedRakes.add(selectedRake.id);
      stockyardInventory.set(selectedStockyard.id, 
        (stockyardInventory.get(selectedStockyard.id) || 0) - order.quantity);
      selectedLoadingPoint.utilization += 20; // Simulate increased utilization
    }

    // Production suggestions using AI/ML analysis
    const totalInventory = Array.from(stockyardInventory.values()).reduce((sum, qty) => sum + qty, 0);
    const totalDemand = data.orders.reduce((sum, order) => sum + order.quantity, 0);
    const railOrders = data.orders.filter(o => o.mode === 'rail').reduce((sum, o) => sum + o.quantity, 0);
    
    let suggestions = `Production Analysis: `;
    if (totalInventory < totalDemand) {
      const shortage = totalDemand - totalInventory;
      suggestions += `Increase production by ${formatIndianNumber(shortage)} tons. `;
    }
    suggestions += `Rail orders: ${formatIndianNumber(railOrders)} tons (${((railOrders/totalDemand)*100).toFixed(1)}% of total). `;
    suggestions += `Optimize loading capabilities for ${plans.length} rake formations.`;

    const avgUtilization = plans.length > 0 ? 
      plans.reduce((sum, plan) => sum + plan.utilization, 0) / plans.length : 0;

    return {
      plan: plans,
      totalCost,
      utilization: avgUtilization,
      suggestions,
      costBreakdown,
      metrics: {
        onTimeDispatch: Math.min(100, 85 + Math.random() * 15), // Simulated metric
        rakeUtilization: avgUtilization,
        costSaving: 20 + Math.random() * 10 // Simulated 20-30% saving
      }
    };
  }

  private static calculateOrderScore(order: Order, params: OptimizationParams): number {
    // Multi-objective scoring function
    const priorityScore = (4 - order.priority) * params.priorityWeight * 10; // Higher priority = higher score
    const deadlineScore = Math.max(0, 100 - Math.ceil((new Date(order.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const quantityScore = Math.min(100, order.quantity / 1000); // Normalize by 1000 tons
    
    const costMultiplier = params.costStrategy === 'aggressive' ? 1.5 : 
                          params.costStrategy === 'conservative' ? 0.5 : 1.0;
    
    return (priorityScore + deadlineScore + quantityScore) * costMultiplier;
  }

  private static calculateTransportCost(quantity: number, destination: string): number {
    const baseRate = 800; // Transport cost per ton
    const distanceMultiplier = this.getDistanceMultiplier(destination);
    return quantity * baseRate * distanceMultiplier;
  }

  private static calculatePenalty(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return Math.abs(daysUntilDeadline) * 5000; // Late delivery penalty (proportional to order size)
    if (daysUntilDeadline < 2) return 2500; // Urgent delivery premium
    return 0;
  }

  private static getDistanceMultiplier(destination: string): number {
    const multipliers: { [key: string]: number } = {
      'CMO Delhi': 1.2,
      'CMO Mumbai': 1.5,
      'CMO Kolkata': 0.8,
      'CMO Chennai': 1.8,
      'Tata Steel': 1.0,
      'JSW Steel': 1.3,
      'Jindal Steel': 1.1
    };
    return multipliers[destination] || 1.0;
  }
}