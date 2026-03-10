import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, BarChart2, Compass, Cpu, Database, Network, Search, X } from 'lucide-react';
import { useVisualizerStore } from '../../store/visualizerStore';

const navItems = [
  { name: 'Sorting', path: '/sorting', icon: <BarChart2 size={20} /> },
  { name: 'Searching', path: '/searching', icon: <Search size={20} /> },
  { name: 'Graphs', path: '/graphs', icon: <Network size={20} /> },
  { name: 'Pathfinding', path: '/pathfinding', icon: <Compass size={20} /> },
  { name: 'Data Structures', path: '/data-structures', icon: <Database size={20} /> },
  { name: 'Comparison Lab', path: '/comparison', icon: <Activity size={20} /> },
  { name: 'Complexity Analyzer', path: '/complexity', icon: <Cpu size={20} /> },
];

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useVisualizerStore();

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
      
      <aside 
        className={`fixed md:relative z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white flex-1">
              AlgoPlay<span className="text-green-500">ground</span>
            </h1>
          </div>
          <button 
            className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 first:mt-0">
          Modules
        </h2>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 768) {
                toggleSidebar();
              }
            }}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400">
          <p>Ultimate Algorithm Playground</p>
          <p className="mt-1">v1.1.0</p>
          <p className="mt-2 text-slate-500">Made with <span className="text-red-500">❤️</span> by YASH GOEL</p>
        </div>
      </div>
    </aside>
    </>
  );
};
