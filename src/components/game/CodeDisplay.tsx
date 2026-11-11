import { Direction, DIRECTION_ARROWS } from '@/types/game';
import { cn } from '@/lib/utils';

interface CodeDisplayProps {
  code: Direction[];
  orientation?: 'horizontal' | 'vertical';
  maxDisplay?: number;
  onRemove?: (index: number) => void;
  activeIndex?: number;
}

const directionBg: Record<Direction, string> = {
  up: 'bg-arrow-up',
  down: 'bg-arrow-down',
  left: 'bg-arrow-left',
  right: 'bg-arrow-right',
};

export function CodeDisplay({ code, orientation = 'horizontal', maxDisplay = 12, onRemove, activeIndex = -1 }: CodeDisplayProps) {
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
        {displayCode.map((dir, index) => {
          const realIndex = code.length - displayCode.length + index;
          const isActive = realIndex === activeIndex;
          const isDone = activeIndex >= 0 && realIndex < activeIndex;
          return (
          <button
            type="button"
            key={index}
            disabled={!onRemove}
            onClick={() => onRemove?.(realIndex)}
            aria-current={isActive ? 'step' : undefined}
            aria-label={onRemove ? 'Ta bort pil' : undefined}
            className={cn(
              'w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white text-xl md:text-2xl font-bold transition-all duration-200',
              directionBg[dir],
              onRemove && 'cursor-pointer hover:opacity-70 active:scale-90',
              isActive && 'scale-125 ring-4 ring-accent ring-offset-2 z-10',
              isDone && 'opacity-40'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {DIRECTION_ARROWS[dir]}
          </button>
          );
        })}
      </div>
      {onRemove && (
        <p className="text-xs text-muted-foreground mt-2">Tryck på en pil för att ta bort den.</p>
      )}
    </div>
  );
}