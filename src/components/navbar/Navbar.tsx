import React from 'react';
import { Github, Moon, Menu, Code2 } from 'lucide-react';
import { useVisualizerStore } from '../../store/visualizerStore';

export const Navbar: React.FC = () => {
  const { toggleSidebar, isCodePanelOpen, toggleCodePanel } = useVisualizerStore();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-white font-semibold flex items-center text-sm sm:text-base">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2 sm:mr-3"></span>
          Workspace
        </h2>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 text-slate-400">
        <button 
           onClick={toggleCodePanel}
           className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${isCodePanelOpen ? 'bg-green-500/20 text-green-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
           title="Toggle Code Panel"
        >
          <Code2 size={20} />
          <span className="text-sm font-semibold hidden sm:inline">{isCodePanelOpen ? 'Hide Code' : 'View Code'}</span>
        </button>
        <div className="w-px h-6 bg-slate-700 mx-1 sm:mx-2 hidden sm:block"></div>
        <button className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800">
          <Moon size={20} />
        </button>
        <a href="https://github.com/yashgoel31/AlgoPlayground" target="_blank" rel="noreferrer" className="hover:text-white transition-colors hidden sm:flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800">
          <Github size={20} />
          <span className="text-sm font-medium">Star</span>
        </a>
      </div>
    </header>
  );
};
