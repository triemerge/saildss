import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Rake {
  id: string;
  wagons: number;
  capacity: number;
  type: string;
  available: boolean;
  location: string;
}

interface RakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rake?: Rake;
  onSave: (rake: Rake) => void | Promise<void>;
}

export function RakeDialog({ open, onOpenChange, rake, onSave }: RakeDialogProps) {
  const [formData, setFormData] = useState<Rake>({
    id: '',
    wagons: 43,
    capacity: 2752,
    type: 'BOXN',
    available: true,
    location: '',
  });

  useEffect(() => {
    if (rake) {
      setFormData(rake);
    } else {
      setFormData({
        id: '',
        wagons: 43,
        capacity: 2752,
        type: 'BOXN',
        available: true,
        location: '',
      });
    }
  }, [rake, open]);

  // Auto-calculate capacity when wagons change (43 wagons * 64 tons = 2752)
  const handleWagonsChange = (wagons: number) => {
    setFormData({ 
      ...formData, 
      wagons, 
      capacity: wagons * 64 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{rake ? 'Edit Rake' : 'Add Rake'}</DialogTitle>
          <DialogDescription>
            {rake ? 'Update rake details' : 'Add a new rake to the fleet'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id">Rake ID</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., RAKE-001"
                required
                disabled={!!rake}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Rake Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOXN">BOXN - Box Wagon</SelectItem>
                  <SelectItem value="BCN">BCN - Bogie Covered Wagon</SelectItem>
                  <SelectItem value="BCNHL">BCNHL - High Capacity</SelectItem>
                  <SelectItem value="BOST">BOST - Open Wagon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="wagons">Number of Wagons</Label>
              <Input
                id="wagons"
                type="number"
                value={formData.wagons}
                onChange={(e) => handleWagonsChange(parseInt(e.target.value) || 0)}
                min="1"
                max="43"
                required
              />
              <p className="text-xs text-muted-foreground">Max 43 wagons per rake</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Total Capacity (tons)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Auto-calculated: {formData.wagons} wagons × 64 tons = {formData.capacity} tons</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., BSP Yard 1"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="available">Available for Assignment</Label>
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{rake ? 'Save Changes' : 'Add Rake'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
