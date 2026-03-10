import React, { useEffect, useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { generateRandomArray } from '../../utils/sortingHelpers';
import { sortingAlgorithms } from '../../algorithms/sorting/algorithms';
import { SortingCanvas2D } from '../../components/visualizationCanvas/SortingCanvas2D';
import { SortingCanvas3D } from '../../components/visualizationCanvas/SortingCanvas3D';
import { Controls } from '../../components/controls/Controls';
import { useAnimationEngine } from '../../core/animationEngine';

export const SortingVisualizer: React.FC = () => {
  const { algorithmName, setAlgorithmName, setArray, setSteps, isPlaying } = useVisualizerStore();
  const [arraySize, setArraySize] = useState(50);
  const [use3D, setUse3D] = useState(false);
  
  // Custom hook representing the animation execution loop via requestAnimationFrame
  useAnimationEngine();

  // On mount or when initializing, generate random array
  useEffect(() => {
    let algToUse = algorithmName;
    if (!algorithmName || !Object.keys(sortingAlgorithms).includes(algorithmName)) {
      setAlgorithmName('Bubble Sort');
      algToUse = 'Bubble Sort';
    }
    handleGenerateNewArray(arraySize, algToUse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateNewArray = (size: number, overrideAlg?: string) => {
    const newArr = generateRandomArray(size, 10, 100);
    setArray(newArr);
    // Prepare steps based on selected algorithm
    const algName = overrideAlg || (Object.keys(sortingAlgorithms).includes(algorithmName) ? algorithmName : 'Bubble Sort');
    const selectedAlg = sortingAlgorithms[algName as keyof typeof sortingAlgorithms] || sortingAlgorithms['Bubble Sort'];
    setSteps(selectedAlg(newArr));
  };

  const handleAlgorithmChange = (name: string) => {
    setAlgorithmName(name);
    // Regen steps based on current store array
    const state = useVisualizerStore.getState();
    const currentUnsorted = state.steps.length > 0 ? state.steps[0].state.array : state.array;
    const selectedAlg = sortingAlgorithms[name as keyof typeof sortingAlgorithms];
    
    // We restart the simulation cleanly with fresh unsorted base
    useVisualizerStore.getState().reset();
    setArray(currentUnsorted);
    setSteps(selectedAlg(currentUnsorted));
  };

  const algos = Object.keys(sortingAlgorithms);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 flex-1">
      {/* Top Header / Toolbar Specific to this Module */}
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
        </div>

        <div className="flex items-center flex-wrap gap-4 w-full sm:w-auto justify-start sm:justify-end">
          <div className="flex items-center gap-2 sm:space-x-3 w-full sm:w-auto">
             <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Size: {arraySize}</label>
             <input 
               type="range" 
               min="10" 
               max="500" 
               value={arraySize}
               disabled={isPlaying}
               onChange={(e) => setArraySize(Number(e.target.value))}
               className="flex-1 sm:w-24 accent-green-500 disabled:opacity-50"
             />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => handleGenerateNewArray(arraySize)}
              disabled={isPlaying}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors border border-slate-700 hover:border-slate-600 whitespace-nowrap"
            >
              Regenerate
            </button>

            <button 
              onClick={() => setUse3D(!use3D)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-colors border whitespace-nowrap ${use3D ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
            >
              {use3D ? '3D View On' : '3D View Off'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Visualization Canvas Area */}
      <div className="flex-1 flex w-full relative min-h-0 min-w-0">
         {use3D ? <SortingCanvas3D /> : <SortingCanvas2D />}
      </div>

      {/* Bottom Controls */}
      <Controls />
    </div>
  );
};
