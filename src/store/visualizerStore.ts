import { create } from 'zustand';

export type GraphNode = { id: string; x: number; y: number; label?: string };
export type GraphEdge = { id: string; source: string; target: string; weight?: number; isDirected?: boolean };
export type MazeCellType = 'path' | 'wall' | 'start' | 'end' | 'visited' | 'path_found' | 'current';
export type MazeCell = { row: number; col: number; type: MazeCellType };


export type AlgorithmState = {
  array: number[];
  comparisons: number[];
  swaps: number[];
  sortedIndices: number[];
  pivot?: number;

  graph?: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    visitedNodes: string[];
    highlightedEdges: string[];
    currentNode?: string;
  };
  maze?: {
    grid: MazeCell[][];
  };
};

export type AlgorithmStep = {
  state: AlgorithmState;
  description: string;
};

interface VisualizerState {
  array: number[];
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  algorithmName: string;
  isFinished: boolean;
  isCodePanelOpen: boolean;
  isSidebarOpen: boolean;

  setSteps: (steps: AlgorithmStep[]) => void;
  setArray: (array: number[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  togglePlay: () => void;
  setAlgorithmName: (name: string) => void;
  goToStep: (index: number) => void;
  toggleCodePanel: () => void;
  toggleSidebar: () => void;
}

export const useVisualizerStore = create<VisualizerState>((set) => ({
  array: [],
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speed: 50, // 1 to 100
  algorithmName: '',
  isFinished: false,
  isCodePanelOpen: false,
  isSidebarOpen: false,

  setSteps: (steps) => set({ steps, currentStepIndex: 0, isFinished: false }),
  setArray: (array) => set({ array, steps: [], currentStepIndex: 0, isFinished: false }),
  nextStep: () => set((state) => {
    if (state.currentStepIndex < state.steps.length - 1) {
      return { currentStepIndex: state.currentStepIndex + 1 };
    }
    return { isPlaying: false, isFinished: true };
  }),
  prevStep: () => set((state) => {
    if (state.currentStepIndex > 0) {
      return { currentStepIndex: state.currentStepIndex - 1, isFinished: false };
    }
    return {};
  }),
  reset: () => set({ currentStepIndex: 0, isPlaying: false, isFinished: false }),
  setSpeed: (speed) => set({ speed }),
  togglePlay: () => set((state) => {
    if (state.isFinished && !state.isPlaying) {
        return { isPlaying: true, isFinished: false, currentStepIndex: 0 };
    }
    return { isPlaying: !state.isPlaying };
  }),
  setAlgorithmName: (name) => set({ algorithmName: name }),
  goToStep: (index) => set((state) => {
    if (index >= 0 && index < state.steps.length) {
      return { currentStepIndex: index, isFinished: index === state.steps.length - 1 };
    }
    return {};
  }),
  toggleCodePanel: () => set((state) => ({ isCodePanelOpen: !state.isCodePanelOpen })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
