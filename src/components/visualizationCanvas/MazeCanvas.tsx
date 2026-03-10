import React from 'react';
import type { MazeCell } from '../../store/visualizerStore';
import { useVisualizerStore } from '../../store/visualizerStore';

interface MazeCanvasProps {
  interactiveGrid?: MazeCell[][];
  onNodeClick?: (r: number, c: number) => void;
  onNodeEnter?: (r: number, c: number) => void;
  isMouseDown?: boolean;
}

export const MazeCanvas: React.FC<MazeCanvasProps> = ({ interactiveGrid, onNodeClick, onNodeEnter }) => {
  const { steps, currentStepIndex } = useVisualizerStore();
  
  const currentState = steps.length > 0 ? steps[currentStepIndex].state : null;
  const grid = currentState?.maze?.grid || interactiveGrid;

  if (!grid || grid.length === 0) {
    return <div className="flex-1 flex justify-center items-center">No Grid Data</div>;
  }

  const getCellClasses = (type: string) => {
    switch (type) {
      case 'wall': return 'bg-slate-700 hover:bg-slate-600 scale-100 border border-slate-600';
      case 'start': return 'bg-green-500 hover:bg-green-400 scale-105 shadow-lg shadow-green-500/50 z-10 border-2 border-green-300';
      case 'end': return 'bg-rose-500 hover:bg-rose-400 scale-105 shadow-lg shadow-rose-500/50 z-10 border-2 border-rose-300';
      case 'visited': return 'bg-cyan-500/40 border border-cyan-500/20'; // Semi transparent trail
      case 'path_found': return 'bg-amber-400 border-2 border-amber-300 scale-105 z-10'; // Final track
      case 'current': return 'bg-purple-500 border border-purple-400';
      default: return 'bg-slate-900 border border-slate-800 hover:bg-slate-800'; // Path
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-950 flex flex-col items-center justify-center relative p-8">
      {steps.length > 0 && (
         <div className="absolute top-8 text-center max-w-2xl bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-xl backdrop-blur-sm z-20">
           <p className="text-amber-400 font-mono text-sm">
             {steps[currentStepIndex]?.description}
           </p>
         </div>
      )}

      {/* Grid container */}
      <div 
         className="inline-flex flex-col bg-slate-800 shadow-xl rounded overflow-hidden"
         onMouseLeave={() => { /* Handle drag exit if necessary */ }}
      >
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => onNodeClick?.(r, c)}
                onMouseEnter={() => onNodeEnter?.(r, c)}
                className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-200 cursor-pointer ${getCellClasses(cell.type)}`}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800 backdrop-blur-sm text-xs text-slate-400 flex-wrap max-w-[90%]">
         <div className="flex items-center"><div className="w-4 h-4 bg-green-500 border-2 border-green-300 rounded-sm mr-2" /> Start</div>
         <div className="flex items-center"><div className="w-4 h-4 bg-rose-500 border-2 border-rose-300 rounded-sm mr-2" /> End</div>
         <div className="flex items-center"><div className="w-4 h-4 bg-slate-700 border border-slate-600 rounded-sm mr-2" /> Wall</div>
         <div className="flex items-center"><div className="w-4 h-4 bg-cyan-500/40 border border-cyan-500/20 rounded-sm mr-2" /> Visited</div>
         <div className="flex items-center"><div className="w-4 h-4 bg-amber-400 border-2 border-amber-300 rounded-sm mr-2" /> Shortest Path</div>
      </div>
    </div>
  );
};
