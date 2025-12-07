import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  priority: number;
  mode: string;
  deadline: string;
  destCode?: string;
}

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order;
  onSave: (order: Order) => void | Promise<void>;
}

const DEST_CODES = [
  { code: 'DEL', name: 'Delhi' },
  { code: 'BOM', name: 'Mumbai' },
  { code: 'KOL', name: 'Kolkata' },
  { code: 'MAS', name: 'Chennai' },
  { code: 'HYD', name: 'Hyderabad' },
  { code: 'PUN', name: 'Pune' },
  { code: 'JAM', name: 'Jamshedpur' },
  { code: 'BLY', name: 'Bellary' },
  { code: 'AHM', name: 'Ahmedabad' },
  { code: 'BLR', name: 'Bangalore' },
];

export function OrderDialog({ open, onOpenChange, order, onSave }: OrderDialogProps) {
  const [formData, setFormData] = useState<Order>({
    id: '',
    customer: '',
    product: '',
    quantity: 0,
    priority: 2,
    mode: 'rail',
    deadline: '',
    destCode: '',
  });

  useEffect(() => {
    if (order) {
      setFormData(order);
    } else {
      setFormData({
        id: '',
        customer: '',
        product: '',
        quantity: 0,
        priority: 2,
        mode: 'rail',
        deadline: '',
        destCode: '',
      });
    }
  }, [order, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{order ? 'Edit Order' : 'Add Order'}</DialogTitle>
          <DialogDescription>
            {order ? 'Update customer order details' : 'Add a new customer order'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="id">Order ID</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., ORD-001"
                required
                disabled={!!order}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="e.g., CMO Delhi"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Steel Coils">Steel Coils</SelectItem>
                  <SelectItem value="Steel Plates">Steel Plates</SelectItem>
                  <SelectItem value="TMT Bars">TMT Bars</SelectItem>
                  <SelectItem value="Wire Rods">Wire Rods</SelectItem>
                  <SelectItem value="Steel Billets">Steel Billets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity (tons)</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                min="0"
                step="1"
                required
              />
            </div>
            {formData.mode === 'rail' && (
              <div className="grid gap-2">
                <Label htmlFor="destCode">Destination Code (Railway Station)</Label>
                <Select value={formData.destCode || ''} onValueChange={(value) => setFormData({ ...formData, destCode: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEST_CODES.map((dest) => (
                      <SelectItem key={dest.code} value={dest.code}>
                        {dest.code} - {dest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority.toString()} onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">P1 - Critical</SelectItem>
                  <SelectItem value="2">P2 - High</SelectItem>
                  <SelectItem value="3">P3 - Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mode">Transport Mode</Label>
              <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value, destCode: value === 'road' ? undefined : formData.destCode })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rail">Rail</SelectItem>
                  <SelectItem value="road">Road (Truck)</SelectItem>
                </SelectContent>
              </Select>
              {formData.mode === 'road' && (
                <p className="text-xs text-muted-foreground">Road orders go via truck - no railway destination code needed</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{order ? 'Save Changes' : 'Add Order'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
