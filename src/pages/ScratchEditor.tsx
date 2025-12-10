import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useScratchEngine } from '@/hooks/useScratchEngine';
import { BlockPalette } from '@/components/scratch/BlockPalette';
import { CodeWorkspace } from '@/components/scratch/CodeWorkspace';
import { ScratchStage } from '@/components/scratch/ScratchStage';
import { ScratchControls } from '@/components/scratch/ScratchControls';
import { CharacterSelector } from '@/components/game/CharacterSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ScratchEditor() {
  const navigate = useNavigate();
  const { progress, selectCharacter } = useGameProgress();
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);

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
  } = useScratchEngine(progress.selectedCharacter);

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
              <p className="text-muted-foreground">Skapa ditt eget program!</p>
            </div>
          </div>

          <Button
            onClick={() => setShowCharacterSelect(!showCharacterSelect)}
            variant="outline"
            className="rounded-xl"
          >
            Byt karaktär
          </Button>
        </div>

        {/* Character selector (collapsible) */}
        {showCharacterSelect && (
          <div className="bg-card rounded-2xl p-4 shadow-lg animate-fade-in">
            <CharacterSelector
              selected={progress.selectedCharacter}
              onSelect={(char) => {
                selectCharacter(char);
                setShowCharacterSelect(false);
              }}
            />
          </div>
        )}

        {/* Main content - responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Block Palette */}
          <div className="lg:col-span-3">
            <BlockPalette onAddBlock={addBlock} disabled={isRunning} />
          </div>

          {/* Code Workspace */}
          <div className="lg:col-span-5">
            <CodeWorkspace
              blocks={blocks}
              activeBlockId={activeBlockId}
              onRemoveBlock={removeBlock}
              onUpdateBlockValue={updateBlockValue}
              onAddToLoop={addBlockToLoop}
              onRemoveFromLoop={removeBlockFromLoop}
              onClear={clearBlocks}
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
              onReset={resetStage}
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
              <p className="font-medium text-foreground">1. Lägg till block</p>
              <p>Klicka på block i paletten för att lägga till dem i ditt program.</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">2. Ordna programmet</p>
              <p>Börja med START 🟢 och avsluta med STOPP 🔴. Använd LOOP 🔄 för upprepning!</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">3. Kör programmet</p>
              <p>Tryck på KÖR och se din karaktär följa dina instruktioner!</p>
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
              description="Få karaktären att gå i en fyrkant!"
            />
            <ChallengeCard
              emoji="🦘"
              title="Hoppa 5 gånger"
              description="Använd LOOP för att hoppa 5 gånger i rad!"
            />
            <ChallengeCard
              emoji="💃"
              title="Dans-party"
              description="Skapa en dans med hopp och rörelser!"
            />
          </div>
        </div>
      </div>
    </div>
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