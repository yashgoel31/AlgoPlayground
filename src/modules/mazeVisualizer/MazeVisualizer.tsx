import React, { useEffect, useState } from 'react';
import type { MazeCell } from '../../store/visualizerStore';
import { useVisualizerStore } from '../../store/visualizerStore';
import { createEmptyGrid, generateRecursiveBacktrackingMaze, randomWallsGrid } from '../../utils/mazeHelpers';
import { pathfindingAlgorithms } from '../../algorithms/pathfinding/algorithms';
import { MazeCanvas } from '../../components/visualizationCanvas/MazeCanvas';
import { Controls } from '../../components/controls/Controls';
import { useAnimationEngine } from '../../core/animationEngine';

type DrawingMode = 'wall' | 'clear' | 'start' | 'end';

export const MazeVisualizer: React.FC = () => {
  const { algorithmName, setAlgorithmName, setSteps, isPlaying } = useVisualizerStore();
  const [rows] = useState(15);
  const [cols] = useState(25);
  const [grid, setGrid] = useState<MazeCell[][]>([]);
  const [startPos, setStartPos] = useState({ r: 1, c: 1 });
  const [endPos, setEndPos] = useState({ r: 13, c: 23 });
  
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('wall');
  const [isMouseDown, setIsMouseDown] = useState(false);

  useAnimationEngine();

  useEffect(() => {
    if (!algorithmName || !Object.keys(pathfindingAlgorithms).includes(algorithmName)) {
       setAlgorithmName('BFS');
    }
    handleClearBoard();
    
    const handleMouseUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateGridCell = (r: number, c: number, type: 'wall' | 'path' | 'start' | 'end') => {
    if (r === startPos.r && c === startPos.c && type !== 'start') return;
    if (r === endPos.r && c === endPos.c && type !== 'end') return;

    setGrid(prev => {
      const newGrid = prev.map(row => row.map(cell => ({ ...cell })));
      // Reset old start/end visual if moving them
      if (type === 'start') {
        newGrid[startPos.r][startPos.c].type = 'path';
        setStartPos({ r, c });
      }
      if (type === 'end') {
        newGrid[endPos.r][endPos.c].type = 'path';
        setEndPos({ r, c });
      }
      
      newGrid[r][c].type = type;
      return newGrid;
    });
  };

  const handleNodeClick = (r: number, c: number) => {
    if (isPlaying) return;
    setIsMouseDown(true);
    applyDrawing(r, c);
  };

  const handleNodeEnter = (r: number, c: number) => {
    if (!isMouseDown || isPlaying) return;
    applyDrawing(r, c);
  };

  const applyDrawing = (r: number, c: number) => {
    if (drawingMode === 'wall') updateGridCell(r, c, 'wall');
    else if (drawingMode === 'clear') updateGridCell(r, c, 'path');
    else if (drawingMode === 'start') updateGridCell(r, c, 'start');
    else if (drawingMode === 'end') updateGridCell(r, c, 'end');
  };

  const handleClearBoard = () => {
    const fresh = createEmptyGrid(rows, cols);
    // Ensure start/end are within bounds if resized
    const sr = Math.min(startPos.r, rows - 1);
    const sc = Math.min(startPos.c, cols - 1);
    const er = Math.min(endPos.r, rows - 1);
    const ec = Math.min(endPos.c, cols - 1);
    
    setStartPos({ r: sr, c: sc });
    setEndPos({ r: er, c: ec });
    fresh[sr][sc].type = 'start';
    fresh[er][ec].type = 'end';
    
    setGrid(fresh);
    useVisualizerStore.getState().reset();
  };

  const handleClearPath = () => {
     setGrid(prev => {
        const newGrid = prev.map(row => row.map(cell => {
          if (cell.type === 'visited' || cell.type === 'path_found' || cell.type === 'current') {
            return { ...cell, type: 'path' as const };
          }
          return cell;
        }));
        // Ensure start and end are enforced
        newGrid[startPos.r][startPos.c].type = 'start';
        newGrid[endPos.r][endPos.c].type = 'end';
        return newGrid;
     });
     useVisualizerStore.getState().reset();
  };

  const handleGenerateMaze = (type: 'recursive' | 'random') => {
     const mazeGen = type === 'recursive' ? generateRecursiveBacktrackingMaze(rows, cols) : randomWallsGrid(rows, cols, 0.3);
     mazeGen[startPos.r][startPos.c].type = 'start';
     mazeGen[endPos.r][endPos.c].type = 'end';
     setGrid(mazeGen);
     useVisualizerStore.getState().reset();
  };

  const handleVisualize = () => {
    handleClearPath(); // clean old searches
    const alg = pathfindingAlgorithms[algorithmName as keyof typeof pathfindingAlgorithms] || pathfindingAlgorithms['BFS'];
    
    // Pass current drawn grid into the visualizer state
    const cleanGrid = grid.map(row => row.map(cell => ({ ...cell })));
    setSteps(alg(cleanGrid, startPos, endPos));
  };

  const algos = Object.keys(pathfindingAlgorithms);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 flex-1 user-select-none" style={{ userSelect: 'none' }}>
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-wrap justify-between items-center gap-4">
        
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Solver:</label>
          <select 
            value={algorithmName} 
            onChange={(e) => setAlgorithmName(e.target.value)}
            disabled={isPlaying}
            className="flex-1 sm:w-auto bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2 outline-none focus:border-green-500 disabled:opacity-50"
          >
            {algos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button 
             onClick={handleVisualize}
             disabled={isPlaying}
             className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white shadow shadow-green-900 text-sm font-bold rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap"
          >
             Visualize!
          </button>
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          
          {/* Drawing Mode Segmented Control */}
          <div className="flex flex-wrap bg-slate-800 rounded-lg p-1 border border-slate-700 w-full sm:w-auto gap-1">
            {(['wall', 'clear', 'start', 'end'] as DrawingMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setDrawingMode(mode)}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-1 text-xs font-semibold rounded-md capitalize transition-colors ${drawingMode === mode ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button onClick={() => handleGenerateMaze('recursive')} disabled={isPlaying} className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] sm:text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap">
            Maze (Backtrack)
          </button>
          <button onClick={() => handleGenerateMaze('random')} disabled={isPlaying} className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] sm:text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap">
            Random Walls
          </button>
          
          <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block"></div>
          
          <button onClick={handleClearBoard} disabled={isPlaying} className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-[10px] sm:text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap">
            Clear Board
          </button>
          <button onClick={handleClearPath} disabled={isPlaying} className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-[10px] sm:text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap">
            Clear Path
          </button>

        </div>
      </div>

      <div 
        className="flex-1 flex w-full relative min-h-0 min-w-0"
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
      >
         <MazeCanvas 
            interactiveGrid={grid}
            onNodeClick={handleNodeClick}
            onNodeEnter={handleNodeEnter}
            isMouseDown={isMouseDown}
         />
      </div>

      <Controls />
    </div>
  );
};
