import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Grid3X3, Package, Train } from 'lucide-react';

const productWagonMatrix = [
  {
    product: 'Steel Coils',
    wagonTypes: ['BOXN', 'BCN', 'BCNHL'],
    compatibility: 'High',
    maxCapacity: '58.32 tons',
    loadingMethod: 'Crane'
  },
  {
    product: 'Steel Plates',
    wagonTypes: ['BOXN', 'BCN'],
    compatibility: 'High',
    maxCapacity: '58.32 tons',
    loadingMethod: 'Forklift'
  },
  {
    product: 'TMT Bars',
    wagonTypes: ['BOXN', 'BCNHL', 'BOST'],
    compatibility: 'Medium',
    maxCapacity: '58.32 tons',
    loadingMethod: 'Bundle'
  },
  {
    product: 'Wire Rods',
    wagonTypes: ['BOXN', 'BCN'],
    compatibility: 'High',
    maxCapacity: '58.32 tons',
    loadingMethod: 'Bundle'
  },
  {
    product: 'Structural Steel',
    wagonTypes: ['BOST', 'BFR'],
    compatibility: 'Medium',
    maxCapacity: '50.0 tons',
    loadingMethod: 'Direct'
  },
  {
    product: 'Steel Billets',
    wagonTypes: ['BOXN', 'BCN', 'BCNHL'],
    compatibility: 'High',
    maxCapacity: '58.32 tons',
    loadingMethod: 'Crane'
  },
  {
    product: 'Pig Iron',
    wagonTypes: ['BOXN', 'BCN'],
    compatibility: 'High',
    maxCapacity: '58.32 tons',
    loadingMethod: 'Direct'
  },
  {
    product: 'Cold Rolled Coils',
    wagonTypes: ['BOXN', 'BCNHL'],
    compatibility: 'High',
    maxCapacity: '58.32 tons',
    loadingMethod: 'Crane'
  }
];

const wagonTypes = [
  { type: 'BOXN', description: 'Box wagon for general cargo', capacity: '58.32 tons' },
  { type: 'BCN', description: 'Box wagon for containerized cargo', capacity: '58.32 tons' },
  { type: 'BCNHL', description: 'High capacity box wagon', capacity: '58.32 tons' },
  { type: 'BOST', description: 'Bogie open steel wagon', capacity: '50.0 tons' },
  { type: 'BFR', description: 'Bogie flat wagon with rails', capacity: '50.0 tons' }
];

export function MatrixTable() {
  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case 'High': return 'bg-success text-success-foreground';
      case 'Medium': return 'bg-accent text-accent-foreground';
      case 'Low': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Product vs Wagon Type Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-primary" />
            Product vs Wagon Type Compatibility Matrix
          </CardTitle>
          <CardDescription>
            Compatibility assessment for steel products with different wagon types for optimal loading
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-4">
            {productWagonMatrix.map((item, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{item.product}</span>
                  </div>
                  <Badge className={`${getCompatibilityColor(item.compatibility)} text-xs`}>
                    {item.compatibility}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium">{item.maxCapacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loading:</span>
                    <span className="font-medium">{item.loadingMethod}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground mb-1 block">Wagon Types:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.wagonTypes.map((wagon, wIndex) => (
                        <Badge key={wIndex} variant="outline" className="text-xs">
                          {wagon}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block rounded-lg border overflow-hidden max-w-full">
            <div className="overflow-x-auto max-w-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold min-w-[120px]">Steel Product</TableHead>
                    <TableHead className="font-semibold min-w-[140px] hidden sm:table-cell">Compatible Wagon Types</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Compatibility</TableHead>
                    <TableHead className="font-semibold min-w-[100px] hidden md:table-cell">Max Capacity</TableHead>
                    <TableHead className="font-semibold min-w-[100px] hidden lg:table-cell">Loading Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productWagonMatrix.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Package className="h-3 sm:h-4 w-3 sm:w-4 text-primary" />
                          <span className="text-xs sm:text-sm">{item.product}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {item.wagonTypes.map((wagon, wIndex) => (
                            <Badge key={wIndex} variant="outline" className="text-xs">
                              {wagon}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCompatibilityColor(item.compatibility)} text-xs`}>
                          {item.compatibility}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm hidden md:table-cell">{item.maxCapacity}</TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground hidden lg:table-cell">{item.loadingMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wagon Types Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            Wagon Types Reference
          </CardTitle>
          <CardDescription>
            Details of different wagon types available for steel transportation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wagonTypes.map((wagon, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-card hover:shadow-card transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Train className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{wagon.type}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{wagon.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Capacity:</span>
                  <Badge variant="secondary" className="text-xs">{wagon.capacity}</Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Grid3X3 className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">Optimization Logic</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The AI/ML system considers product-wagon compatibility, loading capacity, and operational constraints 
              to optimize rake formation. High compatibility products are prioritized for efficient loading and transport.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}