import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Stockyard {
  id: string;
  location: string;
  material: string;
  quantity: number;
  costPerTon: number;
}

interface StockyardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockyard?: Stockyard;
  onSave: (stockyard: Stockyard) => void;
}

export function StockyardDialog({ open, onOpenChange, stockyard, onSave }: StockyardDialogProps) {
  const [formData, setFormData] = useState<Stockyard>({
    id: '',
    location: '',
    material: 'Steel Coils',
    quantity: 0,
    costPerTon: 0,
  });

  useEffect(() => {
    if (stockyard) {
      setFormData(stockyard);
    } else {
      setFormData({
        id: '',
        location: '',
        material: 'Steel Coils',
        quantity: 0,
        costPerTon: 0,
      });
    }
  }, [stockyard, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{stockyard ? 'Edit Stockyard' : 'Add Stockyard'}</DialogTitle>
          <DialogDescription>
            {stockyard ? 'Update stockyard inventory details' : 'Add a new stockyard to inventory'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id">Stockyard ID</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., BSP-SY1"
                required
                disabled={!!stockyard}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., BSP Plant 1"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material">Material</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Steel Coils">Steel Coils</SelectItem>
                  <SelectItem value="Steel Plates">Steel Plates</SelectItem>
                  <SelectItem value="TMT Bars">TMT Bars</SelectItem>
                  <SelectItem value="Wire Rods">Wire Rods</SelectItem>
                  <SelectItem value="Rails">Rails</SelectItem>
                  <SelectItem value="Pig Iron">Pig Iron</SelectItem>
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
                step="0.1"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="costPerTon">Cost per Ton (₹)</Label>
              <Input
                id="costPerTon"
                type="number"
                value={formData.costPerTon}
                onChange={(e) => setFormData({ ...formData, costPerTon: parseFloat(e.target.value) })}
                min="0"
                step="1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{stockyard ? 'Save Changes' : 'Add Stockyard'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
