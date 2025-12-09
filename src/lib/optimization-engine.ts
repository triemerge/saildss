// Rake Formation Optimization Engine for SAIL
import { calculateFinalScore } from './mlEngine';

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

export interface Constraints {
  maxWagonsPerRake: number;
  maxWagonWeight: number; // tons per wagon
}

export interface WagonLoad {
  orderId: string;
  product: string;
  load: number;
  source?: string;
  destCode?: string;
  customerName?: string;
  wagonType?: string;
  deadline?: string;
}

export interface InputData {
  stockyards: StockYard[];
  orders: Order[];
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
  wagons: WagonLoad[];
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
      constraints: {
        maxWagonsPerRake: 43,
        maxWagonWeight: 64
      }
    };
  }
}

export class OptimizationEngine {
  private static readonly productWagonTypeMap = {
    'Steel Coils': ['BCN', 'BCNHL'],
    'Steel Plates': ['BOXN', 'BCN'],
    'TMT Bars': ['BOXN', 'BCNHL', 'BOST'],
    'Wire Rods': ['BOXN', 'BCN'],
    'Structural Steel': ['BOST', 'BFR'],
    'Steel Billets': ['BOXN', 'BCN', 'BCNHL'],
    'Pig Iron': ['BOXN', 'BCN'],
    'Cold Rolled Coils': ['BOXN', 'BCNHL']
  };

  private static getWagonTypeForProduct(product: string): string {
    const types = (this.productWagonTypeMap as any)[product] || ['BOXN'];
    return types[0]; // return first compatible type
  }

