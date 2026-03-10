import React from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import { GraphCanvas } from '../../components/visualizationCanvas/GraphCanvas';

// We reuse GraphCanvas since trees and lists can just be nodes + edges with fixed X,Y coords.
export const DataStructureCanvas: React.FC = () => {
  const { steps } = useVisualizerStore();

  if (steps.length === 0) {
     return <div className="flex-1 w-full flex items-center justify-center p-8 bg-slate-950 text-slate-500">Empty Structure</div>;
  }

  return (
    <div className="flex-1 w-full bg-slate-950 relative overflow-hidden flex">
      <GraphCanvas />
    </div>
  );
};
