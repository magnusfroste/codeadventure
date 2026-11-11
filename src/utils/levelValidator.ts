import { Level, Position } from '@/types/game';

interface ValidationResult {
  isValid: boolean;
  path: Position[] | null;
  error?: string;
}

export function findPath(level: Level): Position[] | null {
  const stops = [...(level.goals ?? []).map((g) => g.position), level.homePosition];
  let from = level.startPosition;
  let full: Position[] = [from];
  for (const stop of stops) {
    const seg = findSegment(level, from, stop);
    if (!seg) return null;
    full = [...full, ...seg.slice(1)];
    from = stop;
  }
  return full;
}

function findSegment(level: Level, startPosition: Position, homePosition: Position): Position[] | null {
  const { grid, gridSize } = level;
  
  const visited = new Set<string>();
  const queue: { pos: Position; path: Position[] }[] = [
    { pos: startPosition, path: [startPosition] }
  ];
  
  const posKey = (p: Position) => `${p.x},${p.y}`;
  visited.add(posKey(startPosition));
  
  const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 },  // down
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 },  // right
  ];
  
  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    
    if (pos.x === homePosition.x && pos.y === homePosition.y) {
      return path;
    }
    
    for (const { dx, dy } of directions) {
      const nextPos: Position = { x: pos.x + dx, y: pos.y + dy };
      const key = posKey(nextPos);
      
      if (visited.has(key)) continue;
      if (nextPos.x < 0 || nextPos.x >= gridSize || nextPos.y < 0 || nextPos.y >= gridSize) continue;
      
      const cell = grid[nextPos.y][nextPos.x];
      if (cell.type === 'grass' || cell.type === 'water' || cell.hasObstacle) continue;
      
      visited.add(key);
      queue.push({ pos: nextPos, path: [...path, nextPos] });
    }
  }
  
  return null;
}

export function validateLevel(level: Level): ValidationResult {
  const path = findPath(level);
  
  if (!path) {
    return {
      isValid: false,
      path: null,
      error: `Nivå ${level.id} (${level.name}) har ingen giltig väg från start till mål!`
    };
  }
  
  return {
    isValid: true,
    path,
  };
}

export function validateAllLevels(levels: Level[]): void {
  console.group('%c🔍 NIVÅVALIDERING', 'font-size: 14px; font-weight: bold; color: #3b82f6;');
  let allValid = true;
  const results: string[] = [];
  
  for (const level of levels) {
    const result = validateLevel(level);
    if (!result.isValid) {
      console.error(`❌ OLÖSBAR: Nivå ${level.id} (${level.name}) - ${result.error}`);
      results.push(`❌ Nivå ${level.id}: OLÖSBAR`);
      allValid = false;
    } else {
      const pathLength = result.path!.length - 1;
      const efficiency = pathLength === level.optimalMoves ? '⭐ PERFEKT' : pathLength < level.optimalMoves ? '🔧 KONTROLLERA optimalMoves' : '✅ OK';
      console.log(`✅ Nivå ${level.id} (${level.name}): ${efficiency} - Kortaste väg: ${pathLength} steg (optimal: ${level.optimalMoves})`);
      results.push(`✅ Nivå ${level.id}: ${pathLength} steg`);
    }
  }
  
  console.groupEnd();
  
  if (allValid) {
    console.log('%c🎉 Alla nivåer är giltiga!', 'font-size: 12px; font-weight: bold; color: #22c55e;');
  } else {
    console.error('%c⚠️ VARNING: Några nivåer är olösbara!', 'font-size: 14px; font-weight: bold; color: #ef4444;');
  }
}

export function getHint(level: Level): string | null {
  const path = findPath(level);
  if (!path || path.length < 2) return null;
  
  const directions: string[] = [];
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    
    if (curr.x > prev.x) directions.push('höger');
    else if (curr.x < prev.x) directions.push('vänster');
    else if (curr.y > prev.y) directions.push('ned');
    else if (curr.y < prev.y) directions.push('upp');
  }
  
  // Return first direction as a hint
  return directions[0] ? `Prova att gå ${directions[0]} först! 🤔` : null;
}
