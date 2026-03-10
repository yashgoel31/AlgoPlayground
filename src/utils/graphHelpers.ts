import type { GraphNode, GraphEdge, AlgorithmStep } from '../store/visualizerStore';

export const generateRandomGraph = (numNodes: number, numEdges: number, isDirected: boolean = false) => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  // Create nodes in a circular or random layout
  const radius = 200;
  const centerX = 300;
  const centerY = 300;
  
  for (let i = 0; i < numNodes; i++) {
    const angle = (i / numNodes) * 2 * Math.PI;
    nodes.push({
      id: i.toString(),
      label: i.toString(),
      x: centerX + radius * Math.cos(angle) + (Math.random() * 40 - 20),
      y: centerY + radius * Math.sin(angle) + (Math.random() * 40 - 20),
    });
  }

  // Create edges
  let edgesCreated = 0;
  // Ensure connectedness roughly by creating a spanning tree first
  for (let i = 1; i < numNodes; i++) {
    const target = i;
    const source = Math.floor(Math.random() * i);
    edges.push({
      id: `${source}-${target}`,
      source: source.toString(),
      target: target.toString(),
      weight: Math.floor(Math.random() * 20) + 1,
      isDirected,
    });
    edgesCreated++;
  }

  // Add remaining random edges
  while (edgesCreated < numEdges) {
    const source = Math.floor(Math.random() * numNodes);
    let target = Math.floor(Math.random() * numNodes);
    if (source !== target) {
      const exists = edges.some(e => 
        (e.source === source.toString() && e.target === target.toString()) ||
        (!isDirected && e.source === target.toString() && e.target === source.toString())
      );
      if (!exists) {
        edges.push({
          id: `${source}-${target}`,
          source: source.toString(),
          target: target.toString(),
          weight: Math.floor(Math.random() * 20) + 1,
          isDirected,
        });
        edgesCreated++;
      }
    }
  }

  return { nodes, edges };
};

export const createGraphStep = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  visitedNodes: string[],
  highlightedEdges: string[],
  currentNode: string | undefined,
  description: string
): AlgorithmStep => {
  return {
    state: {
      array: [],
      comparisons: [],
      swaps: [],
      sortedIndices: [],
      graph: {
        nodes: [...nodes],
        edges: [...edges],
        visitedNodes: [...visitedNodes],
        highlightedEdges: [...highlightedEdges],
        currentNode
      }
    },
    description
  };
};
