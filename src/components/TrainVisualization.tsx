import { useState } from 'react';
import { Train, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrainVisualizationProps {
  wagonsUsed: number;
  totalWagons: number;
  rakeId: string;
}

export function TrainVisualization({ wagonsUsed, totalWagons, rakeId }: TrainVisualizationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const filledWagons = Math.min(wagonsUsed, totalWagons);
  const wagonArray = Array.from({ length: totalWagons }, (_, i) => i < filledWagons);
  
  return (
    <div className="space-y-2">
      {/* Minimized Header - Always Visible */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg cursor-pointer hover:bg-muted/60 transition-all duration-200 group"
      >
        <Train className="h-5 w-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{rakeId}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-24 bg-secondary rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-success h-full transition-all duration-300 rounded-full"
                style={{ width: `${(filledWagons / totalWagons) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {filledWagons}/{totalWagons} wagons ({Math.round((filledWagons / totalWagons) * 100)}%)
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted transition-transform duration-300 flex-shrink-0"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Expanded View - Shown when expanded */}
      {isExpanded && (
        <div className="animate-slide-up space-y-3 p-4 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
          {/* Full Visual Train */}
          <div className="flex items-center gap-1 p-3 bg-muted/30 rounded-lg overflow-x-auto min-h-[60px]">
            {/* Engine */}
            <div className="flex-shrink-0 w-8 h-12 rounded-lg bg-gradient-to-b from-primary to-primary/80 shadow-md flex items-center justify-center">
              <div className="text-white text-lg font-bold">🚂</div>
            </div>
            
            {/* Coupling */}
            <div className="flex-shrink-0 w-1 h-8 bg-gray-400 rounded-sm opacity-70"></div>
            
            {/* All Wagons */}
            <div className="flex gap-1 flex-wrap">
              {wagonArray.map((isFilled, index) => (
                <div
                  key={index}
                  className={`
                    w-6 h-10 rounded-md shadow-sm transition-all duration-300 flex items-center justify-center text-[9px] font-bold
                    ${isFilled 
                      ? 'bg-gradient-to-b from-success to-success/80 text-white' 
                      : 'bg-muted border border-border/50 text-muted-foreground opacity-50'
                    }
                  `}
                  title={`Wagon ${index + 1}: ${isFilled ? 'Filled' : 'Empty'}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
              <p className="text-muted-foreground font-medium text-xs">Filled Wagons</p>
              <p className="text-2xl font-bold text-success mt-1">{filledWagons}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
              <p className="text-muted-foreground font-medium text-xs">Empty Wagons</p>
              <p className="text-2xl font-bold text-muted-foreground mt-1">{totalWagons - filledWagons}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
              <p className="text-muted-foreground font-medium text-xs">Utilization</p>
              <p className="text-2xl font-bold text-primary mt-1">{Math.round((filledWagons / totalWagons) * 100)}%</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
              <p className="text-muted-foreground font-medium text-xs">Total Capacity</p>
              <p className="text-2xl font-bold mt-1">{totalWagons}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
