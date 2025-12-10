import { BlockType, BLOCK_DEFINITIONS } from '@/types/scratch';
import { cn } from '@/lib/utils';

interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
  onAddToLoop?: (type: BlockType) => void;
  disabled?: boolean;
}

const categories = [
  { name: 'Kontroll', types: ['start', 'stop', 'loop'] as BlockType[] },
  { name: 'Rörelse', types: ['move_up', 'move_down', 'move_left', 'move_right'] as BlockType[] },
  { name: 'Action', types: ['jump'] as BlockType[] },
];

export function BlockPalette({ onAddBlock, disabled }: BlockPaletteProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg space-y-4">
      <h3 className="text-lg font-bold text-foreground text-center">Block</h3>
      
      {categories.map((category) => (
        <div key={category.name} className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{category.name}</p>
          <div className="flex flex-wrap gap-2">
            {category.types.map((type) => {
              const def = BLOCK_DEFINITIONS[type];
              return (
                <button
                  key={type}
                  onClick={() => onAddBlock(type)}
                  disabled={disabled}
                  className={cn(
                    'px-3 py-2 rounded-xl text-white font-medium text-sm',
                    'flex items-center gap-2 transition-all',
                    'hover:scale-105 active:scale-95',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'shadow-md touch-target',
                    def.color
                  )}
                >
                  <span>{def.emoji}</span>
                  <span>{def.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}