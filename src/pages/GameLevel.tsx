import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { allLevels } from '@/data/levels';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { getHint } from '@/utils/levelValidator';
import { GameGrid } from '@/components/game/GameGrid';
import { ArrowControls } from '@/components/game/ArrowControls';
import { CodeDisplay } from '@/components/game/CodeDisplay';
import { GameControls } from '@/components/game/GameControls';
import { CelebrationModal } from '@/components/game/CelebrationModal';
import { FailureModal } from '@/components/game/FailureModal';
import { LevelHeader } from '@/components/game/LevelHeader';
import { Direction } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Lightbulb } from 'lucide-react';

export default function GameLevel() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { progress, completeLevel, getLevelStars, isLevelUnlocked } = useGameProgress();
  const { playSound } = useSoundEffects();

  const levelIndex = parseInt(levelId || '1', 10) - 1;
  const level = allLevels[levelIndex];

  const [showCelebration, setShowCelebration] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [earnedStars, setEarnedStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHint, setShowHint] = useState(false);

  // Återställ lokala states när nivån ändras
  useEffect(() => {
    setShowCelebration(false);
    setShowFailure(false);
    setFailureMessage('');
    setEarnedStars(0);
    setShowHint(false);
  }, [levelId]);

  const {
    gameState,
    resetGame,
    addDirection,
    clearCode,
    runCode,
    executeMove,
    calculateStars,
  } = useGameEngine(level, progress.selectedCharacter);

  useEffect(() => {
    if (!level || !isLevelUnlocked(level.id)) {
      navigate('/map');
    }
  }, [level, isLevelUnlocked, navigate]);

  const handleDirectionGuided = useCallback(
    async (direction: Direction) => {
      if (soundEnabled) playSound('move');
      const result = await executeMove(direction);
      if (result.reachedHome) {
        const stars = calculateStars(gameState.code.length + 1);
        setEarnedStars(stars);
        completeLevel(level.id, stars);
        if (soundEnabled) playSound('celebrate');
        setShowCelebration(true);
      } else if (!result.success) {
        if (soundEnabled) playSound('error');
        setFailureMessage('Oj! Där kan du inte gå. Prova en annan väg! 🤔');
        setShowFailure(true);
      }
    },
    [executeMove, calculateStars, gameState.code.length, completeLevel, level?.id, soundEnabled, playSound]
  );

  const handleDirectionPlan = useCallback(
    (direction: Direction) => {
      if (soundEnabled) playSound('click');
      addDirection(direction);
    },
    [addDirection, soundEnabled, playSound]
  );

  const handleRunCode = useCallback(async () => {
    if (soundEnabled) playSound('start');
    const result = await runCode();
    
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (gameState.characterPosition.x === level.homePosition.x && 
        gameState.characterPosition.y === level.homePosition.y) {
      return;
    }

    if (result.success) {
      const finalState = gameState;
      if (finalState.isComplete) {
        const stars = calculateStars(result.stepsUsed);
        setEarnedStars(stars);
        completeLevel(level.id, stars);
        if (soundEnabled) playSound('celebrate');
        setShowCelebration(true);
      }
    } else {
      if (soundEnabled) playSound('error');
      setFailureMessage('Hoppsan! Du kom inte hela vägen hem. Försök igen! 💪');
      setShowFailure(true);
    }
  }, [runCode, gameState, level, calculateStars, completeLevel, soundEnabled, playSound]);

  // Monitor for completion
  useEffect(() => {
    if (gameState.isComplete && !showCelebration) {
      const stars = calculateStars(gameState.code.length);
      setEarnedStars(stars);
      completeLevel(level.id, stars);
      if (soundEnabled) playSound('celebrate');
      setShowCelebration(true);
    }
  }, [gameState.isComplete, gameState.code.length, calculateStars, completeLevel, level?.id, showCelebration, soundEnabled, playSound]);

  const handleReset = useCallback(() => {
    if (soundEnabled) playSound('click');
    resetGame();
    setShowCelebration(false);
    setShowFailure(false);
    setShowHint(false);
  }, [resetGame, soundEnabled, playSound]);

  const handleShowHint = useCallback(() => {
    if (soundEnabled) playSound('click');
    setShowHint(true);
  }, [soundEnabled, playSound]);

  const hint = level ? getHint(level) : null;

  const handleNextLevel = useCallback(() => {
    if (soundEnabled) playSound('success');
    setShowCelebration(false);
    if (levelIndex < allLevels.length - 1) {
      navigate(`/level/${level.id + 1}`);
    } else {
      navigate('/map');
    }
  }, [navigate, level?.id, levelIndex, soundEnabled, playSound]);

  if (!level) return null;

  const isGuided = level.mode === 'guided';
  const isPlanOrMaster = level.mode === 'plan' || level.mode === 'master';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <LevelHeader
            level={level}
            earnedStars={getLevelStars(level.id)}
            onBack={() => navigate('/map')}
          />
          <div className="flex gap-2">
            {hint && !showHint && (
              <Button
                onClick={handleShowHint}
                variant="outline"
                size="icon"
                className="rounded-xl"
                title="Visa ledtråd"
              >
                <Lightbulb className="w-5 h-5 text-accent" />
              </Button>
            )}
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              size="icon"
              className="rounded-xl"
              title={soundEnabled ? 'Stäng av ljud' : 'Slå på ljud'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
          {/* Game Grid */}
          <div className="flex-shrink-0">
            <GameGrid
              grid={level.grid}
              characterPosition={gameState.characterPosition}
              homePosition={level.homePosition}
              character={progress.selectedCharacter}
              gridSize={level.gridSize}
            />
          </div>

          {/* Controls Panel */}
          <div className="space-y-6 w-full max-w-md">
            {/* Code Display */}
            <CodeDisplay code={gameState.code} />

            {/* Arrow Controls */}
            <div className="flex justify-center">
              <ArrowControls
                onDirection={isGuided ? handleDirectionGuided : handleDirectionPlan}
                disabled={gameState.isRunning || gameState.isComplete}
              />
            </div>

            {/* Game Controls */}
            <GameControls
              onRun={handleRunCode}
              onReset={handleReset}
              onClear={() => {
                if (soundEnabled) playSound('click');
                clearCode();
              }}
              canRun={gameState.code.length > 0 && !gameState.isComplete}
              canClear={gameState.code.length > 0}
              isRunning={gameState.isRunning}
              showRunButton={isPlanOrMaster}
            />
          </div>
        </div>

        {/* Mode-specific hint */}
        <div className="text-center space-y-2">
          {showHint && hint && (
            <div className="bg-accent/20 border-2 border-accent/40 rounded-xl p-3 inline-block">
              <p className="text-foreground text-lg font-medium">{hint}</p>
            </div>
          )}
          {isGuided && (
            <p className="text-muted-foreground text-lg">
              💡 Tryck på pilarna för att guida {progress.selectedCharacter === 'mouse' ? 'musen' : 'karaktären'} hem!
            </p>
          )}
          {isPlanOrMaster && (
            <p className="text-muted-foreground text-lg">
              💡 Lägg till pilar för att skapa din kod, sedan tryck KÖR!
            </p>
          )}
        </div>
      </div>

      <CelebrationModal
        open={showCelebration}
        stars={earnedStars}
        levelName={level.name}
        onNextLevel={handleNextLevel}
        onRetry={handleReset}
        hasNextLevel={levelIndex < allLevels.length - 1}
      />

      <FailureModal
        open={showFailure}
        onRetry={handleReset}
        onClose={() => setShowFailure(false)}
        message={failureMessage}
      />
    </div>
  );
}