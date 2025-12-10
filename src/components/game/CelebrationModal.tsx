import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface CelebrationModalProps {
  open: boolean;
  stars: number;
  levelName: string;
  onNextLevel: () => void;
  onRetry: () => void;
  onClose: () => void;
  hasNextLevel: boolean;
}

const celebrationMessages = [
  'FANTASTISKT! 🎉',
  'BRA JOBBAT! 🌟',
  'DU KLARADE DET! 🎊',
  'VILKEN KODARE! 💪',
];

export function CelebrationModal({
  open,
  stars,
  levelName,
  onNextLevel,
  onRetry,
  onClose,
  hasNextLevel,
}: CelebrationModalProps) {
  const message = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md text-center bg-gradient-to-b from-card to-secondary/20 border-4 border-primary/30 rounded-3xl">
        <VisuallyHidden.Root>
          <DialogTitle>Nivå avklarad</DialogTitle>
        </VisuallyHidden.Root>
        <div className="py-6 space-y-6">
          <div className="text-6xl celebration">🏆</div>
          
          <h2 className="text-3xl font-bold text-primary">{message}</h2>
          
          <p className="text-xl text-muted-foreground">
            Du klarade {levelName}!
          </p>

          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className={cn(
                  'w-12 h-12 transition-all duration-300',
                  i <= stars
                    ? 'fill-game-coin text-game-coin animate-bounce-in'
                    : 'text-muted'
                )}
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button
              onClick={onRetry}
              variant="outline"
              className="text-lg px-6 py-6 rounded-xl touch-target"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Försök igen
            </Button>
            
            {hasNextLevel && (
              <Button
                onClick={onNextLevel}
                className="bg-success hover:bg-success/90 text-success-foreground text-lg px-6 py-6 rounded-xl touch-target"
                size="lg"
              >
                Nästa nivå
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}