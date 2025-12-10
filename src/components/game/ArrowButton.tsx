import { Direction, DIRECTION_ARROWS } from '@/types/game';
import { cn } from '@/lib/utils';

interface ArrowButtonProps {
  direction: Direction;
  onClick: () => void;
  disabled?: boolean;
  size?: 'normal' | 'large';
}

const directionColors: Record<Direction, string> = {
  up: 'bg-arrow-up hover:bg-arrow-up/80',
  down: 'bg-arrow-down hover:bg-arrow-down/80',
  left: 'bg-arrow-left hover:bg-arrow-left/80',
  right: 'bg-arrow-right hover:bg-arrow-right/80',
};

export function ArrowButton({ direction, onClick, disabled = false, size = 'normal' }: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-2xl font-bold text-white shadow-lg btn-bounce touch-target',
        'flex items-center justify-center',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-150 active:scale-90',
        directionColors[direction],
        size === 'large' ? 'w-20 h-20 md:w-24 md:h-24 text-4xl md:text-5xl' : 'w-16 h-16 md:w-20 md:h-20 text-3xl md:text-4xl'
      )}
      aria-label={`Gå ${direction === 'up' ? 'upp' : direction === 'down' ? 'ner' : direction === 'left' ? 'vänster' : 'höger'}`}
    >
      {DIRECTION_ARROWS[direction]}
    </button>
  );
}