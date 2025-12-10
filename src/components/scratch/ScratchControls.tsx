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
          className="bg-red-500 hover:bg-red-600 text-white text-lg px-6 py-6 rounded-xl touch-target btn-bounce"
          size="lg"
        >
          <Square className="w-6 h-6 mr-2" />
          STOPP
        </Button>
      ) : (
        <Button
          onClick={onRun}
          disabled={!canRun}
          className="bg-green-500 hover:bg-green-600 text-white text-lg px-6 py-6 rounded-xl touch-target btn-bounce disabled:opacity-50"
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