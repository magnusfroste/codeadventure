import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { CHARACTER_EMOJIS, CharacterType } from '@/types/game';

interface TutorialBubbleProps {
  levelId: number;
  mode: 'guided' | 'plan' | 'master';
  character: CharacterType;
}

const TUTORIALS: Record<string, { title: string; text: string }> = {
  'guided-1': {
    title: 'Välkommen! 🎉',
    text: 'Tryck på pilarna för att flytta mig till hemmet 🏠. En pil i taget!',
  },
  'plan-first': {
    title: 'Nytt läge! 🧠',
    text: 'Nu planerar du hela vägen först! Lägg till pilar och tryck sedan KÖR för att se om det stämmer.',
  },
  'master-first': {
    title: 'Mästarläge! 🏆',
    text: 'Akta hinder 🪨 och samla stjärnor ⭐ på vägen! Planera noga.',
  },
};

const SEEN_KEY = 'kodaventyret-tutorials-seen';

function getSeenTutorials(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
  } catch {
    return [];
  }
}

function markSeen(key: string) {
  const seen = getSeenTutorials();
  if (!seen.includes(key)) {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, key]));
  }
}

function getTutorialKey(levelId: number, mode: string): string | null {
  if (mode === 'guided' && levelId === 1) return 'guided-1';
  if (mode === 'plan') {
    const seen = getSeenTutorials();
    if (!seen.includes('plan-first')) return 'plan-first';
  }
  if (mode === 'master') {
    const seen = getSeenTutorials();
    if (!seen.includes('master-first')) return 'master-first';
  }
  return null;
}

export function TutorialBubble({ levelId, mode, character }: TutorialBubbleProps) {
  const [visible, setVisible] = useState(false);
  const [tutorialKey, setTutorialKey] = useState<string | null>(null);

  useEffect(() => {
    const key = getTutorialKey(levelId, mode);
    if (key && !getSeenTutorials().includes(key)) {
      setTutorialKey(key);
      setVisible(true);
    } else {
      setVisible(false);
      setTutorialKey(null);
    }
  }, [levelId, mode]);

  const handleDismiss = () => {
    if (tutorialKey) markSeen(tutorialKey);
    setVisible(false);
  };

  if (!visible || !tutorialKey) return null;

  const tutorial = TUTORIALS[tutorialKey];
  if (!tutorial) return null;

  return (
    <div className="relative bg-card border-2 border-primary/40 rounded-2xl p-4 shadow-lg animate-bounce-in max-w-sm mx-auto">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 w-8 h-8 rounded-full"
        onClick={handleDismiss}
      >
        <X className="w-4 h-4" />
      </Button>
      <div className="flex items-start gap-3">
        <span className="text-4xl flex-shrink-0">{CHARACTER_EMOJIS[character]}</span>
        <div>
          <p className="font-bold text-foreground">{tutorial.title}</p>
          <p className="text-muted-foreground text-sm mt-1">{tutorial.text}</p>
        </div>
      </div>
      {/* Speech bubble tail */}
      <div className="absolute -bottom-2 left-8 w-4 h-4 bg-card border-b-2 border-r-2 border-primary/40 rotate-45" />
    </div>
  );
}
