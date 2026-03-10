import React from 'react';
import { motion } from 'framer-motion';
import { useVisualizerStore } from '../../store/visualizerStore';

export const SearchingCanvas: React.FC = () => {
  const { array, steps, currentStepIndex } = useVisualizerStore();

  const currentState = steps.length > 0 ? steps[currentStepIndex].state : {
    array, comparisons: [], swaps: [], sortedIndices: [], pivot: undefined
  };

  const currentArray = currentState.array || array;

  const getBoxColor = (index: number) => {
    if (currentState.sortedIndices?.includes(index)) return 'bg-green-500 border-green-400 text-white'; // Found
    if (currentState.pivot === index) return 'bg-purple-500 border-purple-400 text-white'; // Mid pivot
    if (currentState.comparisons?.includes(index)) return 'bg-amber-500 border-amber-400 text-white'; // Boundaries or checking
    if (currentState.swaps?.includes(index)) return 'bg-red-500 border-red-400 text-white'; // Discarded or checked negative
    return 'bg-slate-800 border-slate-700 text-slate-300'; // Default
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-8 bg-slate-950 overflow-hidden relative min-h-[400px]">
      {steps.length > 0 && (
         <div className="absolute top-8 text-center max-w-2xl bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-xl backdrop-blur-sm z-10">
           <h3 className="text-slate-100 text-lg font-semibold mb-1">
             Action:
           </h3>
           <p className="text-amber-400 font-mono text-sm">
             {steps[currentStepIndex]?.description}
           </p>
         </div>
      )}
      
      <div className="flex flex-wrap gap-2 max-w-5xl justify-center items-center mt-20">
        {currentArray.map((value, idx) => (
          <motion.div
            key={`${idx}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 shadow-sm font-mono font-bold text-sm sm:text-base transition-colors duration-300 ${getBoxColor(idx)}`}
          >
            {value}
            <span className="absolute -bottom-5 text-[10px] text-slate-500 opacity-50">{idx}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-8 flex items-center space-x-6 bg-slate-900/50 p-3 rounded-full border border-slate-800 backdrop-blur-sm text-xs text-slate-400">
         <div className="flex items-center"><div className="w-3 h-3 bg-amber-500 rounded mr-2" /> Compare / Bounds</div>
         <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 rounded mr-2" /> Mid</div>
         <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-2" /> Target Found</div>
         <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded mr-2" /> Checked (Not target)</div>
      </div>
    </div>
  );
};
