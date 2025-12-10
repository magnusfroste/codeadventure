import { useNavigate } from 'react-router-dom';
import { allLevels } from '@/data/levels';
import { useGameProgress } from '@/hooks/useGameProgress';
import { Star, Lock, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdventureMap() {
  const navigate = useNavigate();
  const { progress, getLevelStars, isLevelUnlocked } = useGameProgress();

  const totalStars = Object.values(progress.levelStars).reduce((a, b) => a + b, 0);
  const maxStars = allLevels.length * 3;
  const hasCompletedPhase1 = totalStars >= 9; // At least 3 levels with 3 stars each

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            🎮 Kodäventyret
          </h1>
          <p className="text-xl text-muted-foreground">
            Lär dig programmera genom att guida karaktären hem!
          </p>
          
          {/* Total Stars */}
          <div className="inline-flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-md">
            <Trophy className="w-6 h-6 text-game-coin" />
            <span className="text-xl font-bold text-foreground">
              {totalStars} / {maxStars}
            </span>
            <Star className="w-6 h-6 fill-game-coin text-game-coin" />
          </div>
        </div>

        {/* Phase 1: Arrow Code Adventure - First */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground text-center">
            🎯 Fas 1: Pilkod-äventyret
          </h2>

          {/* Guided Levels */}
          <LevelSection
            title="🌱 Nivå 1-3: Första stegen"
            description="Guidad läge - lär dig grunderna!"
            levels={allLevels.slice(0, 3)}
            getLevelStars={getLevelStars}
            isLevelUnlocked={isLevelUnlocked}
            onSelectLevel={(id) => navigate(`/level/${id}`)}
          />

          {/* Plan Levels */}
          <LevelSection
            title="🧠 Nivå 4-6: Tänk först!"
            description="Planera din kod innan du kör!"
            levels={allLevels.slice(3, 6)}
            getLevelStars={getLevelStars}
            isLevelUnlocked={isLevelUnlocked}
            onSelectLevel={(id) => navigate(`/level/${id}`)}
          />

          {/* Master Levels */}
          <LevelSection
            title="🏆 Nivå 7-9: Mästarbanor"
            description="Hinder, mynt och utmaningar!"
            levels={allLevels.slice(6, 9)}
            getLevelStars={getLevelStars}
            isLevelUnlocked={isLevelUnlocked}
            onSelectLevel={(id) => navigate(`/level/${id}`)}
          />
        </div>

        {/* Phase 2: Scratch Programming - Locked until 9 stars */}
        {hasCompletedPhase1 ? (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 shadow-lg border-2 border-purple-500/30 animate-scale-in">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="text-5xl">✨</div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  Fas 2: Blockprogrammering
                  <span className="text-sm bg-green-500/20 text-green-600 px-2 py-1 rounded-full">UPPLÅST!</span>
                </h2>
                <p className="text-muted-foreground mt-1">
                  Skapa egna program med drag-and-drop block! Lär dig loopar och sekvenser.
                </p>
                <Button
                  onClick={() => navigate('/scratch')}
                  className="mt-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Öppna blockprogrammering
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 rounded-2xl p-6 shadow-lg border-2 border-muted">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="text-5xl opacity-50">🔒</div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-2xl font-bold text-muted-foreground flex items-center gap-2">
                  <Lock className="w-6 h-6" />
                  Fas 2: Blockprogrammering
                </h2>
                <p className="text-muted-foreground mt-1">
                  Skapa egna program med drag-and-drop block! Lär dig loopar och sekvenser.
                </p>
                
                {/* Progress indicator */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-game-coin text-game-coin" />
                    <span>Samla <strong className="text-foreground">{9 - totalStars}</strong> stjärnor till för att låsa upp!</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-game-coin to-yellow-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((totalStars / 9) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">{totalStars}/9 stjärnor</p>
                </div>

                <Button
                  disabled
                  className="mt-4 bg-muted text-muted-foreground rounded-xl cursor-not-allowed"
                  size="lg"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Låst
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground"
          >
            ← Tillbaka till start
          </Button>
        </div>
      </div>
    </div>
  );
}

interface LevelSectionProps {
  title: string;
  description: string;
  levels: typeof allLevels;
  getLevelStars: (id: number) => number;
  isLevelUnlocked: (id: number) => boolean;
  onSelectLevel: (id: number) => void;
}

function LevelSection({
  title,
  description,
  levels,
  getLevelStars,
  isLevelUnlocked,
  onSelectLevel,
}: LevelSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id);
          const stars = getLevelStars(level.id);

          return (
            <button
              key={level.id}
              onClick={() => unlocked && onSelectLevel(level.id)}
              disabled={!unlocked}
              className={cn(
                'relative p-6 rounded-2xl transition-all btn-bounce touch-target',
                'border-2 text-left',
                unlocked
                  ? 'bg-card border-primary/30 hover:border-primary hover:shadow-lg cursor-pointer'
                  : 'bg-muted border-border cursor-not-allowed opacity-60'
              )}
            >
              {/* Lock icon for locked levels */}
              {!unlocked && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
              )}

              {/* Level number */}
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-3',
                unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
              )}>
                {level.id}
              </div>

              {/* Level info */}
              <h3 className="text-lg font-bold text-foreground mb-1">
                {level.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {level.description}
              </p>

              {/* Stars */}
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i <= stars ? 'fill-game-coin text-game-coin' : 'text-muted'
                    )}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}