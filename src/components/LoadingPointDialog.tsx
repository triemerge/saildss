import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoadingPoint {
  id: string;
  location: string;
  capacity: number;
  utilization: number;
}

interface LoadingPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loadingPoint?: LoadingPoint;
  onSave: (loadingPoint: LoadingPoint) => void;
}

export function LoadingPointDialog({ open, onOpenChange, loadingPoint, onSave }: LoadingPointDialogProps) {
  const [formData, setFormData] = useState<LoadingPoint>({
    id: '',
    location: '',
    capacity: 0,
    utilization: 0,
  });

  useEffect(() => {
    if (loadingPoint) {
      setFormData(loadingPoint);
    } else {
      setFormData({
        id: '',
        location: '',
        capacity: 0,
        utilization: 0,
      });
    }
  }, [loadingPoint, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{loadingPoint ? 'Edit Loading Point' : 'Add Loading Point'}</DialogTitle>
          <DialogDescription>
            {loadingPoint ? 'Update loading point details' : 'Add a new loading point'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id">Loading Point ID</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., LP-1"
                required
                disabled={!!loadingPoint}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., BSP Main Yard"
                required
              />
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
              <Label htmlFor="utilization">Current Utilization (%)</Label>
              <Input
                id="utilization"
                type="number"
                value={formData.utilization}
                onChange={(e) => setFormData({ ...formData, utilization: parseFloat(e.target.value) })}
                min="0"
                max="100"
                step="1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{loadingPoint ? 'Save Changes' : 'Add Loading Point'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
