import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ComplexityAnalyzer: React.FC = () => {
  const [maxN, setMaxN] = useState<number>(50);

  const chartData = useMemo(() => {
    const labels = Array.from({ length: maxN }, (_, i) => i + 1);
    
    // Safety cap for exponential/factorial to avoid Infinity breaking the chart scale
    const safeExp = (n: number) => (n > 200 ? null : Math.pow(2, n));
    const fact = (n: number) => {
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res > 1e10 ? null : res; // cap huge factorials earlier so chart doesn't flatten everything else
    };

    return {
      labels,
      datasets: [
        { label: 'O(1) - Constant', data: labels.map(() => 1), borderColor: '#22c55e', backgroundColor: '#22c55e', borderWidth: 2, tension: 0.1 },
        { label: 'O(log n) - Logarithmic', data: labels.map(n => Math.log2(n)), borderColor: '#3b82f6', backgroundColor: '#3b82f6', borderWidth: 2, tension: 0.1 },
        { label: 'O(n) - Linear', data: labels.map(n => n), borderColor: '#facc15', backgroundColor: '#facc15', borderWidth: 2, tension: 0.1 },
        { label: 'O(n log n) - Linearithmic', data: labels.map(n => n * Math.log2(n)), borderColor: '#f97316', backgroundColor: '#f97316', borderWidth: 2, tension: 0.1 },
        { label: 'O(n^2) - Quadratic', data: labels.map(n => n * n), borderColor: '#ef4444', backgroundColor: '#ef4444', borderWidth: 2, tension: 0.1 },
        { label: 'O(2^n) - Exponential', data: labels.map(n => safeExp(n)), borderColor: '#d946ef', backgroundColor: '#d946ef', borderWidth: 2, tension: 0.1 },
        { label: 'O(n!) - Factorial', data: labels.map(n => fact(n)), borderColor: '#9333ea', backgroundColor: '#9333ea', borderWidth: 2, tension: 0.1 },
      ]
    };
  }, [maxN]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { position: 'right' as const, labels: { color: '#cbd5e1', padding: 20 } },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1', borderColor: '#334155', borderWidth: 1 }
    },
    scales: {
      x: { 
          title: { display: true, text: 'Input Size (n)', color: '#94a3b8' },
          grid: { color: '#1e293b' },
          ticks: { color: '#94a3b8' }
      },
      y: {
          title: { display: true, text: 'Operations (Time)', color: '#94a3b8' },
          grid: { color: '#1e293b' },
          ticks: { color: '#94a3b8' },
          // Cap y scale dynamically so smaller complexities aren't just flat lines
          max: maxN < 20 ? 100 : (maxN < 50 ? 500 : 2500)
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 flex-1">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center sm:flex-row flex-col gap-4">
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-slate-400">Max Input Size (n):</label>
          <input 
             type="range" 
             min="5" 
             max="100" 
             value={maxN} 
             onChange={(e) => setMaxN(Number(e.target.value))} 
             className="w-48 accent-green-500" 
          />
          <span className="text-white font-mono w-8">{maxN}</span>
        </div>

      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 h-full overflow-hidden">
        
        {/* Chart Window */}
        <div className="flex-1 min-h-[400px] bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col relative overflow-hidden">
            <h2 className="text-lg font-bold text-slate-200 mb-4">Big-O Complexity Curves</h2>
            <div className="flex-1 min-h-0 w-full relative">
                <Line options={options} data={chartData as any} />
            </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-lg">
                <h3 className="text-white font-bold text-lg mb-2">Constant Time — O(1)</h3>
                <p className="text-slate-400 text-sm">Execution time is independent of input size. Example: Array index lookup.</p>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-lg border-l-4 border-l-blue-500">
                <h3 className="text-white font-bold text-lg mb-2">Logarithmic — O(log n)</h3>
                <p className="text-slate-400 text-sm">Time goes up linearly while the n goes up exponentially. Example: Binary Search.</p>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-lg border-l-4 border-l-yellow-400">
                <h3 className="text-white font-bold text-lg mb-2">Linear — O(n)</h3>
                <p className="text-slate-400 text-sm">Time scales proportionally with input size. Example: Simple loop over an array.</p>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-lg border-l-4 border-l-orange-500">
                <h3 className="text-white font-bold text-lg mb-2">Linearithmic — O(n log n)</h3>
                <p className="text-slate-400 text-sm">Combination of linear and logarithmic. Often the best possible time complexity for sorting. Example: Merge Sort, Quick Sort.</p>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-lg border-l-4 border-l-red-500">
                <h3 className="text-white font-bold text-lg mb-2">Quadratic — O(n^2)</h3>
                <p className="text-slate-400 text-sm">Time scales exponentially with input size. Becomes very slow quickly. Example: Bubble Sort, Nested loops.</p>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-lg border-l-4 border-l-purple-600">
                <h3 className="text-white font-bold text-lg mb-2">Factorial — O(n!)</h3>
                <p className="text-slate-400 text-sm">Extremely slow. Adds a loop for every element. Example: Travelling Salesman exact brute force.</p>
            </div>
        </div>

      </div>
    </div>
  );
};
