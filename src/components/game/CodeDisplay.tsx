import { Direction, DIRECTION_ARROWS } from '@/types/game';
import { cn } from '@/lib/utils';

interface CodeDisplayProps {
  code: Direction[];
  orientation?: 'horizontal' | 'vertical';
  maxDisplay?: number;
}

const directionBg: Record<Direction, string> = {
  up: 'bg-arrow-up',
  down: 'bg-arrow-down',
  left: 'bg-arrow-left',
  right: 'bg-arrow-right',
};

export function CodeDisplay({ code, orientation = 'horizontal', maxDisplay = 12 }: CodeDisplayProps) {
  const displayCode = code.slice(-maxDisplay);
  const hasMore = code.length > maxDisplay;

  if (code.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-4 min-h-[80px] flex items-center justify-center border-2 border-dashed border-border">
        <p className="text-muted-foreground text-lg">Din kod visas här...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 shadow-md">
      <p className="text-sm text-muted-foreground mb-2 font-medium">
        Din kod ({code.length} steg):
      </p>
      <div
        className={cn(
          'flex gap-2',
          orientation === 'vertical' ? 'flex-col items-center' : 'flex-row flex-wrap'
        )}
      >
        {hasMore && (
          <span className="text-muted-foreground text-xl">...</span>
        )}
        {displayCode.map((dir, index) => (
          <div
            key={index}
            className={cn(
              'w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white text-xl md:text-2xl font-bold animate-bounce-in',
              directionBg[dir]
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {DIRECTION_ARROWS[dir]}
          </div>
        ))}
      </div>
    </div>
  );
}