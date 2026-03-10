import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { useVisualizerStore } from '../../store/visualizerStore';

export const Controls: React.FC = () => {
  const {
    isPlaying,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    speed,
    setSpeed,
    currentStepIndex,
    steps,
    isFinished
  } = useVisualizerStore();

  const progress = steps.length > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4 flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-slate-400 w-12 text-right">Progress</span>
        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <span className="text-sm font-medium text-slate-400 w-16 text-left">
          {currentStepIndex} / {Math.max(0, steps.length - 1)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="flex items-center space-x-3 w-full sm:w-1/3 justify-center sm:justify-start">
          <span className="text-sm font-medium text-slate-400">Speed</span>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 sm:w-32 accent-green-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-1/3 justify-center">
          <button 
            onClick={reset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
          
          <button 
            onClick={prevStep}
            disabled={currentStepIndex === 0 || isPlaying}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Step Backward"
          >
            <SkipBack size={20} />
          </button>

          <button 
            onClick={togglePlay}
            disabled={steps.length === 0}
            className={`p-3 rounded-full text-white transition-all transform hover:scale-105 ${isPlaying ? 'bg-amber-500 hover:bg-amber-400' : 'bg-green-500 hover:bg-green-400'} disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>

          <button 
            onClick={nextStep}
            disabled={isFinished || isPlaying || steps.length === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Step Forward"
          >
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="hidden sm:block w-1/3">
          {/* Placeholder for right side alignment */}
        </div>
      </div>
    </div>
  );
};
