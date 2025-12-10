import { Block, BLOCK_DEFINITIONS, BlockType } from '@/types/scratch';
import { cn } from '@/lib/utils';
import { X, Plus, Minus } from 'lucide-react';

interface CodeBlockProps {
  block: Block;
  isActive: boolean;
  onRemove: () => void;
  onUpdateValue?: (value: number) => void;
  onAddToLoop?: (type: BlockType) => void;
  onRemoveFromLoop?: (blockId: string) => void;
  isNested?: boolean;
}

export function CodeBlock({
  block,
  isActive,
  onRemove,
  onUpdateValue,
  onAddToLoop,
  onRemoveFromLoop,
  isNested = false,
}: CodeBlockProps) {
  const def = BLOCK_DEFINITIONS[block.type];

  return (
    <div
      className={cn(
        'rounded-xl text-white font-medium relative',
        'transition-all duration-200',
        'shadow-md',
        def.color,
        isActive && 'ring-4 ring-yellow-400 scale-105',
        isNested ? 'px-2 py-1.5 text-sm' : 'px-4 py-3'
      )}
    >
      <div className="flex items-center gap-2">
        <span className={isNested ? 'text-base' : 'text-xl'}>{def.emoji}</span>
        <span>{def.label}</span>

        {/* Value control for loops */}
        {def.hasValue && onUpdateValue && (
          <div className="flex items-center gap-1 ml-2 bg-white/20 rounded-lg px-2 py-1">
            <button
              onClick={() => onUpdateValue(Math.max(1, (block.value || 1) - 1))}
              className="p-0.5 hover:bg-white/20 rounded"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold">{block.value}</span>
            <button
              onClick={() => onUpdateValue(Math.min(10, (block.value || 1) + 1))}
              className="p-0.5 hover:bg-white/20 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-sm ml-1">gånger</span>
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="ml-auto p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className={isNested ? 'w-3 h-3' : 'w-4 h-4'} />
        </button>
      </div>

      {/* Loop children */}
      {def.hasChildren && (
        <div className="mt-2 ml-4 pl-2 border-l-4 border-white/30 space-y-1 min-h-[40px]">
          {block.children && block.children.length > 0 ? (
            block.children.map((child) => (
              <CodeBlock
                key={child.id}
                block={child}
                isActive={false}
                onRemove={() => onRemoveFromLoop?.(child.id)}
                isNested
              />
            ))
          ) : (
            <p className="text-white/60 text-sm py-2">Dra block hit...</p>
          )}
          
          {/* Quick add buttons for loop */}
          {onAddToLoop && (
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/20">
              {(['move_up', 'move_down', 'move_left', 'move_right', 'jump'] as BlockType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onAddToLoop(type)}
                  className="text-xs px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                >
                  {BLOCK_DEFINITIONS[type].emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}