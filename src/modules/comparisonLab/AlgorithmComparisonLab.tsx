import React, { useState, useEffect, useRef } from 'react';
import { sortingAlgorithms } from '../../algorithms/sorting/algorithms';
import { generateRandomArray } from '../../utils/sortingHelpers';
import type { AlgorithmStep } from '../../store/visualizerStore';
import { motion, AnimatePresence } from 'framer-motion';

const MiniSortingCanvas: React.FC<{ state: any }> = ({ state }) => {
  if (!state) return <div className="flex-1 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl m-2 text-slate-500">Waiting...</div>;
  const { array, comparisons, swaps, sortedIndices } = state;
  const maxVal = Math.max(...array, 1);

  return (
    <div className="flex-1 flex items-end justify-center gap-[2px] p-4 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden">
      <AnimatePresence>
        {array.map((value: number, idx: number) => {
          let bgColor = 'bg-slate-500';
          if (comparisons.includes(idx)) bgColor = 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]';
          if (swaps.includes(idx)) bgColor = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]';
          if (sortedIndices.includes(idx)) bgColor = 'bg-green-500';

          return (
            <motion.div
              layout
              key={idx}
              initial={{ opacity: 0.8 }}
              animate={{ height: `${(value / maxVal) * 100}%`, backgroundColor: bgColor === 'bg-slate-500' ? '#64748b' : undefined }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`w-4 rounded-t-sm ${bgColor.startsWith('bg-') ? bgColor : ''}`}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export const AlgorithmComparisonLab: React.FC = () => {
  const [arraySize, setArraySize] = useState(30);
  const [baseArray, setBaseArray] = useState<number[]>([]);
  const [algo1, setAlgo1] = useState('Bubble Sort');
  const [algo2, setAlgo2] = useState('Quick Sort');
  
  const [steps1, setSteps1] = useState<AlgorithmStep[]>([]);
  const [steps2, setSteps2] = useState<AlgorithmStep[]>([]);
  
  const [idx1, setIdx1] = useState(0);
  const [idx2, setIdx2] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed] = useState(50);
  
  const reqRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    generateNewBase();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      reqRef.current = requestAnimationFrame(animate);
    } else if (reqRef.current) {
      cancelAnimationFrame(reqRef.current);
    }
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed, idx1, idx2, steps1, steps2]);

  const generateNewBase = () => {
    const newArr = generateRandomArray(arraySize);
    setBaseArray(newArr);
    prepareAlgorithms(newArr, algo1, algo2);
  };

  const prepareAlgorithms = (arr: number[], a1: string, a2: string) => {
    setIdx1(0);
    setIdx2(0);
    setIsPlaying(false);
    
    const gen1 = sortingAlgorithms[a1 as keyof typeof sortingAlgorithms];
    const gen2 = sortingAlgorithms[a2 as keyof typeof sortingAlgorithms];
    
    if (gen1 && gen2) {
      setSteps1(gen1([...arr]));
      setSteps2(gen2([...arr]));
    }
  };

  const handleAlgoChange = (num: 1 | 2, name: string) => {
    if (num === 1) {
       setAlgo1(name);
       prepareAlgorithms(baseArray, name, algo2);
    } else {
       setAlgo2(name);
       prepareAlgorithms(baseArray, algo1, name);
    }
  };

  const animate = (time: number) => {
    if (time - lastTimeRef.current >= (100 - speed)) {
      lastTimeRef.current = time;
      
      let moved = false;
      setIdx1(prev => {
        if (prev < steps1.length - 1) { moved = true; return prev + 1; }
        return prev;
      });
      setIdx2(prev => {
        if (prev < steps2.length - 1) { moved = true; return prev + 1; }
        return prev;
      });
      
      if (!moved) {
        setIsPlaying(false);
        return;
      }
    }
    reqRef.current = requestAnimationFrame(animate);
  };

  const algos = Object.keys(sortingAlgorithms);

  const done1 = idx1 >= steps1.length - 1 && steps1.length > 0;
  const done2 = idx2 >= steps2.length - 1 && steps2.length > 0;

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 flex-1">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-wrap gap-4 items-center">
        
        <div className="flex items-center space-x-2">
           <label className="text-sm font-medium text-slate-400">Array Size:</label>
           <input type="range" min="10" max="100" value={arraySize} onChange={(e) => setArraySize(Number(e.target.value))} disabled={isPlaying} className="w-24 accent-green-500" />
           <button onClick={generateNewBase} disabled={isPlaying} className="ml-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors">Generate</button>
        </div>

        <div className="w-px h-6 bg-slate-700 mx-2"></div>

        <button 
           onClick={() => setIsPlaying(!isPlaying)}
           className={`px-6 py-2 rounded-lg font-bold text-sm shadow transition-colors ${isPlaying ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900' : 'bg-green-600 hover:bg-green-500 shadow-green-900 text-white'}`}
        >
           {isPlaying ? 'Pause Race' : 'Start Race'}
        </button>
        
        <button 
           onClick={() => { setIdx1(0); setIdx2(0); setIsPlaying(false); }}
           className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium"
        >
           Reset
        </button>

      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4">
        
        {/* Left Competitor */}
        <div className="flex-1 flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <select value={algo1} onChange={(e) => handleAlgoChange(1, e.target.value)} disabled={isPlaying} className="bg-slate-800 border-none text-white text-lg font-bold rounded p-1 outline-none">
              {algos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${done1 ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
              {done1 ? 'Finished' : `Step: ${idx1} / ${steps1.length}`}
            </div>
          </div>
          <MiniSortingCanvas state={steps1[idx1]?.state} />
        </div>

        {/* Right Competitor */}
        <div className="flex-1 flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <select value={algo2} onChange={(e) => handleAlgoChange(2, e.target.value)} disabled={isPlaying} className="bg-slate-800 border-none text-white text-lg font-bold rounded p-1 outline-none">
               {algos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${done2 ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
               {done2 ? 'Finished' : `Step: ${idx2} / ${steps2.length}`}
            </div>
          </div>
          <MiniSortingCanvas state={steps2[idx2]?.state} />
        </div>

      </div>
    </div>
  );
};
