import React from 'react';
import { motion } from 'framer-motion';
import { useVisualizerStore } from '../../store/visualizerStore';

export const SortingCanvas2D: React.FC = () => {
  const { array, steps, currentStepIndex } = useVisualizerStore();

  const currentState = steps.length > 0 ? steps[currentStepIndex].state : {
    array, comparisons: [], swaps: [], sortedIndices: []
  };

  const currentArray = currentState.array || array;

  const getBarColor = (index: number) => {
    if (currentState.swaps?.includes(index)) return '#ef4444'; // Error/Red for swap
    if (currentState.comparisons?.includes(index)) return '#f59e0b'; // Highlight/Yellow for compare
    if (currentState.sortedIndices?.includes(index)) return '#22c55e'; // Primary/Green for sorted
    if (currentState.pivot === index) return '#a855f7'; // Purple for pivot
    return '#3b82f6'; // Default Blue
  };

  const maxVal = Math.max(...(currentArray.length > 0 ? currentArray : [1]));

  return (
    <div className="flex-1 w-full flex items-end justify-center p-4 bg-slate-950 overflow-hidden relative min-h-[400px]">
      {steps.length > 0 && (
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700 max-w-md z-10">
          <p className="text-slate-200 text-sm font-medium">{steps[currentStepIndex]?.description}</p>
        </div>
      )}
      
      <div 
        className="w-full flex items-end justify-center h-full"
        style={{ gap: currentArray.length > 100 ? '0px' : '2px' }}
      >
        {currentArray.map((value, idx) => (
          <motion.div
            key={`${idx}-${value}`} // Use a mix or strictly idx depending on layout-id
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              height: `${(value / maxVal) * 100}%`,
              backgroundColor: getBarColor(idx),
            }}
            className="flex-1 rounded-t-sm min-w-[1px]"
          />
        ))}
      </div>
    </div>
  );
};
