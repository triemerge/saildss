import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Rake {
  id: string;
  capacity: number;
  currentLoad: number;
  type: string;
  available: boolean;
  location: string;
}

interface RakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rake?: Rake;
  onSave: (rake: Rake) => void;
}

export function RakeDialog({ open, onOpenChange, rake, onSave }: RakeDialogProps) {
  const [formData, setFormData] = useState<Rake>({
    id: '',
    capacity: 0,
    currentLoad: 0,
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
        capacity: 0,
        currentLoad: 0,
        type: 'BOXN',
        available: true,
        location: '',
      });
    }
  }, [rake, open]);

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
                  <SelectItem value="BOST">BOST - Open Wagon</SelectItem>
                  <SelectItem value="BRN">BRN - Bogie Wagon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity (tons)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseFloat(e.target.value) })}
                min="0"
                step="0.1"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentLoad">Current Load (tons)</Label>
              <Input
                id="currentLoad"
                type="number"
                value={formData.currentLoad}
                onChange={(e) => setFormData({ ...formData, currentLoad: parseFloat(e.target.value) })}
                min="0"
                step="0.1"
                max={formData.capacity}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., BSP Yard"
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
