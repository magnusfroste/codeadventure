import { CharacterType, CHARACTER_EMOJIS } from '@/types/game';
import { cn } from '@/lib/utils';

interface ScratchStageProps {
  character: CharacterType;
  x: number;
  y: number;
  isJumping: boolean;
  rotation: number;
}

export function ScratchStage({ character, x, y, isJumping, rotation }: ScratchStageProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg">
      <h3 className="text-lg font-bold text-foreground text-center mb-3">Scenen</h3>
      
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          width: 400,
          height: 300,
          maxWidth: '100%',
          background: 'linear-gradient(180deg, hsl(200 80% 70%) 0%, hsl(120 40% 50%) 100%)',
        }}
      >
        {/* Ground */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{
            background: 'linear-gradient(0deg, hsl(30 50% 35%) 0%, hsl(120 45% 40%) 100%)',
          }}
        />

        {/* Clouds */}
        <div className="absolute top-4 left-8 text-4xl opacity-80">☁️</div>
        <div className="absolute top-8 right-12 text-3xl opacity-70">☁️</div>
        <div className="absolute top-2 right-32 text-2xl opacity-60">☁️</div>

        {/* Sun */}
        <div className="absolute top-4 right-4 text-5xl animate-pulse">☀️</div>

        {/* Trees */}
        <div className="absolute bottom-10 left-4 text-3xl">🌳</div>
        <div className="absolute bottom-10 right-8 text-4xl">🌲</div>

        {/* Flowers */}
        <div className="absolute bottom-2 left-20 text-xl">🌸</div>
        <div className="absolute bottom-3 left-32 text-lg">🌼</div>
        <div className="absolute bottom-2 right-24 text-xl">🌷</div>

        {/* Character */}
        <div
          className={cn(
            'absolute transition-all duration-300 ease-out',
            'text-5xl select-none',
            isJumping && 'animate-bounce'
          )}
          style={{
            left: x - 25,
            top: y - 25,
            transform: `rotate(${rotation}deg) ${isJumping ? 'translateY(-30px)' : ''}`,
          }}
        >
          {CHARACTER_EMOJIS[character]}
        </div>
      </div>

      {/* Position indicator */}
      <div className="mt-2 text-center text-sm text-muted-foreground">
        Position: ({Math.round(x)}, {Math.round(y)})
      </div>
    </div>
  );
}