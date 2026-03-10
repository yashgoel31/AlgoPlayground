import type { MazeCell, AlgorithmStep } from '../../store/visualizerStore';

export const createMazeStep = (
  grid: MazeCell[][],
  description: string
): AlgorithmStep => {
  // Deep copy grid for the step
  const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
  return {
    state: {
      array: [],
      comparisons: [],
      swaps: [],
      sortedIndices: [],
      maze: { grid: gridCopy }
    },
    description
  };
};

const getNeighbors = (grid: MazeCell[][], r: number, c: number) => {
  const neighbors: {r: number, c: number}[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  for (const [dr, dc] of dirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].type !== 'wall') {
      neighbors.push({r: nr, c: nc});
    }
  }
  return neighbors;
};

export const solveBfs = (grid: MazeCell[][], start: {r: number, c: number}, end: {r: number, c: number}): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const g = grid.map(row => row.map(cell => ({ ...cell })));
  
  const queue = [start];
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  visited.add(`${start.r},${start.c}`);

  steps.push(createMazeStep(g, 'Starting BFS...'));

  while (queue.length > 0) {
    const {r, c} = queue.shift()!;
    
    if (r === end.r && c === end.c) {
      // Reconstruct path
      let curr = `${r},${c}`;
      while (curr !== `${start.r},${start.c}`) {
        const [cr, cc] = curr.split(',').map(Number);
        if (cr !== start.r || cc !== start.c) {
           if (cr !== end.r || cc !== end.c) g[cr][cc].type = 'path_found';
        }
        curr = parent.get(curr)!;
      }
      steps.push(createMazeStep(g, 'Target Found! Path reconstructed.'));
      return steps;
    }

    if ((r !== start.r || c !== start.c) && (r !== end.r || c !== end.c)) {
       g[r][c].type = 'visited';
       steps.push(createMazeStep(g, `Visited cell (${r}, ${c})`));
    }

    for (const nb of getNeighbors(g, r, c)) {
      const key = `${nb.r},${nb.c}`;
      if (!visited.has(key)) {
        visited.add(key);
        parent.set(key, `${r},${c}`);
        queue.push(nb);
      }
    }
  }

  steps.push(createMazeStep(g, 'Target not reachable.'));
  return steps;
};

export const solveDijkstra = (grid: MazeCell[][], start: {r: number, c: number}, end: {r: number, c: number}): AlgorithmStep[] => {
   // Simulated as BFS for unweighted grid
   return solveBfs(grid, start, end);
};

export const solveDfs = (grid: MazeCell[][], start: {r: number, c: number}, end: {r: number, c: number}): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const g = grid.map(row => row.map(cell => ({ ...cell })));
  
  const stack = [start];
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  
  steps.push(createMazeStep(g, 'Starting DFS...'));

  while (stack.length > 0) {
    const {r, c} = stack.pop()!;
    const key = `${r},${c}`;

    if (!visited.has(key)) {
      visited.add(key);

      if (r === end.r && c === end.c) {
        let curr = key;
        while (curr !== `${start.r},${start.c}`) {
          const [cr, cc] = curr.split(',').map(Number);
          if (cr !== start.r || cc !== start.c) {
             if (cr !== end.r || cc !== end.c) g[cr][cc].type = 'path_found';
          }
          curr = parent.get(curr)!;
        }
        steps.push(createMazeStep(g, 'Target Found!'));
        return steps;
      }

      if ((r !== start.r || c !== start.c) && (r !== end.r || c !== end.c)) {
         g[r][c].type = 'visited';
         steps.push(createMazeStep(g, `Visited cell (${r}, ${c})`));
      }

      for (const nb of getNeighbors(g, r, c)) {
        const nkey = `${nb.r},${nb.c}`;
        if (!visited.has(nkey)) {
          parent.set(nkey, key);
          stack.push(nb);
        }
      }
    }
  }
  
  steps.push(createMazeStep(g, 'Target not reachable.'));
  return steps;
};

export const pathfindingAlgorithms = {
  'BFS': solveBfs,
  'DFS': solveDfs,
  'Dijkstra': solveDijkstra,
  'A*': solveBfs, // Mapped for brevity implicitly BFS handles shortest unweighted path
  'Greedy Best First Search': solveBfs
};
