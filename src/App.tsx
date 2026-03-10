import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/sidebar/Sidebar';
import { Navbar } from './components/navbar/Navbar';
import { SortingVisualizer } from './modules/sortingVisualizer/SortingVisualizer';
import { SearchingVisualizer } from './modules/searchingVisualizer/SearchingVisualizer';
import { GraphVisualizer } from './modules/graphVisualizer/GraphVisualizer';
import { MazeVisualizer } from './modules/mazeVisualizer/MazeVisualizer';
import { DataStructuresVisualizer } from './modules/dataStructures/DataStructuresVisualizer';
import { AlgorithmComparisonLab } from './modules/comparisonLab/AlgorithmComparisonLab';
import { ComplexityAnalyzer } from './modules/complexityAnalyzer/ComplexityAnalyzer';
import { CodePanel } from './components/codePanel/CodePanel';

function App() {
  return (
    <Router>
      <div className="flex w-full h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Navbar />
          <div className="flex flex-1 overflow-hidden relative">
            <main className="flex-1 overflow-y-auto flex flex-col bg-slate-900 shadow-inner">
              <Routes>
                <Route path="/" element={<Navigate to="/sorting" replace />} />
                <Route path="/sorting" element={<SortingVisualizer />} />
                <Route path="/searching" element={<SearchingVisualizer />} />
                <Route path="/graphs" element={<GraphVisualizer />} />
                <Route path="/pathfinding" element={<MazeVisualizer />} />
                <Route path="/data-structures" element={<DataStructuresVisualizer />} />
                <Route path="/comparison" element={<AlgorithmComparisonLab />} />
                <Route path="/complexity" element={<ComplexityAnalyzer />} />
              </Routes>
            </main>
            <CodePanel />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
