import { useDraggable } from '@dnd-kit/core';
import { BlockType, BLOCK_DEFINITIONS } from '@/types/scratch';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';

interface BlockPaletteProps {
  disabled?: boolean;
  onAdd: (type: BlockType) => void;
}

const categories = [
  { name: 'Kontroll', types: ['start', 'stop', 'loop'] as BlockType[] },
  { name: 'Rörelse', types: ['move_up', 'move_down', 'move_left', 'move_right'] as BlockType[] },
  { name: 'Hoppa', types: ['jump'] as BlockType[] },
];

export function BlockPalette({ disabled, onAdd }: BlockPaletteProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg space-y-4">
      <h3 className="text-lg font-bold text-foreground text-center">Block</h3>
      <p className="text-xs text-muted-foreground text-center">Dra block till programmet →</p>
      
      {categories.map((category) => (
        <div key={category.name} className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{category.name}</p>
          <div className="flex flex-col gap-2">
            {category.types.map((type) => (
              <DraggablePaletteBlock key={type} type={type} disabled={disabled} onAdd={onAdd} />
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
  onAdd: (type: BlockType) => void;
}

function DraggablePaletteBlock({ type, disabled, onAdd }: DraggablePaletteBlockProps) {
  const def = BLOCK_DEFINITIONS[type];
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, fromPalette: true },
    disabled,
  });

  return (
    <Button variant="ghost"
      onClick={() => onAdd(type)}
      disabled={disabled}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      aria-label={`Lägg till ${def.label}`}
      className={cn(
        'px-3 py-2.5 rounded-xl text-primary-foreground font-medium text-sm',
        'flex items-center gap-2 transition-all cursor-grab active:cursor-grabbing',
        'shadow-md touch-target select-none touch-none justify-start',
        def.color,
        isDragging && 'opacity-50 scale-95',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <GripVertical className="w-4 h-4 opacity-60" />
      <span className="text-lg">{def.emoji}</span>
      <span>{def.label}</span>
      {def.hasValue && <span className="text-xs opacity-75 ml-auto">🔄</span>}
    </Button>
  );
}