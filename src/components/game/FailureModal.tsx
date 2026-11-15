import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw, Lightbulb } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface FailureModalProps {
  open: boolean;
  onRetry: () => void;
  onClose: () => void;
  message?: string;
}

const defaultMessages = [
  'Nästan! Du kan det! 💪',
  'Försök igen! Du lär dig! 🌟',
  'Bra försök! Prova en annan väg! 🎯',
  'Ingen fara! Alla gör fel ibland! 😊',
];

export function FailureModal({ open, onRetry, onClose, message }: FailureModalProps) {
  const displayMessage = message || defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center bg-gradient-to-b from-card to-secondary/20 border-4 border-accent/30 rounded-3xl">
        <VisuallyHidden.Root>
          <DialogTitle>Försök igen</DialogTitle>
          <DialogDescription>{displayMessage}</DialogDescription>
        </VisuallyHidden.Root>
        <div className="py-6 space-y-6">
          <div className="text-6xl">🤔</div>
          
          <h2 className="text-2xl font-bold text-foreground">{displayMessage}</h2>
          
          <div className="bg-muted p-4 rounded-xl flex items-start gap-3 text-left">
            <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <p className="text-muted-foreground">
              Tips: Titta noga på vägen. Vilka pilar behöver du för att komma till hemmet?
            </p>
          </div>

          <Button
            onClick={onRetry}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl touch-target"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Försök igen!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}