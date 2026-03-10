import React from 'react';
import { motion } from 'framer-motion';
import { useVisualizerStore } from '../../store/visualizerStore';

export const GraphCanvas: React.FC = () => {
  const { steps, currentStepIndex } = useVisualizerStore();

  const currentState = steps.length > 0 ? steps[currentStepIndex].state : null;
  const graph = currentState?.graph;

  if (!graph) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-8 bg-slate-950/50">
        <span className="text-slate-500">No Graph Data...</span>
      </div>
    );
  }

  const { nodes, edges, visitedNodes, highlightedEdges, currentNode } = graph;

  const getNodeColor = (id: string) => {
    if (currentNode === id) return '#f59e0b'; // Amber / Active
    if (visitedNodes.includes(id)) return '#22c55e'; // Green / Visited
    return '#1e293b'; // Slate-800 / Default
  };

  const getEdgeColor = (id: string) => {
    if (highlightedEdges.includes(id)) return '#22c55e'; // Green highlighted path
    return '#334155'; // Slate-700
  };

  // Find boundaries to potentially center the graph (optional scale)
  return (
    <div className="flex-1 w-full h-full bg-slate-950 overflow-auto touch-pan-x touch-pan-y relative min-h-0 min-w-0">
      {steps.length > 0 && (
         <div className="sticky top-4 sm:top-8 mt-4 sm:mt-0 text-center mx-auto max-w-[90%] sm:max-w-2xl bg-slate-800/80 p-3 sm:p-4 rounded-xl border border-slate-700 shadow-xl backdrop-blur-sm z-20">
           <p className="text-amber-400 font-mono text-xs sm:text-sm">
             {steps[currentStepIndex]?.description}
           </p>
         </div>
      )}

      {/* Wrapping the actual graphic in a minimum bounded div so panning is accessible */}
      <div className="min-w-[800px] min-h-[600px] relative w-full h-full">
        {/* Wrapping in an SVG to draw lines easily */}
        <svg className="w-full h-full absolute top-0 left-0">
           <defs>
             <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
               <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
             </marker>
             <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
               <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
             </marker>
           </defs>
           {edges.map(e => {
             const source = nodes.find(n => n.id === e.source);
             const target = nodes.find(n => n.id === e.target);
             if (!source || !target) return null;

             const isActive = highlightedEdges.includes(e.id);
             return (
               <g key={e.id}>
                 <motion.line
                   x1={source.x}
                   y1={source.y}
                   x2={target.x}
                   y2={target.y}
                   stroke={getEdgeColor(e.id)}
                   strokeWidth={isActive ? 3 : 2}
                   markerEnd={e.isDirected ? (isActive ? "url(#arrowhead-active)" : "url(#arrowhead)") : ""}
                   animate={{ stroke: getEdgeColor(e.id), strokeWidth: isActive ? 3 : 2 }}
                   transition={{ duration: 0.3 }}
                 />
                 {e.weight && (
                   <text 
                     x={(source.x + target.x) / 2} 
                     y={(source.y + target.y) / 2 - 5}
                     fill="#cbd5e1"
                     fontSize="12"
                     textAnchor="middle"
                   >
                     {e.weight}
                   </text>
                 )}
               </g>
             );
           })}
        </svg>

        {/* Draw Nodes using HTML/Framer Motion overlaid exactly over coordinates */}
        {nodes.map(n => (
          <motion.div
             key={n.id}
             className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-slate-600 flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg text-slate-200 z-10"
             style={{
               left: n.x - 24, // center
               top: n.y - 24,
             }}
             animate={{
               backgroundColor: getNodeColor(n.id),
               scale: currentNode === n.id ? 1.2 : 1,
               borderColor: currentNode === n.id ? '#fcd34d' : '#475569'
             }}
             transition={{ duration: 0.3 }}
          >
            {n.label}
          </motion.div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="sticky bottom-4 left-4 sm:fixed sm:bottom-8 sm:left-8 mt-4 mx-4 flex flex-wrap gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800 backdrop-blur-sm text-[10px] sm:text-xs text-slate-400 z-20 max-w-fit">
         <div className="flex items-center"><div className="w-3 h-3 bg-amber-500 rounded-full mr-2" /> Current Node</div>
         <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2" /> Visited</div>
         <div className="flex items-center"><div className="w-6 sm:w-8 h-1 bg-green-500 mr-2" /> Traversed Path</div>
      </div>
    </div>
  );
};
