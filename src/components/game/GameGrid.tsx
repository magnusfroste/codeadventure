import { Cell, Position, CharacterType, CHARACTER_EMOJIS } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameGridProps {
  grid: Cell[][];
  characterPosition: Position;
  homePosition: Position;
  character: CharacterType;
  gridSize: number;
}

export function GameGrid({ grid, characterPosition, homePosition, character, gridSize }: GameGridProps) {
  const cellSize = gridSize <= 3 ? 'w-20 h-20 md:w-24 md:h-24' : gridSize <= 4 ? 'w-16 h-16 md:w-20 md:h-20' : 'w-14 h-14 md:w-16 md:h-16';

  return (
    <div 
      className="inline-grid gap-1 p-3 bg-game-grass/30 rounded-2xl shadow-lg"
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const isCharacter = characterPosition.x === x && characterPosition.y === y;
          const isHome = homePosition.x === x && homePosition.y === y;

          return (
            <div
              key={`${x}-${y}`}
              className={cn(
                cellSize,
                'rounded-xl flex items-center justify-center text-3xl md:text-4xl transition-all duration-200 relative',
                cell.type === 'path' && 'bg-game-path',
                cell.type === 'grass' && 'bg-game-grass',
                cell.type === 'water' && 'bg-game-water',
                cell.type === 'home' && 'bg-game-home',
                cell.type === 'obstacle' && 'bg-game-obstacle',
                isCharacter && 'ring-4 ring-primary ring-offset-2'
              )}
            >
              {/* Home icon */}
              {isHome && !isCharacter && (
                <span className="animate-float">🏠</span>
              )}

              {/* Coin */}
              {cell.hasCoin && !isCharacter && (
                <span className="absolute animate-pulse">⭐</span>
              )}

              {/* Obstacle */}
              {cell.hasObstacle && (
                <span>🪨</span>
              )}

              {/* Water decoration */}
              {cell.type === 'water' && (
                <span className="opacity-50">🌊</span>
              )}

              {/* Character */}
              {isCharacter && (
                <span className="text-4xl md:text-5xl animate-bounce-in z-10">
                  {CHARACTER_EMOJIS[character]}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}