import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  destCode?: string;
}

export interface Rake {
  id: string;
  wagons: number;
  capacity: number;
  type: string;
  available: boolean;
  location: string;
}

export interface Constraints {
  maxWagonsPerRake: number;
  maxWagonWeight: number;
}

export interface OptimizationData {
  stockyards: StockYard[];
  orders: Order[];
  rakes: Rake[];
  constraints: Constraints;
}

export function useOptimizationData() {
  const [data, setData] = useState<OptimizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [stockyardsRes, ordersRes, rakesRes] = await Promise.all([
        supabase.from('stockyards').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('rakes').select('*')
      ]);

      if (stockyardsRes.error) throw stockyardsRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (rakesRes.error) throw rakesRes.error;

      // Transform database format to app format
      const stockyards: StockYard[] = stockyardsRes.data.map(s => ({
        id: s.id,
        material: s.material,
        quantity: s.quantity,
        location: s.location
      }));

      const orders: Order[] = ordersRes.data.map(o => ({
        id: o.id,
        customer: o.customer,
        quantity: o.quantity,
        priority: o.priority,
        deadline: o.deadline,
        mode: o.mode as 'rail' | 'road',
        product: o.product,
        destCode: o.dest_code || undefined
      }));

      const rakes: Rake[] = rakesRes.data.map(r => ({
        id: r.id,
        wagons: r.wagons,
        capacity: r.capacity,
        type: r.type,
        available: r.available,
        location: r.location
      }));

      setData({
        stockyards,
        orders,
        rakes,
        constraints: {
          maxWagonsPerRake: 43,
          maxWagonWeight: 64
        }
      });
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Stockyard operations
  const saveStockyard = async (stockyard: StockYard) => {
    try {
      const { error } = await supabase
        .from('stockyards')
        .upsert({
          id: stockyard.id,
          material: stockyard.material,
          quantity: stockyard.quantity,
          location: stockyard.location
        });
      
      if (error) throw error;
      await fetchData();
      toast.success('Stockyard saved');
    } catch (err: any) {
      console.error('Error saving stockyard:', err);
      toast.error('Failed to save stockyard');
    }
  };

  const deleteStockyard = async (id: string) => {
    try {
      const { error } = await supabase.from('stockyards').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
      toast.success('Stockyard deleted');
    } catch (err: any) {
      console.error('Error deleting stockyard:', err);
      toast.error('Failed to delete stockyard');
    }
  };

  // Order operations
  const saveOrder = async (order: Order) => {
    try {
      const { error } = await supabase
        .from('orders')
        .upsert({
          id: order.id,
          customer: order.customer,
          quantity: order.quantity,
          priority: order.priority,
          deadline: order.deadline,
          mode: order.mode,
          product: order.product,
          dest_code: order.destCode || null
        });
      
      if (error) throw error;
      await fetchData();
      toast.success('Order saved');
    } catch (err: any) {
      console.error('Error saving order:', err);
      toast.error('Failed to save order');
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
      toast.success('Order deleted');
    } catch (err: any) {
      console.error('Error deleting order:', err);
      toast.error('Failed to delete order');
    }
  };

  // Rake operations
  const saveRake = async (rake: Rake) => {
    try {
      const { error } = await supabase
        .from('rakes')
        .upsert({
          id: rake.id,
          wagons: rake.wagons,
          capacity: rake.capacity,
          type: rake.type,
          available: rake.available,
          location: rake.location
        });
      
      if (error) throw error;
      await fetchData();
      toast.success('Rake saved');
    } catch (err: any) {
      console.error('Error saving rake:', err);
      toast.error('Failed to save rake');
    }
  };

  const deleteRake = async (id: string) => {
    try {
      const { error } = await supabase.from('rakes').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
      toast.success('Rake deleted');
    } catch (err: any) {
      console.error('Error deleting rake:', err);
      toast.error('Failed to delete rake');
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    saveStockyard,
    deleteStockyard,
    saveOrder,
    deleteOrder,
    saveRake,
    deleteRake
  };
}
