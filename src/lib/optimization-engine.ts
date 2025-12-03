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
  maxWagonsPerRake: number;
  maxWagonWeight: number; // tons per wagon
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
        maxWagonsPerRake: 43,
        maxWagonWeight: 64
      }
    };
  }
}

export class OptimizationEngine {
  static optimize(data: InputData) {
    
    // Create deep copies of input data to avoid mutation
    const workingData = {
      stockyards: JSON.parse(JSON.stringify(data.stockyards)),
      orders: JSON.parse(JSON.stringify(data.orders)),
      rakes: JSON.parse(JSON.stringify(data.rakes)),
      loadingPoints: JSON.parse(JSON.stringify(data.loadingPoints)),
      constraints: { ...data.constraints }
    };
    
    // Rake filling optimization algorithm
    console.log('Running Rake Filling Optimization...');
    
    // Sort orders by priority and deadline
    const sortedOrders = [...workingData.orders].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    const plans: any[] = [];
    const usedRakes = new Set<string>();
    const stockyardInventory = new Map<string, number>(workingData.stockyards.map(s => [s.id, s.quantity]));
    const loadingPointUsage = new Map<string, number>(workingData.loadingPoints.map(lp => [lp.id, 0]));

    // Rake filling algorithm
    for (const order of sortedOrders) {
      // Only process rail orders
      if (order.mode === 'road') continue;

      // Find compatible stockyards
      const compatibleStockyards = workingData.stockyards.filter(s => 
        s.material === order.product && 
        (stockyardInventory.get(s.id) || 0) >= order.quantity
      );

      if (compatibleStockyards.length === 0) continue;

      // Find available rakes
      const availableRakes = workingData.rakes.filter(r => 
        r.available && 
        !usedRakes.has(r.id) &&
        r.wagons <= workingData.constraints.maxWagonsPerRake
      ).sort((a, b) => b.wagons - a.wagons);

      if (availableRakes.length === 0) continue;

      const selectedStockyard = compatibleStockyards[0];
      const selectedRake = availableRakes[0];

      // Find optimal loading point based on current usage
      const availableLoadingPoints = workingData.loadingPoints
        .map(lp => {
          const currentUsage = loadingPointUsage.get(lp.id) || 0;
          const currentUtilization = (currentUsage / lp.capacity) * 100;
          return { ...lp, currentUtilization };
        })
        .filter(lp => lp.currentUtilization < 90)
        .sort((a, b) => a.currentUtilization - b.currentUtilization);

      if (availableLoadingPoints.length === 0) continue;

      const selectedLoadingPoint = availableLoadingPoints[0];

      // Calculate wagon requirements and utilization
      const maxWagonCapacity = workingData.constraints.maxWagonWeight;
      const wagonsNeeded = Math.ceil(order.quantity / maxWagonCapacity);
      const actualWagons = Math.min(wagonsNeeded, selectedRake.wagons);
      const utilization = Math.round((wagonsNeeded / selectedRake.wagons) * 100);

      plans.push({
        rakeId: selectedRake.id,
        orderId: order.id,
        source: selectedStockyard.id,
        destination: order.customer,
        loadPoint: selectedLoadingPoint.id,
        mode: 'Rail',
        priority: order.priority,
        wagonsUsed: actualWagons,
        totalWagons: selectedRake.wagons,
        utilization: Math.min(100, utilization),
        status: 'Optimized'
      });

      // Update availability and track loading point usage
      usedRakes.add(selectedRake.id);
      stockyardInventory.set(selectedStockyard.id, 
        (stockyardInventory.get(selectedStockyard.id) || 0) - order.quantity);
      
      // Track actual loading point usage for accurate utilization
      loadingPointUsage.set(selectedLoadingPoint.id, 
        (loadingPointUsage.get(selectedLoadingPoint.id) || 0) + order.quantity);
    }

    // Calculate final loading point utilizations
    const finalLoadingPoints = workingData.loadingPoints.map(lp => {
      const usage = loadingPointUsage.get(lp.id) || 0;
      const calculatedUtilization = Math.round((usage / lp.capacity) * 100);
      return {
        ...lp,
        utilization: calculatedUtilization
      };
    });

    const avgUtilization = plans.length > 0 ? 
      plans.reduce((sum, plan) => sum + plan.utilization, 0) / plans.length : 0;

    return {
      plan: plans,
      utilization: avgUtilization,
      loadingPoints: finalLoadingPoints
    };
  }
}