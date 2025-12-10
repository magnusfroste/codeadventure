import { CharacterType, CHARACTER_EMOJIS, CHARACTER_NAMES } from '@/types/game';
import { cn } from '@/lib/utils';

interface CharacterSelectorProps {
  selected: CharacterType;
  onSelect: (character: CharacterType) => void;
}

const characters: CharacterType[] = ['mouse', 'princess', 'car', 'cat', 'robot'];

export function CharacterSelector({ selected, onSelect }: CharacterSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-center text-foreground">Välj din karaktär</h3>
      <div className="flex gap-3 justify-center flex-wrap">
        {characters.map((char) => (
          <button
            key={char}
            onClick={() => onSelect(char)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-xl transition-all btn-bounce touch-target',
              'border-2',
              selected === char
                ? 'bg-primary/10 border-primary shadow-lg scale-105'
                : 'bg-card border-border hover:border-primary/50 hover:bg-muted'
            )}
          >
            <span className="text-4xl">{CHARACTER_EMOJIS[char]}</span>
            <span className="text-xs font-medium text-muted-foreground">
              {CHARACTER_NAMES[char].split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}