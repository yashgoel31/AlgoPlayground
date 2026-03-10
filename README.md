# Ultimate Algorithm Playground

🚀 **Live Demo:** [algo-playground-beta.vercel.app](https://algo-playground-beta.vercel.app)

![Algorithm Playground](./public/preview.png)

A comprehensive, interactive, and beautifully designed web application for visualizing and learning data structures and algorithms. Built with React, TypeScript, Zustand, and Tailwind CSS.

## 🚀 Features

- **Sorting Visualizer**: Interactive visualizations for Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Counting, Radix, and Cocktail Sort. Both 2D and 3D (Three.js) visualizations included.
- **Searching Visualizer**: Understand Linear, Binary, Jump, and more searching algorithms visually.
- **Graph Algorithms**: Build generic graphs and visualize BFS, DFS, Dijkstra, and pathfinding networks.
- **Maze Generator & Solver**: Drag to draw custom mazes, automatically generate recursive backtrack paths, and watch pathfinding A* and BFS solve them constraint-free.
- **Data Structures Playground**: Interactive mutations for Stacks, Queues, Hash Tables, and various Trees (BST, AVL, Heap, Trie, Linked List).
- **Comparison Lab**: Pit algorithms against each other in side-by-side execution races. 
- **Complexity Analyzer**: Chart.js integration graphing out Big-O notation complexities dynamically.
- **Code Learning Panel**: Multi-language (JS, Python, C++) pseudo-code integration mapped to visualization execution states via CodeMirror.

## 🛠 Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand for Global State Management
- Framer Motion for 2D Canvas Animations
- React Three Fiber / Drei for 3D sorting arrays
- Chart.js / React-ChartJS-2 for Complexity Analysis
- CodeMirror for Code Learning Panel

## 📥 Installation

1. Copy the repository and navigate into the `Algorithm Playground` folder.
2. Ensure you have Node.js installed.
3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open your browser and navigate to the local host address provided in your terminal (e.g., \`http://localhost:5173\`).

## 🧠 Architecture Overview
The system heavily decouples algorithm logic from rendering. 
- \`animationEngine.ts\`: Uses \`requestAnimationFrame\` to dictate playback loops matching global \`speed\` state.
- Generators: All algorithms exist as synchronous/pure sequence generators returning \`AlgorithmStep\` arrays without mutating original views until the renderer advances frames.

## 📝 License
MIT License. Created to assist in developer education and technical understanding of underlying computational problem solving.
