import React, { useState } from 'react';
import { useVisualizerStore } from '../../store/visualizerStore';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Hardcoded example snips mapped by algo
const codeSnippets: Record<string, Record<string, string>> = {
  'Bubble Sort': {
    js: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
    py: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                # Swap elements
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)      
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(&arr[j], &arr[j+1]);
}`
  },
  'DFS': {
    js: `function dfs(graph, start) {
  const stack = [start];
  const visited = new Set();
  
  while (stack.length > 0) {
    const vertex = stack.pop();
    if (!visited.has(vertex)) {
      visited.add(vertex);
      for (const neighbor of graph[vertex]) {
        stack.push(neighbor);
      }
    }
  }
  return visited;
}`,
    py: `def dfs(graph, start):
    visited, stack = set(), [start]
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            stack.extend(graph[vertex] - visited)
    return visited`,
    cpp: `void DFS(int v) {
    visited[v] = true;
    cout << v << " ";
    list<int>::iterator i;
    for (i = adj[v].begin(); i != adj[v].end(); ++i)
        if (!visited[*i])
            DFS(*i);
}`
  }
};

const getFallbackCode = (algo: string, lang: string) => {
   if (lang === 'js') return `// Default pseudo-code for ${algo}\nfunction runAlgorithm() {\n  // Implementation details for ${algo}\n  return true;\n}`;
   if (lang === 'py') return `# Default pseudo-code for ${algo}\ndef run_algorithm():\n    # Implementation details for ${algo}\n    return True`;
   return `// Default cpp pseudo-code for ${algo}\nvoid runAlgorithm() {\n  // Implementation details\n}`;
};

export const CodePanel: React.FC = () => {
  const { isCodePanelOpen, toggleCodePanel, algorithmName, steps, currentStepIndex } = useVisualizerStore();
  const [lang, setLang] = useState<'js' | 'py' | 'cpp'>('js');
  const [copied, setCopied] = useState(false);

  const getExtensions = () => {
     if (lang === 'js') return [javascript({ jsx: true })];
     if (lang === 'py') return [python()];
     if (lang === 'cpp') return [cpp()];
     return [];
  };

  const handleCopy = () => {
      const snippets = codeSnippets[algorithmName] || {};
      const code = snippets[lang] || getFallbackCode(algorithmName, lang);
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const currentDesc = steps[currentStepIndex]?.description || "Algorithm initialized.";

  return (
    <AnimatePresence>
      {isCodePanelOpen && (
        <motion.div
           initial={{ width: 0, opacity: 0 }}
           animate={{ width: "min(400px, 100vw)", opacity: 1 }}
           exit={{ width: 0, opacity: 0 }}
           transition={{ duration: 0.3, ease: 'easeInOut' }}
           className="absolute md:relative right-0 top-0 bottom-0 h-full bg-slate-950 md:border-l border-slate-800 flex flex-col shrink-0 overflow-hidden shadow-2xl z-40"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 w-full min-w-[320px]">
             <h2 className="text-white font-bold text-lg flex items-center space-x-2">
                <span className="truncate">{algorithmName || 'Algorithm'} Code</span>
             </h2>
             <button onClick={toggleCodePanel} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                <X size={20} />
             </button>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto w-full min-w-[320px]">
             
             {/* Language Tabs */}
             <div className="flex border-b border-slate-800 bg-slate-900/50">
               <button onClick={() => setLang('js')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${lang === 'js' ? 'text-green-400 border-b-2 border-green-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>JavaScript</button>
               <button onClick={() => setLang('py')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${lang === 'py' ? 'text-green-400 border-b-2 border-green-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>Python</button>
               <button onClick={() => setLang('cpp')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${lang === 'cpp' ? 'text-green-400 border-b-2 border-green-500 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>C++</button>
             </div>

             {/* Code Viewer Container */}
             <div className="flex-1 overflow-auto bg-[#282c34] relative code-scroll cursor-text group">
                 <button 
                   onClick={handleCopy} 
                   className="absolute top-2 right-4 p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg border border-slate-600"
                 >
                    {copied ? <CheckCircle2 size={16} className="text-green-400"/> : <Copy size={16} />}
                 </button>
                 
                 <CodeMirror
                    value={codeSnippets[algorithmName]?.[lang] || getFallbackCode(algorithmName, lang)}
                    extensions={getExtensions()}
                    theme="dark"
                    editable={false}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      highlightActiveLine: true,
                    }}
                    className="text-sm border-none outline-none h-full"
                    style={{ fontSize: 13, fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace" }}
                 />
             </div>

             {/* Live Activity Sync */}
             <div className="bg-slate-900 border-t border-slate-800 p-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Live Execution Sync</h3>
                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                    <p className="text-amber-400 font-mono text-sm leading-relaxed">
                       {'//'} {currentDesc}
                    </p>
                 </div>
             </div>
             
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
