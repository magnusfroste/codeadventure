import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trash2 } from 'lucide-react';

interface GameControlsProps {
  onRun: () => void;
  onReset: () => void;
  onClear: () => void;
  canRun: boolean;
  canClear: boolean;
  isRunning: boolean;
  showRunButton?: boolean;
}

export function GameControls({
  onRun,
  onReset,
  onClear,
  canRun,
  canClear,
  isRunning,
  showRunButton = true,
}: GameControlsProps) {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {showRunButton && (
        <Button
          onClick={onRun}
          disabled={!canRun || isRunning}
          className="bg-success hover:bg-success/90 text-success-foreground text-lg px-6 py-6 rounded-xl touch-target btn-bounce"
          size="lg"
        >
          <Play className="w-6 h-6 mr-2" />
          {isRunning ? 'Kör...' : 'KÖR!'}
        </Button>
      )}
      
      <Button
        onClick={onClear}
        disabled={!canClear || isRunning}
        variant="outline"
        className="text-lg px-6 py-6 rounded-xl touch-target btn-bounce"
        size="lg"
      >
        <Trash2 className="w-6 h-6 mr-2" />
        Rensa
      </Button>

      <Button
        onClick={onReset}
        disabled={isRunning}
        variant="secondary"
        className="text-lg px-6 py-6 rounded-xl touch-target btn-bounce"
        size="lg"
      >
        <RotateCcw className="w-6 h-6 mr-2" />
        Börja om
      </Button>
    </div>
  );
}