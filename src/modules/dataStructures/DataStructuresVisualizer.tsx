import React, { useEffect, useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { controllers } from '../../algorithms/datastructures/operations';
import { DataStructureCanvas } from './DataStructureCanvas';
import { Controls } from '../../components/controls/Controls';
import { useAnimationEngine } from '../../core/animationEngine';

export const DataStructuresVisualizer: React.FC = () => {
  const { algorithmName, setAlgorithmName, setSteps, isPlaying } = useVisualizerStore();
  const [inputValue, setInputValue] = useState<number>(Math.floor(Math.random() * 100));
  
  // Local ref to controller to maintain continuous internal DS state between user clicks
  // E.g., multiple inserts.
  const [controllerKey, setControllerKey] = useState<string>('Binary Search Tree');

  useAnimationEngine();

  useEffect(() => {
    if (!algorithmName || !Object.keys(controllers).includes(algorithmName)) {
      setAlgorithmName('Binary Search Tree');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCtrl = () => controllers[controllerKey as keyof typeof controllers] || controllers['Binary Search Tree'];

  const handleDsChange = (name: string) => {
    setAlgorithmName(name);
    setControllerKey(name);
    useVisualizerStore.getState().reset();
    setSteps([]);
  };

  const handleInsert = () => {
    if (isPlaying) return;
    const ctrl = getCtrl() as any;
    let newSteps = [];
    if (ctrl.insert) newSteps = ctrl.insert(inputValue);
    else if (ctrl.push) newSteps = ctrl.push(inputValue);
    else if (ctrl.enqueue) newSteps = ctrl.enqueue(inputValue);
    
    setSteps(newSteps);
    setInputValue(Math.floor(Math.random() * 100));
  };

  const handleRemove = () => {
    if (isPlaying) return;
    const ctrl = getCtrl() as any;
    let newSteps = [];
    if (ctrl.delete) newSteps = ctrl.delete(inputValue);
    else if (ctrl.pop) newSteps = ctrl.pop();
    else if (ctrl.dequeue) newSteps = ctrl.dequeue();

    if (newSteps.length > 0) setSteps(newSteps);
  };

  const dses = Object.keys(controllers);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 flex-1 relative overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-wrap justify-between items-center gap-4">
        
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Structure:</label>
          <select 
            value={controllerKey} 
            onChange={(e) => handleDsChange(e.target.value)}
            disabled={isPlaying}
            className="flex-1 sm:w-auto bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2 outline-none focus:border-green-500 disabled:opacity-50"
          >
            {dses.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="flex items-center flex-wrap gap-3 w-full sm:w-auto">
           <input 
             type="number" 
             value={inputValue} 
             onChange={(e) => setInputValue(Number(e.target.value))} 
             className="w-20 bg-slate-800 text-white p-2 rounded-lg border border-slate-700 text-sm" 
             disabled={isPlaying} 
           />
           <button 
             onClick={handleInsert}
             disabled={isPlaying}
             className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-500 text-white shadow shadow-green-900 text-sm font-bold rounded-lg disabled:opacity-50 transition-colors"
           >
             Insert / Push
           </button>
           <button 
             onClick={handleRemove}
             disabled={isPlaying}
             className="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white shadow shadow-rose-900 text-sm font-bold rounded-lg disabled:opacity-50 transition-colors"
           >
             Remove / Pop
           </button>
        </div>
      </div>

      <div className="flex-1 flex w-full relative min-h-0 min-w-0">
         <DataStructureCanvas />
      </div>

      <Controls />
    </div>
  );
};
