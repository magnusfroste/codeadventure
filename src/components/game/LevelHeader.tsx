import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import { Level } from '@/types/game';
import { cn } from '@/lib/utils';

interface LevelHeaderProps {
  level: Level;
  earnedStars: number;
  onBack: () => void;
}

const modeLabels = {
  guided: 'Guidad',
  plan: 'Planera',
  master: 'Mästare',
};

const modeColors = {
  guided: 'bg-success/20 text-success',
  plan: 'bg-primary/20 text-primary',
  master: 'bg-accent/20 text-accent',
};

export function LevelHeader({ level, earnedStars, onBack }: LevelHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <Button
        onClick={onBack}
        variant="ghost"
        className="rounded-xl touch-target"
        size="lg"
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Tillbaka
      </Button>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className={cn('px-3 py-1 rounded-full text-sm font-medium', modeColors[level.mode])}>
            {modeLabels[level.mode]}
          </span>
          <h1 className="text-2xl font-bold text-foreground">
            Nivå {level.id}: {level.name}
          </h1>
        </div>
        <p className="text-muted-foreground">{level.description}</p>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <Star
            key={i}
            className={cn(
              'w-8 h-8',
              i <= earnedStars ? 'fill-game-coin text-game-coin' : 'text-muted'
            )}
          />
        ))}
      </div>
    </div>
  );
}