import React, { useEffect, useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { generateRandomGraph } from '../../utils/graphHelpers';
import { graphAlgorithms } from '../../algorithms/graph/algorithms';
import { GraphCanvas } from '../../components/visualizationCanvas/GraphCanvas';
import { Controls } from '../../components/controls/Controls';
import { useAnimationEngine } from '../../core/animationEngine';

export const GraphVisualizer: React.FC = () => {
  const { algorithmName, setAlgorithmName, setSteps, isPlaying } = useVisualizerStore();
  const [numNodes, setNumNodes] = useState(15);
  const [numEdges, setNumEdges] = useState(20);
  const [isDirected, setIsDirected] = useState(false);
  const [startNode, setStartNode] = useState('0');
  
  // Custom hook representing the animation execution loop
  useAnimationEngine();

  // Keep a local copy of the unsorted/unprocessed graph to restart algos without regen
  const [currentGraph, setCurrentGraph] = useState<{ nodes: any[], edges: any[] }>({ nodes: [], edges: [] });

  useEffect(() => {
    if (!algorithmName || !Object.keys(graphAlgorithms).includes(algorithmName)) {
      setAlgorithmName('BFS');
    }
    handleGenerateNewGraph(numNodes, numEdges, isDirected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateNewGraph = (nodesCnt: number, edgesCnt: number, directed: boolean) => {
    const graph = generateRandomGraph(nodesCnt, edgesCnt, directed);
    setCurrentGraph(graph);
    
    // Fallback start node if current one is out of bounds
    const sNode = parseInt(startNode) >= nodesCnt ? '0' : startNode;
    setStartNode(sNode);

    const alg = algorithmName || 'BFS';
    const selectedAlg = graphAlgorithms[alg as keyof typeof graphAlgorithms] || graphAlgorithms['BFS'];
    
    // Store is updated via setSteps
    useVisualizerStore.getState().reset();
    setSteps(selectedAlg(graph.nodes, graph.edges, sNode));
  };

  const handleAlgorithmChange = (name: string) => {
    setAlgorithmName(name);
    const selectedAlg = graphAlgorithms[name as keyof typeof graphAlgorithms];
    useVisualizerStore.getState().reset();
    setSteps(selectedAlg(currentGraph.nodes, currentGraph.edges, startNode));
  };

  const algos = Object.keys(graphAlgorithms);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 flex-1 relative overflow-hidden">
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
          <div className="flex items-center gap-2 sm:space-x-2">
             <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Nodes:</label>
             <input type="number" value={numNodes} onChange={(e) => setNumNodes(Number(e.target.value))} className="w-16 bg-slate-800 text-white p-1 rounded border border-slate-700 text-sm" disabled={isPlaying} />
          </div>
          <div className="flex items-center gap-2 sm:space-x-2">
             <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Edges:</label>
             <input type="number" value={numEdges} onChange={(e) => setNumEdges(Number(e.target.value))} className="w-16 bg-slate-800 text-white p-1 rounded border border-slate-700 text-sm" disabled={isPlaying} />
          </div>
          <div className="flex items-center gap-2 sm:space-x-2">
             <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Start:</label>
             <input type="number" value={startNode} onChange={(e) => setStartNode(e.target.value)} className="w-16 bg-slate-800 text-white p-1 rounded border border-slate-700 text-sm" disabled={isPlaying} />
          </div>
          <label className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-400">
             <input type="checkbox" checked={isDirected} onChange={(e) => setIsDirected(e.target.checked)} disabled={isPlaying} className="accent-green-500 rounded bg-slate-800 border-slate-700" />
             <span>Directed</span>
          </label>
          
          <button 
            onClick={() => handleGenerateNewGraph(numNodes, numEdges, isDirected)}
            disabled={isPlaying}
             className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors border border-slate-700 hover:border-slate-600"
          >
            Regenerate
          </button>
        </div>
      </div>

      <div className="flex-1 flex w-full relative min-h-0 min-w-0">
         <GraphCanvas />
      </div>

      <Controls />
    </div>
  );
};
