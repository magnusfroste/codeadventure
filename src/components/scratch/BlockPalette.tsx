import { useDraggable } from '@dnd-kit/core';
import { BlockType, BLOCK_DEFINITIONS } from '@/types/scratch';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface BlockPaletteProps {
  disabled?: boolean;
}

const categories = [
  { name: 'Kontroll', types: ['start', 'stop', 'loop'] as BlockType[] },
  { name: 'Rörelse', types: ['move_up', 'move_down', 'move_left', 'move_right'] as BlockType[] },
  { name: 'Action', types: ['jump'] as BlockType[] },
];

export function BlockPalette({ disabled }: BlockPaletteProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg space-y-4">
      <h3 className="text-lg font-bold text-foreground text-center">Block</h3>
      <p className="text-xs text-muted-foreground text-center">Dra block till programmet →</p>
      
      {categories.map((category) => (
        <div key={category.name} className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{category.name}</p>
          <div className="flex flex-col gap-2">
            {category.types.map((type) => (
              <DraggablePaletteBlock key={type} type={type} disabled={disabled} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface DraggablePaletteBlockProps {
  type: BlockType;
  disabled?: boolean;
}

function DraggablePaletteBlock({ type, disabled }: DraggablePaletteBlockProps) {
  const def = BLOCK_DEFINITIONS[type];
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, fromPalette: true },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'px-3 py-2.5 rounded-xl text-white font-medium text-sm',
        'flex items-center gap-2 transition-all cursor-grab active:cursor-grabbing',
        'shadow-md touch-target select-none',
        def.color,
        isDragging && 'opacity-50 scale-95',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <GripVertical className="w-4 h-4 opacity-60" />
      <span className="text-lg">{def.emoji}</span>
      <span>{def.label}</span>
      {def.hasValue && <span className="text-xs opacity-75 ml-auto">🔄</span>}
    </div>
  );
}