  static optimize(data: InputData) {
    // Create deep copies of input data to avoid mutation
    const workingStockyards = JSON.parse(JSON.stringify(data.stockyards)) as StockYard[];
    const workingOrders = JSON.parse(JSON.stringify(data.orders)) as Order[];
    const constraints = { ...data.constraints };

    console.log('Running Rake Formation Optimization...');

    // Filter only rail orders that have a valid destCode (required for rail)
    const railOrders = workingOrders.filter(o => o.mode === 'rail' && o.destCode);

    // Group orders by destination code (allow multiple products per rake)
    const orderGroups = new Map<string, Order[]>();
    for (const order of railOrders) {
      const key = `${order.destCode}`;
      if (!orderGroups.has(key)) {
        orderGroups.set(key, []);
      }
      orderGroups.get(key)!.push(order);
    }

    // Sort each group by ML final score (descending - higher score = higher priority)
    orderGroups.forEach((orders) => {
      orders.sort((a, b) => {
        const scoreA = calculateFinalScore(a).finalScore;
        const scoreB = calculateFinalScore(b).finalScore;
        return scoreB - scoreA; // Descending: higher score first
      });
    });

    // Track stockyard inventory
    const stockyardInventory = new Map<string, number>(
      workingStockyards.map(s => [s.id, s.quantity])
    );

    const plans: RakePlan[] = [];
    let rakeCounter = 1;

    // Calculate rake capacity (no predefined rakes; use constraints directly)
    const maxWagonsPerRake = constraints.maxWagonsPerRake || 43;
    const maxWagonWeight = constraints.maxWagonWeight || 64;
    const rakeCapacity = maxWagonsPerRake * maxWagonWeight;

    // Process each order group (material + destination)
    for (const [key, orders] of orderGroups) {
      const destCode = key;

      // Sort by ML final score (descending - higher score = higher priority)
      orders.sort((a, b) => {
        const scoreA = calculateFinalScore(a).finalScore;
        const scoreB = calculateFinalScore(b).finalScore;
        return scoreB - scoreA; // Descending: higher score first
      });

      // Track remaining per order
      const remainingByOrder = new Map<string, number>();
      orders.forEach(o => remainingByOrder.set(o.id, o.quantity));

      // Keep forming rakes until all orders in this destination are allocated or stock depletes
      while (orders.some(o => (remainingByOrder.get(o.id) || 0) > 0)) {
        const rakeWagons: WagonLoad[] = [];
        let totalQuantity = 0;
        const usedOrders = new Set<string>();
        const usedMaterials = new Set<string>();
        const usedStockyards = new Set<string>();

        for (let w = 0; w < maxWagonsPerRake; w++) {
          // Pick next order with remaining qty
          const nextOrder = orders.find(o => (remainingByOrder.get(o.id) || 0) > 0);
          if (!nextOrder) break;

          // Find stockyard with matching material and stock
          const stockyard = workingStockyards.find(s => 
            s.material === nextOrder.product && (stockyardInventory.get(s.id) || 0) > 0
          );

          if (!stockyard) {
            // No stock for this product; skip this order and try another
            const altOrder = orders.find(o => o.id !== nextOrder.id && (remainingByOrder.get(o.id) || 0) > 0 && workingStockyards.some(s => s.material === o.product && (stockyardInventory.get(s.id) || 0) > 0));
            if (!altOrder) break;
            // use alternate order
            const remainingAlt = remainingByOrder.get(altOrder.id) || 0;
            const stockAlt = workingStockyards.find(s => s.material === altOrder.product && (stockyardInventory.get(s.id) || 0) > 0);
            if (!stockAlt) break;
            const stockAvailableAlt = stockyardInventory.get(stockAlt.id) || 0;
            const loadAlt = Math.max(0, Math.min(maxWagonWeight, remainingAlt, stockAvailableAlt));
            if (loadAlt <= 0) break;
            rakeWagons.push({ 
              orderId: altOrder.id, 
              product: altOrder.product, 
              load: loadAlt,
              source: stockAlt.id,
              destCode,
              customerName: altOrder.customer,
              wagonType: this.getWagonTypeForProduct(altOrder.product),
              deadline: altOrder.deadline
            });
            remainingByOrder.set(altOrder.id, remainingAlt - loadAlt);
            stockyardInventory.set(stockAlt.id, stockAvailableAlt - loadAlt);
            totalQuantity += loadAlt;
            usedOrders.add(altOrder.id);
            usedMaterials.add(altOrder.product);
            usedStockyards.add(stockAlt.id);
            continue;
          }

          const remainingQty = remainingByOrder.get(nextOrder.id) || 0;
          const stockAvailable = stockyardInventory.get(stockyard.id) || 0;
          const load = Math.max(0, Math.min(maxWagonWeight, remainingQty, stockAvailable));
          if (load <= 0) break;

          rakeWagons.push({ 
            orderId: nextOrder.id, 
            product: nextOrder.product, 
            load,
            source: stockyard.id,
            destCode,
            customerName: nextOrder.customer,
            wagonType: this.getWagonTypeForProduct(nextOrder.product),
            deadline: nextOrder.deadline
          });
          remainingByOrder.set(nextOrder.id, remainingQty - load);
          stockyardInventory.set(stockyard.id, stockAvailable - load);
          totalQuantity += load;
          usedOrders.add(nextOrder.id);
          usedMaterials.add(nextOrder.product);
          usedStockyards.add(stockyard.id);
        }

        if (rakeWagons.length === 0) {
          // No allocation possible; exit to avoid infinite loop
          break;
        }

        const wagonsUsed = rakeWagons.length;
        const utilization = Math.round((totalQuantity / rakeCapacity) * 100);
        const rakeId = `Rake-${rakeCounter}`;

        plans.push({
          rakeId,
          orderIds: Array.from(usedOrders),
          source: usedStockyards.size === 1 ? Array.from(usedStockyards)[0] : 'Multiple Stockyards',
          destCode,
          material: usedMaterials.size === 1 ? Array.from(usedMaterials)[0] : 'Mixed',
          totalQuantity,
          wagonsUsed,
          totalWagons: maxWagonsPerRake,
          utilization,
          wagons: rakeWagons,
          status: 'Optimized'
        });

        rakeCounter += 1;
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
