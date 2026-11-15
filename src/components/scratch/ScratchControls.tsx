import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw } from 'lucide-react';

interface ScratchControlsProps {
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  isRunning: boolean;
  canRun: boolean;
}

export function ScratchControls({
  onRun,
  onStop,
  onReset,
  isRunning,
  canRun,
}: ScratchControlsProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {isRunning ? (
        <Button
          onClick={onStop}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-lg px-6 py-6 rounded-xl touch-target btn-bounce"
          size="lg"
        >
          <Square className="w-6 h-6 mr-2" />
          STOPP
        </Button>
      ) : (
        <Button
          onClick={onRun}
          disabled={!canRun}
          className="bg-success hover:bg-success/90 text-success-foreground text-lg px-6 py-6 rounded-xl touch-target btn-bounce disabled:opacity-50"
          size="lg"
        >
          <Play className="w-6 h-6 mr-2" />
          KÖR!
        </Button>
      )}

      <Button
        onClick={onReset}
        variant="outline"
        className="text-lg px-6 py-6 rounded-xl touch-target btn-bounce"
        size="lg"
      >
        <RotateCcw className="w-6 h-6 mr-2" />
        Återställ
      </Button>
    </div>
  );
}