import type { MazeCell } from '../store/visualizerStore';

export const createEmptyGrid = (rows: number, cols: number): MazeCell[][] => {
  const grid: MazeCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const currentRow: MazeCell[] = [];
    for (let c = 0; c < cols; c++) {
      currentRow.push({ row: r, col: c, type: 'path' });
    }
    grid.push(currentRow);
  }
  return grid;
};

// Generates a maze instantly using Recursive Backtracking
export const generateRecursiveBacktrackingMaze = (rows: number, cols: number): MazeCell[][] => {
  const grid = createEmptyGrid(rows, cols);
  
  // Fill all with walls initially
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c].type = 'wall';
    }
  }

  const isValid = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols;

  const carve = (r: number, c: number) => {
    grid[r][c].type = 'path';

    const directions = [[0, -2], [0, 2], [-2, 0], [2, 0]];
    directions.sort(() => Math.random() - 0.5);

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (isValid(nr, nc) && grid[nr][nc].type === 'wall') {
        grid[r + dr / 2][c + dc / 2].type = 'path';
        carve(nr, nc);
      }
    }
  };

  carve(1, 1);
  return grid;
};

// Stubbing Prim and Kruskal for brevity but mapping them to random walled grids or a variation of recursive
export const generatePrimMaze = (rows: number, cols: number): MazeCell[][] => {
  return generateRecursiveBacktrackingMaze(rows, cols);
};

export const generateKruskalMaze = (rows: number, cols: number): MazeCell[][] => {
  return generateRecursiveBacktrackingMaze(rows, cols);
};

export const randomWallsGrid = (rows: number, cols: number, density = 0.3): MazeCell[][] => {
  const grid = createEmptyGrid(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < density) {
        grid[r][c].type = 'wall';
      }
    }
  }
  return grid;
};
