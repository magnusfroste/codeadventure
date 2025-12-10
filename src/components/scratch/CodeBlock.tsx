import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { Block, BLOCK_DEFINITIONS, BlockType } from '@/types/scratch';
import { cn } from '@/lib/utils';
import { X, Plus, Minus, GripVertical } from 'lucide-react';

interface CodeBlockProps {
  block: Block;
  isActive: boolean;
  onRemove: () => void;
  onUpdateValue?: (value: number) => void;
  onRemoveFromLoop?: (blockId: string) => void;
  isNested?: boolean;
  isDragOverlay?: boolean;
}

export function CodeBlock({
  block,
  isActive,
  onRemove,
  onUpdateValue,
  onRemoveFromLoop,
  isNested = false,
  isDragOverlay = false,
}: CodeBlockProps) {
  const def = BLOCK_DEFINITIONS[block.type];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { block, isNested },
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-xl text-white font-medium relative',
        'transition-all duration-200',
        'shadow-md',
        def.color,
        isActive && 'ring-4 ring-yellow-400 scale-105',
        isDragging && 'opacity-50 z-50',
        isDragOverlay && 'shadow-2xl scale-105 rotate-2',
        isNested ? 'px-2 py-1.5 text-sm' : 'px-4 py-3'
      )}
    >
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className={cn('opacity-60', isNested ? 'w-3 h-3' : 'w-4 h-4')} />
        </div>

        <span className={isNested ? 'text-base' : 'text-xl'}>{def.emoji}</span>
        <span>{def.label}</span>

        {/* Value control for loops */}
        {def.hasValue && onUpdateValue && (
          <div className="flex items-center gap-1 ml-2 bg-white/20 rounded-lg px-2 py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateValue(Math.max(1, (block.value || 1) - 1));
              }}
              className="p-0.5 hover:bg-white/20 rounded"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold">{block.value}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateValue(Math.min(10, (block.value || 1) + 1));
              }}
              className="p-0.5 hover:bg-white/20 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-sm ml-1">gånger</span>
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-auto p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className={isNested ? 'w-3 h-3' : 'w-4 h-4'} />
        </button>
      </div>

      {/* Loop children with drop zone */}
      {def.hasChildren && (
        <LoopDropZone
          loopId={block.id}
          children={block.children || []}
          onRemoveFromLoop={onRemoveFromLoop}
        />
      )}
    </div>
  );
}

interface LoopDropZoneProps {
  loopId: string;
  children: Block[];
  onRemoveFromLoop?: (blockId: string) => void;
}

function LoopDropZone({ loopId, children, onRemoveFromLoop }: LoopDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `loop-${loopId}`,
    data: { loopId, isLoopDropZone: true },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'mt-2 ml-4 pl-2 border-l-4 border-white/30 space-y-1 min-h-[50px] rounded-r-lg transition-all',
        isOver && 'bg-white/20 border-white/60'
      )}
    >
      {children.length > 0 ? (
        children.map((child) => (
          <NestedBlock
            key={child.id}
            block={child}
            onRemove={() => onRemoveFromLoop?.(child.id)}
          />
        ))
      ) : (
        <p className={cn(
          'text-white/60 text-sm py-3 text-center',
          isOver && 'text-white font-medium'
        )}>
          {isOver ? '↓ Släpp här!' : 'Dra block hit...'}
        </p>
      )}
    </div>
  );
}

interface NestedBlockProps {
  block: Block;
  onRemove: () => void;
}

function NestedBlock({ block, onRemove }: NestedBlockProps) {
  const def = BLOCK_DEFINITIONS[block.type];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { block, isNested: true },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'px-2 py-1.5 rounded-lg text-white font-medium text-sm',
        'flex items-center gap-2 transition-all',
        'shadow-sm',
        def.color,
        isDragging && 'opacity-50'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-3 h-3 opacity-60" />
      </div>
      <span className="text-base">{def.emoji}</span>
      <span>{def.label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-auto p-0.5 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// Drag overlay component for visual feedback
export function DragOverlayBlock({ block }: { block: Block }) {
  const def = BLOCK_DEFINITIONS[block.type];

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-xl text-white font-medium',
        'shadow-2xl scale-105 rotate-2',
        'flex items-center gap-2',
        def.color
      )}
    >
      <GripVertical className="w-4 h-4 opacity-60" />
      <span className="text-xl">{def.emoji}</span>
      <span>{def.label}</span>
    </div>
  );
}

// New block preview for palette drag
export function NewBlockOverlay({ type }: { type: BlockType }) {
  const def = BLOCK_DEFINITIONS[type];

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-xl text-white font-medium',
        'shadow-2xl scale-110',
        'flex items-center gap-2',
        def.color
      )}
    >
      <span className="text-xl">{def.emoji}</span>
      <span>{def.label}</span>
      <span className="text-xs bg-white/30 px-2 py-0.5 rounded ml-2">+ Ny</span>
    </div>
  );
}