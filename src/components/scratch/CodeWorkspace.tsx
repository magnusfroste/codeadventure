import { Block, BlockType } from '@/types/scratch';
import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';

interface CodeWorkspaceProps {
  blocks: Block[];
  activeBlockId: string | null;
  onRemoveBlock: (id: string) => void;
  onUpdateBlockValue: (id: string, value: number) => void;
  onAddToLoop: (loopId: string, type: BlockType) => void;
  onRemoveFromLoop: (loopId: string, blockId: string) => void;
  onClear: () => void;
  isRunning: boolean;
}

export function CodeWorkspace({
  blocks,
  activeBlockId,
  onRemoveBlock,
  onUpdateBlockValue,
  onAddToLoop,
  onRemoveFromLoop,
  onClear,
  isRunning,
}: CodeWorkspaceProps) {
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
        className={cn(
          'flex-1 rounded-xl p-4 space-y-2 overflow-y-auto min-h-[200px]',
          'bg-muted/50 border-2 border-dashed border-border',
          blocks.length === 0 && 'flex items-center justify-center'
        )}
      >
        {blocks.length === 0 ? (
          <p className="text-muted-foreground text-center">
            Lägg till block här!<br />
            <span className="text-sm">Börja med START 🟢</span>
          </p>
        ) : (
          blocks.map((block) => (
            <CodeBlock
              key={block.id}
              block={block}
              isActive={activeBlockId === block.id}
              onRemove={() => onRemoveBlock(block.id)}
              onUpdateValue={(value) => onUpdateBlockValue(block.id, value)}
              onAddToLoop={(type) => onAddToLoop(block.id, type)}
              onRemoveFromLoop={(blockId) => onRemoveFromLoop(block.id, blockId)}
            />
          ))
        )}
      </div>

      {/* Helper hints */}
      <div className="mt-3 text-xs text-muted-foreground space-y-1">
        <p>💡 Tips: Börja alltid med START och avsluta med STOPP</p>
        <p>🔄 Använd LOOP för att upprepa saker!</p>
      </div>
    </div>
  );
}