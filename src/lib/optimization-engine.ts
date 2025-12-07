// Rake Formation Optimization Engine for SAIL

export interface StockYard {
  id: string;
  material: string;
  quantity: number;
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
  destCode?: string; // Required for rail, not needed for road
}

export interface Rake {
  id: string;
  wagons: number;
  capacity: number; // total capacity in tons
  type: string;
  available: boolean;
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
  constraints: Constraints;
}

export interface RakePlan {
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

export class MockDataService {
  static getDefaultData(): InputData {
    return {
      stockyards: [
        { id: 'BSP-SY1', material: 'Steel Coils', quantity: 12500, location: 'BSP Plant 1' },
        { id: 'BSP-SY2', material: 'Steel Plates', quantity: 9200, location: 'BSP Plant 2' },
        { id: 'BSP-SY3', material: 'TMT Bars', quantity: 11800, location: 'BSP Plant 3' },
        { id: 'BSP-SY4', material: 'Wire Rods', quantity: 7500, location: 'BSP Plant 4' },
        { id: 'BSP-SY5', material: 'Steel Billets', quantity: 14200, location: 'BSP Plant 5' },
        { id: 'RSP-SY1', material: 'Steel Coils', quantity: 8900, location: 'RSP Plant 1' },
        { id: 'RSP-SY2', material: 'Steel Plates', quantity: 6800, location: 'RSP Plant 2' },
        { id: 'BSL-SY1', material: 'TMT Bars', quantity: 13500, location: 'BSL Plant 1' },
        { id: 'BSL-SY2', material: 'Steel Billets', quantity: 16700, location: 'BSL Plant 2' },
        { id: 'DSP-SY1', material: 'Wire Rods', quantity: 5200, location: 'DSP Plant 1' }
      ],
      orders: [
        { id: 'ORD-001', customer: 'CMO Delhi', quantity: 1500, priority: 1, deadline: '2025-09-27', mode: 'rail', product: 'Steel Coils', destCode: 'DEL' },
        { id: 'ORD-002', customer: 'CMO Mumbai', quantity: 1800, priority: 2, deadline: '2025-09-28', mode: 'rail', product: 'Steel Plates', destCode: 'BOM' },
        { id: 'ORD-003', customer: 'Tata Steel Jamshedpur', quantity: 1200, priority: 1, deadline: '2025-09-26', mode: 'rail', product: 'TMT Bars', destCode: 'JAM' },
        { id: 'ORD-004', customer: 'JSW Steel Bellary', quantity: 800, priority: 3, deadline: '2025-09-29', mode: 'road', product: 'Wire Rods' },
        { id: 'ORD-005', customer: 'CMO Kolkata', quantity: 2000, priority: 2, deadline: '2025-09-28', mode: 'rail', product: 'Steel Billets', destCode: 'KOL' },
        { id: 'ORD-006', customer: 'Jindal Steel Delhi', quantity: 1300, priority: 1, deadline: '2025-09-27', mode: 'rail', product: 'Steel Coils', destCode: 'DEL' },
        { id: 'ORD-007', customer: 'CMO Chennai', quantity: 1600, priority: 2, deadline: '2025-09-29', mode: 'rail', product: 'Steel Plates', destCode: 'MAS' },
        { id: 'ORD-008', customer: 'Mahindra Steel Jamshedpur', quantity: 1400, priority: 1, deadline: '2025-09-26', mode: 'rail', product: 'TMT Bars', destCode: 'JAM' },
        { id: 'ORD-009', customer: 'CMO Hyderabad', quantity: 1900, priority: 2, deadline: '2025-09-30', mode: 'rail', product: 'Steel Billets', destCode: 'HYD' },
        { id: 'ORD-010', customer: 'Reliance Industries Mumbai', quantity: 1700, priority: 1, deadline: '2025-09-28', mode: 'rail', product: 'Steel Coils', destCode: 'BOM' },
        { id: 'ORD-011', customer: 'L&T Construction Kolkata', quantity: 900, priority: 3, deadline: '2025-10-01', mode: 'road', product: 'Wire Rods' },
        { id: 'ORD-012', customer: 'CMO Pune', quantity: 1500, priority: 2, deadline: '2025-09-29', mode: 'rail', product: 'Steel Plates', destCode: 'PUN' }
      ],
      rakes: [
        { id: 'RAKE-001', wagons: 43, capacity: 2752, type: 'BOXN', available: true, location: 'BSP Yard 1' },
        { id: 'RAKE-002', wagons: 43, capacity: 2752, type: 'BCN', available: true, location: 'BSP Yard 1' },
        { id: 'RAKE-003', wagons: 43, capacity: 2752, type: 'BOXN', available: true, location: 'BSP Yard 2' },
        { id: 'RAKE-004', wagons: 43, capacity: 2752, type: 'BCNHL', available: true, location: 'BSP Yard 2' },
        { id: 'RAKE-005', wagons: 43, capacity: 2752, type: 'BOXN', available: true, location: 'BSP Yard 3' },
        { id: 'RAKE-006', wagons: 43, capacity: 2752, type: 'BCN', available: true, location: 'RSP Yard 1' },
        { id: 'RAKE-007', wagons: 43, capacity: 2752, type: 'BOXN', available: true, location: 'RSP Yard 1' },
        { id: 'RAKE-008', wagons: 43, capacity: 2752, type: 'BCN', available: true, location: 'BSL Yard 1' },
        { id: 'RAKE-009', wagons: 43, capacity: 2752, type: 'BOXN', available: true, location: 'BSL Yard 1' },
        { id: 'RAKE-010', wagons: 43, capacity: 2752, type: 'BCN', available: true, location: 'DSP Yard 1' }
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
    const workingStockyards = JSON.parse(JSON.stringify(data.stockyards)) as StockYard[];
    const workingOrders = JSON.parse(JSON.stringify(data.orders)) as Order[];
    const workingRakes = JSON.parse(JSON.stringify(data.rakes)) as Rake[];
    const constraints = { ...data.constraints };

    console.log('Running Rake Formation Optimization...');

    // Filter only rail orders that have a valid destCode (required for rail)
    const railOrders = workingOrders.filter(o => o.mode === 'rail' && o.destCode);

    // Group orders by material AND destination code for clubbing
    const orderGroups = new Map<string, Order[]>();
    for (const order of railOrders) {
      const key = `${order.product}|${order.destCode}`;
      if (!orderGroups.has(key)) {
        orderGroups.set(key, []);
      }
      orderGroups.get(key)!.push(order);
    }

    // Sort each group by priority and deadline
    orderGroups.forEach((orders) => {
      orders.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    });

    // Track stockyard inventory
    const stockyardInventory = new Map<string, number>(
      workingStockyards.map(s => [s.id, s.quantity])
    );

    // Track used rakes
    const usedRakes = new Set<string>();
    const plans: RakePlan[] = [];

    // Calculate rake capacity
    const rakeCapacity = constraints.maxWagonsPerRake * constraints.maxWagonWeight; // 43 * 64 = 2752 tons

    // Process each order group (material + destination)
    for (const [key, orders] of orderGroups) {
      const [material, destCode] = key.split('|');

      // Find stockyards with matching material
      const compatibleStockyards = workingStockyards.filter(s => 
        s.material === material && (stockyardInventory.get(s.id) || 0) > 0
      );

      if (compatibleStockyards.length === 0) continue;

      // Calculate total quantity needed for this group
      let remainingQuantity = orders.reduce((sum, o) => sum + o.quantity, 0);
      const orderIds = orders.map(o => o.id);

      // Fill rakes until all quantity is allocated
      while (remainingQuantity > 0) {
        // Find available rake
        const availableRake = workingRakes.find(r => 
          r.available && !usedRakes.has(r.id)
        );

        if (!availableRake) break;

        // Find stockyard with enough material
        const stockyard = compatibleStockyards.find(s => 
          (stockyardInventory.get(s.id) || 0) > 0
        );

        if (!stockyard) break;

        const availableStock = stockyardInventory.get(stockyard.id) || 0;

        // Calculate how much to load on this rake
        const quantityToLoad = Math.min(remainingQuantity, rakeCapacity, availableStock);
        
        // Calculate wagons used based on quantity loaded
        const wagonsUsed = Math.ceil(quantityToLoad / constraints.maxWagonWeight);
        const utilization = Math.round((quantityToLoad / rakeCapacity) * 100);

        plans.push({
          rakeId: availableRake.id,
          orderIds: [...orderIds],
          source: stockyard.id,
          destCode: destCode,
          material: material,
          totalQuantity: quantityToLoad,
          wagonsUsed: wagonsUsed,
          totalWagons: availableRake.wagons,
          utilization: utilization,
          status: 'Optimized'
        });

        // Update tracking
        usedRakes.add(availableRake.id);
        stockyardInventory.set(stockyard.id, availableStock - quantityToLoad);
        remainingQuantity -= quantityToLoad;
      }
    }

    const avgUtilization = plans.length > 0 
      ? plans.reduce((sum, plan) => sum + plan.utilization, 0) / plans.length 
      : 0;

    return {
      plan: plans,
      utilization: Math.round(avgUtilization)
    };
  }
}
