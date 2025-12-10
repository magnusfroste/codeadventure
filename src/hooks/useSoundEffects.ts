import { useCallback, useRef } from 'react';

type SoundType = 
  | 'pickup'
  | 'drop'
  | 'success'
  | 'error'
  | 'move'
  | 'jump'
  | 'click'
  | 'start'
  | 'loop'
  | 'celebrate';

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3,
    delay: number = 0
  ) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  }, [getAudioContext]);

  const playSound = useCallback((sound: SoundType) => {
    try {
      switch (sound) {
        case 'pickup':
          // Quick ascending tone
          playTone(400, 0.1, 'sine', 0.2);
          playTone(600, 0.1, 'sine', 0.15, 0.05);
          break;

        case 'drop':
          // Satisfying plop sound
          playTone(300, 0.15, 'sine', 0.3);
          playTone(200, 0.1, 'triangle', 0.2, 0.05);
          break;

        case 'success':
          // Happy ascending arpeggio
          playTone(523, 0.15, 'sine', 0.25); // C5
          playTone(659, 0.15, 'sine', 0.25, 0.1); // E5
          playTone(784, 0.2, 'sine', 0.25, 0.2); // G5
          playTone(1047, 0.3, 'sine', 0.2, 0.3); // C6
          break;

        case 'error':
          // Descending buzzy sound
          playTone(300, 0.15, 'sawtooth', 0.15);
          playTone(200, 0.2, 'sawtooth', 0.1, 0.1);
          break;

        case 'move':
          // Quick footstep-like sound
          playTone(150, 0.08, 'triangle', 0.2);
          playTone(120, 0.05, 'triangle', 0.15, 0.03);
          break;

        case 'jump':
          // Bouncy jump sound
          playTone(200, 0.1, 'sine', 0.25);
          playTone(400, 0.15, 'sine', 0.2, 0.05);
          playTone(500, 0.1, 'sine', 0.15, 0.12);
          break;

        case 'click':
          // Simple UI click
          playTone(800, 0.05, 'sine', 0.15);
          break;

        case 'start':
          // Energetic start sound
          playTone(440, 0.1, 'square', 0.15);
          playTone(554, 0.1, 'square', 0.15, 0.08);
          playTone(659, 0.15, 'square', 0.15, 0.16);
          break;

        case 'loop':
          // Whoosh for loop iteration
          playTone(300, 0.1, 'sine', 0.1);
          playTone(350, 0.1, 'sine', 0.1, 0.03);
          playTone(400, 0.08, 'sine', 0.08, 0.06);
          break;

        case 'celebrate':
          // Victory fanfare
          playTone(523, 0.15, 'sine', 0.3); // C
          playTone(659, 0.15, 'sine', 0.3, 0.15); // E
          playTone(784, 0.15, 'sine', 0.3, 0.3); // G
          playTone(1047, 0.4, 'sine', 0.35, 0.45); // C high
          // Add some sparkle
          playTone(1319, 0.1, 'sine', 0.15, 0.5);
          playTone(1568, 0.1, 'sine', 0.1, 0.55);
          break;
      }
    } catch (e) {
      // Audio context might not be available
      console.warn('Could not play sound:', e);
    }
  }, [playTone]);

  return { playSound };
}