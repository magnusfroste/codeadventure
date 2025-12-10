import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useScratchEngine } from '@/hooks/useScratchEngine';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BlockPalette } from '@/components/scratch/BlockPalette';
import { CodeWorkspace } from '@/components/scratch/CodeWorkspace';
import { ScratchStage } from '@/components/scratch/ScratchStage';
import { ScratchControls } from '@/components/scratch/ScratchControls';
import { CharacterSelector } from '@/components/game/CharacterSelector';
import { DragOverlayBlock, NewBlockOverlay } from '@/components/scratch/CodeBlock';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { Block, BlockType, BLOCK_DEFINITIONS } from '@/types/scratch';

export default function ScratchEditor() {
  const navigate = useNavigate();
  const { progress, selectCharacter } = useGameProgress();
  const { playSound } = useSoundEffects();
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<{ type: BlockType; fromPalette: boolean } | { block: Block } | null>(null);

  const handleEngineSound = useCallback((sound: 'move' | 'jump' | 'start' | 'loop' | 'success' | 'error') => {
    if (soundEnabled) {
      playSound(sound);
    }
  }, [soundEnabled, playSound]);

  const {
    blocks,
    stageState,
    isRunning,
    activeBlockId,
    addBlock,
    removeBlock,
    updateBlockValue,
    addBlockToLoop,
    removeBlockFromLoop,
    clearBlocks,
    resetStage,
    runProgram,
    stopProgram,
    setBlocks,
  } = useScratchEngine(progress.selectedCharacter, handleEngineSound);

  // Configure sensors for both mouse and touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    if (soundEnabled) {
      playSound('pickup');
    }
    
    if (active.data.current?.fromPalette) {
      setActiveDragData({ type: active.data.current.type, fromPalette: true });
    } else if (active.data.current?.block) {
      setActiveDragData({ block: active.data.current.block });
    }
  }, [soundEnabled, playSound]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Visual feedback is handled by the droppable components
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setActiveDragData(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Dragging from palette
    if (activeData?.fromPalette) {
      const blockType = activeData.type as BlockType;
      
      // Dropped on workspace
      if (over.id === 'workspace' || overData?.isWorkspace) {
        addBlock(blockType);
        if (soundEnabled) {
          playSound('drop');
        }
        toast.success(`${BLOCK_DEFINITIONS[blockType].emoji} ${BLOCK_DEFINITIONS[blockType].label} tillagd!`);
      }
      // Dropped on a loop
      else if (overData?.isLoopDropZone) {
        const loopId = overData.loopId as string;
        addBlockToLoop(loopId, blockType);
        if (soundEnabled) {
          playSound('drop');
        }
        toast.success(`Block tillagd i loopen!`);
      }
      return;
    }

    // Reordering within workspace
    if (activeData?.block && !activeData?.isNested) {
      const activeBlock = activeData.block as Block;
      
      // Moving to a loop
      if (overData?.isLoopDropZone) {
        const loopId = overData.loopId as string;
        removeBlock(activeBlock.id);
        addBlockToLoop(loopId, activeBlock.type);
        if (soundEnabled) {
          playSound('drop');
        }
        return;
      }

      // Reordering in main list
      if (over.id !== active.id) {
        const oldIndex = blocks.findIndex(b => b.id === active.id);
        const newIndex = blocks.findIndex(b => b.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newBlocks = arrayMove(blocks, oldIndex, newIndex);
          setBlocks(newBlocks);
          if (soundEnabled) {
            playSound('click');
          }
        }
      }
    }
  }, [blocks, addBlock, addBlockToLoop, removeBlock, setBlocks, soundEnabled, playSound]);

  const handleRun = async () => {
    const result = await runProgram();
    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      toast.success('Programmet kördes! 🎉');
    }
  };

  const hasStartBlock = blocks.length > 0 && blocks[0].type === 'start';

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/map')}
                variant="ghost"
                className="rounded-xl touch-target"
              >
                <ArrowLeft className="w-6 h-6 mr-2" />
                Tillbaka
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
                  <Sparkles className="w-8 h-8" />
                  Blockprogrammering
                </h1>
                <p className="text-muted-foreground">Dra block för att skapa ditt program!</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="icon"
                className="rounded-xl"
                title={soundEnabled ? 'Stäng av ljud' : 'Slå på ljud'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <Button
                onClick={() => setShowCharacterSelect(!showCharacterSelect)}
                variant="outline"
                className="rounded-xl"
              >
                Byt karaktär
              </Button>
            </div>
          </div>

          {/* Character selector (collapsible) */}
          {showCharacterSelect && (
            <div className="bg-card rounded-2xl p-4 shadow-lg animate-fade-in">
              <CharacterSelector
                selected={progress.selectedCharacter}
                onSelect={(char) => {
                  selectCharacter(char);
                  setShowCharacterSelect(false);
                  if (soundEnabled) playSound('click');
                }}
              />
            </div>
          )}

          {/* Main content - responsive grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Block Palette */}
            <div className="lg:col-span-3">
              <BlockPalette disabled={isRunning} />
            </div>

            {/* Code Workspace */}
            <div className="lg:col-span-5">
              <CodeWorkspace
                blocks={blocks}
                activeBlockId={activeBlockId}
                onRemoveBlock={(id) => {
                  removeBlock(id);
                  if (soundEnabled) playSound('click');
                }}
                onUpdateBlockValue={(id, value) => {
                  updateBlockValue(id, value);
                  if (soundEnabled) playSound('click');
                }}
                onRemoveFromLoop={(loopId, blockId) => {
                  removeBlockFromLoop(loopId, blockId);
                  if (soundEnabled) playSound('click');
                }}
                onClear={() => {
                  clearBlocks();
                  if (soundEnabled) playSound('click');
                }}
                isRunning={isRunning}
              />
            </div>

            {/* Stage */}
            <div className="lg:col-span-4 space-y-4">
              <ScratchStage
                character={progress.selectedCharacter}
                x={stageState.x}
                y={stageState.y}
                isJumping={stageState.isJumping}
                rotation={stageState.rotation}
              />

              <ScratchControls
                onRun={handleRun}
                onStop={stopProgram}
                onReset={() => {
                  resetStage();
                  if (soundEnabled) playSound('click');
                }}
                isRunning={isRunning}
                canRun={hasStartBlock && blocks.length > 1}
              />
            </div>
          </div>

          {/* Help section */}
          <div className="bg-card rounded-2xl p-4 shadow-lg">
            <h3 className="font-bold text-foreground mb-2">🎓 Hur fungerar det?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p className="font-medium text-foreground">1. Dra block</p>
                <p>Dra block från paletten till ditt program. Du kan ändra ordningen genom att dra!</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">2. Använd loopar</p>
                <p>Dra block IN i en LOOP för att upprepa dem flera gånger! 🔄</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">3. Kör programmet</p>
                <p>Tryck på KÖR och se din karaktär följa instruktionerna!</p>
              </div>
            </div>
          </div>

          {/* Example challenges */}
          <div className="bg-accent/10 rounded-2xl p-4">
            <h3 className="font-bold text-foreground mb-3">🎯 Utmaningar att prova:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <ChallengeCard
                emoji="🔲"
                title="Rita en fyrkant"
                description="Använd en LOOP med 4 upprepningar!"
              />
              <ChallengeCard
                emoji="🦘"
                title="Hoppa 5 gånger"
                description="Lägg HOPPA i en LOOP!"
              />
              <ChallengeCard
                emoji="💃"
                title="Dans-party"
                description="Kombinera hopp och rörelser i en loop!"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drag overlay - shows what's being dragged */}
      <DragOverlay>
        {activeDragData && 'fromPalette' in activeDragData ? (
          <NewBlockOverlay type={activeDragData.type} />
        ) : activeDragData && 'block' in activeDragData ? (
          <DragOverlayBlock block={activeDragData.block} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function ChallengeCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="bg-card rounded-xl p-3 shadow-sm">
      <div className="text-2xl mb-1">{emoji}</div>
      <p className="font-medium text-foreground text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}