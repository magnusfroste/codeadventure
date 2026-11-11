import { useState } from 'react';
import { CharacterType } from '@/types/game';
import { ChildProfile, getProfiles, createProfile, setActiveProfile, deleteProfile, getProfileStars } from '@/lib/profiles';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Play, Code, Star, Github, Plus, Trash2 } from 'lucide-react';

const characters = [
  { id: 'mouse', emoji: '🐭', name: 'Musen', color: 'bg-amber-200' },
  { id: 'princess', emoji: '👸', name: 'Prinsessan', color: 'bg-pink-200' },
  { id: 'car', emoji: '🚗', name: 'Bilen', color: 'bg-red-200' },
  { id: 'cat', emoji: '🐱', name: 'Katten', color: 'bg-orange-200' },
  { id: 'robot', emoji: '🤖', name: 'Roboten', color: 'bg-blue-200' },
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState('mouse');
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => getProfiles());
  const [creating, setCreating] = useState(profiles.length === 0);
  const [name, setName] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleStart = () => {
    createProfile(name || `Spelare ${profiles.length + 1}`, selectedCharacter as CharacterType);
    navigate('/map');
  };

  const pickProfile = (id: string) => {
    setActiveProfile(id);
    navigate('/map');
  };

  const removeProfile = (p: ChildProfile) => {
    if (!window.confirm(`Ta bort ${p.name} och alla framsteg?`)) return;
    deleteProfile(p.id);
    const list = getProfiles();
    setProfiles(list);
    if (list.length === 0) { setCreating(true); setEditMode(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 via-background to-secondary/20 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute top-[10%] left-[15%] w-8 h-8 text-accent animate-float opacity-60" style={{ animationDelay: '0s' }} />
        <Sparkles className="absolute top-[20%] right-[20%] w-10 h-10 text-primary animate-float opacity-50" style={{ animationDelay: '0.5s' }} />
        <Code className="absolute bottom-[25%] left-[10%] w-12 h-12 text-secondary-foreground/30 animate-float" style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-[15%] right-[15%] w-6 h-6 text-accent animate-float opacity-70" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-md w-full text-center space-y-8">
        {/* Title */}
        <div className="space-y-2 animate-bounce-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary drop-shadow-lg">
            Kodäventyret
          </h1>
          <p className="text-xl text-muted-foreground">
            Lär dig programmera genom att leka! 🎮
          </p>
        </div>

        {!creating ? (
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-border animate-fade-in space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Vem spelar? 👋</h2>
            <div className="grid grid-cols-2 gap-3">
              {profiles.map((p) => (
                <div key={p.id} className="relative">
                  <button
                    onClick={() => pickProfile(p.id)}
                    className="w-full rounded-2xl bg-primary/10 border-2 border-primary/30 p-4 touch-target btn-bounce hover:bg-primary/20"
                  >
                    <div className="text-5xl mb-1">{characters.find((c) => c.id === p.character)?.emoji}</div>
                    <div className="text-lg font-bold text-foreground truncate">{p.name}</div>
                    <div className="text-sm text-muted-foreground">⭐ {getProfileStars(p.id)}</div>
                  </button>
                  {editMode && (
                    <button
                      onClick={() => removeProfile(p)}
                      aria-label={`Ta bort ${p.name}`}
                      className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setCreating(true)}
                className="rounded-2xl border-2 border-dashed border-border p-4 touch-target text-muted-foreground hover:bg-muted flex flex-col items-center justify-center"
              >
                <Plus className="w-10 h-10" />
                <span className="font-semibold">Ny spelare</span>
              </button>
            </div>
            <button onClick={() => setEditMode(!editMode)} className="text-xs text-muted-foreground underline">
              {editMode ? 'Klar' : 'Vuxen: ta bort spelare'}
            </button>
          </div>
        ) : (
          <>
        {/* Character selection */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-border animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Vad heter du? ✏️
          </h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder="Ditt namn"
            aria-label="Ditt namn"
            className="w-full h-14 mb-5 rounded-2xl border-2 border-border bg-background px-4 text-xl text-center text-foreground focus:outline-none focus:ring-4 focus:ring-primary/40"
          />
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Välj din hjälte! 🦸
          </h2>
          <div className="flex justify-center gap-3 flex-wrap">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedCharacter(char.id)}
                className={`
                  w-16 h-16 rounded-2xl text-3xl flex items-center justify-center
                  transition-all duration-200 btn-bounce
                  ${char.color}
                  ${selectedCharacter === char.id 
                    ? 'ring-4 ring-primary scale-110 shadow-lg' 
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }
                `}
                aria-label={`Välj ${char.name}`}
              >
                {char.emoji}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {characters.find(c => c.id === selectedCharacter)?.name} är redo för äventyr!
          </p>
        </div>

        {/* Start button */}
        <Button
          onClick={handleStart}
          size="lg"
          className="w-full max-w-xs h-16 text-xl font-bold rounded-2xl shadow-lg game-shadow btn-bounce animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <Play className="w-6 h-6 mr-2" />
          Starta äventyret!
        </Button>

        {profiles.length > 0 && (
          <button onClick={() => setCreating(false)} className="block mx-auto text-muted-foreground underline">
            Tillbaka till spelarna
          </button>
        )}
          </>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4 text-left animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="text-2xl mb-1">🎯</div>
            <h3 className="font-semibold text-sm text-foreground">Hjälp hem</h3>
            <p className="text-xs text-muted-foreground">Styr karaktären till målet</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border">
            <div className="text-2xl mb-1">⭐</div>
            <h3 className="font-semibold text-sm text-foreground">Samla stjärnor</h3>
            <p className="text-xs text-muted-foreground">Klara banor och få stjärnor</p>
          </div>
        </div>

        {/* Footer with credits */}
        <footer className="mt-8 text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="mb-1">Skapad av Magnus Froste</p>
          <a 
            href="https://github.com/magnusfroste" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Github className="w-3 h-3" />
            github.com/magnusfroste
          </a>
          <p className="mt-1 opacity-70">Open Source 💚</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
