import React, { useEffect, useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { generateRandomArray } from '../../utils/sortingHelpers';
import { searchingAlgorithms } from '../../algorithms/searching/algorithms';
import { SearchingCanvas } from '../../components/visualizationCanvas/SearchingCanvas';
import { Controls } from '../../components/controls/Controls';
import { useAnimationEngine } from '../../core/animationEngine';

export const SearchingVisualizer: React.FC = () => {
  const { algorithmName, setAlgorithmName, setArray, setSteps, isPlaying } = useVisualizerStore();
  const [arraySize, setArraySize] = useState(30);
  const [searchTarget, setSearchTarget] = useState<number>(0);
  
  // Custom hook representing the animation execution loop
  useAnimationEngine();

  // On mount
  useEffect(() => {
    if (!algorithmName || !Object.keys(searchingAlgorithms).includes(algorithmName)) {
      setAlgorithmName('Binary Search');
    }
    handleGenerateNewArray(arraySize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateNewArray = (size: number) => {
    // For searching, especially binary/interpolation, we want sorted arrays usually.
    // For linear it doesn't matter. Let's make it sorted by default for consistency.
    const newArr = generateRandomArray(size, 10, 200).sort((a, b) => a - b);
    setArray(newArr);
    
    // Pick a random target from the array, or something not in it (10% chance)
    const target = Math.random() > 0.1 ? newArr[Math.floor(Math.random() * size)] : Math.floor(Math.random() * 200);
    setSearchTarget(target);
    
    const alg = algorithmName || 'Binary Search';
    const selectedAlg = searchingAlgorithms[alg as keyof typeof searchingAlgorithms] || searchingAlgorithms['Binary Search'];
    setSteps(selectedAlg(newArr, target));
  };

  const handleAlgorithmChange = (name: string) => {
    setAlgorithmName(name);
    const state = useVisualizerStore.getState();
    const currentUnsorted = state.steps.length > 0 ? state.steps[0].state.array : state.array;
    const selectedAlg = searchingAlgorithms[name as keyof typeof searchingAlgorithms];
    
    useVisualizerStore.getState().reset();
    setArray(currentUnsorted);
    setSteps(selectedAlg(currentUnsorted, searchTarget));
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
       setSearchTarget(val);
       const state = useVisualizerStore.getState();
       const currentUnsorted = state.steps.length > 0 ? state.steps[0].state.array : state.array;
       const selectedAlg = searchingAlgorithms[algorithmName as keyof typeof searchingAlgorithms];
       useVisualizerStore.getState().reset();
       setSteps(selectedAlg(currentUnsorted, val));
    }
  };

  const algos = Object.keys(searchingAlgorithms);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 flex-1">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-wrap justify-between items-center gap-4">
        
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Algorithm:</label>
          <select 
            value={algorithmName} 
            onChange={(e) => handleAlgorithmChange(e.target.value)}
            disabled={isPlaying}
            className="flex-1 sm:w-auto bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2 outline-none focus:border-green-500 disabled:opacity-50"
          >
            {algos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <label className="text-sm font-medium text-slate-400 sm:ml-4 whitespace-nowrap">Target:</label>
          <input 
             type="number"
             value={searchTarget}
             onChange={handleTargetChange}
             disabled={isPlaying}
             className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2 w-16 sm:w-24 outline-none focus:border-green-500 disabled:opacity-50"
          />
        </div>

        <div className="flex items-center flex-wrap gap-4 w-full sm:w-auto justify-start sm:justify-end">
          <div className="flex items-center gap-2 sm:space-x-3 w-full sm:w-auto">
             <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Size: {arraySize}</label>
             <input 
               type="range" 
               min="10" 
               max="150" 
               value={arraySize}
               disabled={isPlaying}
               onChange={(e) => setArraySize(Number(e.target.value))}
               className="flex-1 sm:w-24 accent-green-500 disabled:opacity-50"
             />
          </div>
          
          <button 
            onClick={() => handleGenerateNewArray(arraySize)}
            disabled={isPlaying}
             className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors border border-slate-700 hover:border-slate-600 whitespace-nowrap"
          >
            Generate Array
          </button>
        </div>
      </div>

      <div className="flex-1 flex w-full relative min-h-0 min-w-0">
         <SearchingCanvas />
      </div>

      <Controls />
    </div>
  );
};
