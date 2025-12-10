import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Block, BlockType } from '@/types/scratch';
import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';

interface CodeWorkspaceProps {
  blocks: Block[];
  activeBlockId: string | null;
  onRemoveBlock: (id: string) => void;
  onUpdateBlockValue: (id: string, value: number) => void;
  onRemoveFromLoop: (loopId: string, blockId: string) => void;
  onClear: () => void;
  isRunning: boolean;
}

export function CodeWorkspace({
  blocks,
  activeBlockId,
  onRemoveBlock,
  onUpdateBlockValue,
  onRemoveFromLoop,
  onClear,
  isRunning,
}: CodeWorkspaceProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'workspace',
    data: { isWorkspace: true },
  });

  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Ditt program</h3>
        {blocks.length > 0 && (
          <button
            onClick={onClear}
            disabled={isRunning}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
          >
            Rensa allt
          </button>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 rounded-xl p-4 space-y-2 overflow-y-auto min-h-[250px]',
          'border-2 border-dashed transition-all duration-200',
          isOver 
            ? 'bg-primary/10 border-primary border-solid' 
            : 'bg-muted/50 border-border',
          blocks.length === 0 && 'flex items-center justify-center'
        )}
      >
        {blocks.length === 0 ? (
          <div className={cn(
            'text-center transition-all',
            isOver ? 'text-primary font-medium scale-105' : 'text-muted-foreground'
          )}>
            {isOver ? (
              <>
                <p className="text-2xl mb-2">↓</p>
                <p>Släpp blocket här!</p>
              </>
            ) : (
              <>
                <p>Dra block hit!</p>
                <p className="text-sm mt-1">Börja med START 🟢</p>
              </>
            )}
          </div>
        ) : (
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <CodeBlock
                key={block.id}
                block={block}
                isActive={activeBlockId === block.id}
                onRemove={() => onRemoveBlock(block.id)}
                onUpdateValue={(value) => onUpdateBlockValue(block.id, value)}
                onRemoveFromLoop={(blockId) => onRemoveFromLoop(block.id, blockId)}
              />
            ))}
          </SortableContext>
        )}
      </div>

      {/* Helper hints */}
      <div className="mt-3 text-xs text-muted-foreground space-y-1">
        <p>💡 Tips: Börja alltid med START och avsluta med STOPP</p>
        <p>🔄 Dra block till LOOP för att upprepa dem!</p>
      </div>
    </div>
  );
}