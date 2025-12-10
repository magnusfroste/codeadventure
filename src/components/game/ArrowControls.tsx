import { Direction } from '@/types/game';
import { ArrowButton } from './ArrowButton';

interface ArrowControlsProps {
  onDirection: (direction: Direction) => void;
  disabled?: boolean;
}

export function ArrowControls({ onDirection, disabled = false }: ArrowControlsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ArrowButton direction="up" onClick={() => onDirection('up')} disabled={disabled} size="large" />
      <div className="flex gap-2">
        <ArrowButton direction="left" onClick={() => onDirection('left')} disabled={disabled} size="large" />
        <ArrowButton direction="down" onClick={() => onDirection('down')} disabled={disabled} size="large" />
        <ArrowButton direction="right" onClick={() => onDirection('right')} disabled={disabled} size="large" />
      </div>
    </div>
  );
}