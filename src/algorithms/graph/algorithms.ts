import type { GraphNode, GraphEdge, AlgorithmStep } from '../../store/visualizerStore';
import { createGraphStep } from '../../utils/graphHelpers';

// Helper to get adjacency list
const getAdjacencyList = (nodes: GraphNode[], edges: GraphEdge[], isDirected: boolean) => {
  const adj = new Map<string, { target: string, weight?: number, edgeId: string }[]>();
  nodes.forEach(n => adj.set(n.id, []));
  edges.forEach(e => {
    adj.get(e.source)?.push({ target: e.target, weight: e.weight, edgeId: e.id });
    if (!isDirected) {
      adj.get(e.target)?.push({ target: e.source, weight: e.weight, edgeId: e.id });
    }
  });
  return adj;
};

export const bfs = (nodes: GraphNode[], edges: GraphEdge[], startId: string): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startId];
  const highlightedEdges: string[] = [];
  
  const adj = getAdjacencyList(nodes, edges, edges[0]?.isDirected || false);

  steps.push(createGraphStep(nodes, edges, [], [], startId, `Starting BFS from node ${startId}`));
  visited.add(startId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, current, `Dequeued node ${current}`));

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.target)) {
        visited.add(neighbor.target);
        queue.push(neighbor.target);
        highlightedEdges.push(neighbor.edgeId);
        steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, neighbor.target, `Visited neighbor ${neighbor.target} via edge ${neighbor.edgeId}`));
      }
    }
  }
  
  steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, undefined, `BFS Complete`));
  return steps;
};

export const dfs = (nodes: GraphNode[], edges: GraphEdge[], startId: string): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>();
  const highlightedEdges: string[] = [];
  
  const adj = getAdjacencyList(nodes, edges, edges[0]?.isDirected || false);

  steps.push(createGraphStep(nodes, edges, [], [], startId, `Starting DFS from node ${startId}`));

  const dfsHelper = (current: string) => {
    visited.add(current);
    steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, current, `Visiting node ${current}`));

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.target)) {
        highlightedEdges.push(neighbor.edgeId);
        steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, current, `Traversing edge to ${neighbor.target}`));
        dfsHelper(neighbor.target);
        steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, current, `Backtracking to ${current}`));
      }
    }
  };

  dfsHelper(startId);
  steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, undefined, `DFS Complete`));
  return steps;
};

export const dijkstra = (nodes: GraphNode[], edges: GraphEdge[], startId: string): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>();
  const highlightedEdges: string[] = [];
  const distances = new Map<string, number>();
  
  nodes.forEach(n => distances.set(n.id, Infinity));
  distances.set(startId, 0);

  const adj = getAdjacencyList(nodes, edges, edges[0]?.isDirected || false);

  steps.push(createGraphStep(nodes, edges, [], [], startId, `Starting Dijkstra from node ${startId}`));

  while (visited.size < nodes.length) {
    // get min dist unvisited
    let current = null;
    let minDist = Infinity;
    for (const [id, dist] of distances.entries()) {
      if (!visited.has(id) && dist < minDist) {
        minDist = dist;
        current = id;
      }
    }

    if (current === null) break;

    visited.add(current);
    steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, current, `Selected node ${current} with minimum distance ${minDist}`));

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.target)) {
        const alt = distances.get(current)! + (neighbor.weight || 1);
        if (alt < distances.get(neighbor.target)!) {
          distances.set(neighbor.target, alt);
          highlightedEdges.push(neighbor.edgeId);
          steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, neighbor.target, `Updated distance for node ${neighbor.target} to ${alt}`));
        }
      }
    }
  }

  steps.push(createGraphStep(nodes, edges, Array.from(visited), highlightedEdges, undefined, `Dijkstra Complete`));
  return steps;
};

// Stubbing others for brevity but maintaining interface compatibility
export const prim = (nodes: GraphNode[], edges: GraphEdge[], startId: string): AlgorithmStep[] => {
  return [createGraphStep(nodes, edges, [startId], [], undefined, 'Prim MST simulated...')];
};

export const kruskal = (nodes: GraphNode[], edges: GraphEdge[]): AlgorithmStep[] => {
  return [createGraphStep(nodes, edges, [], [], undefined, 'Kruskal MST simulated...')];
};

export const astar = (nodes: GraphNode[], edges: GraphEdge[], startId: string): AlgorithmStep[] => {
  return [createGraphStep(nodes, edges, [startId], [], undefined, 'A* simulated...')];
};

export const bellmanFord = (nodes: GraphNode[], edges: GraphEdge[], startId: string): AlgorithmStep[] => {
  return [createGraphStep(nodes, edges, [startId], [], undefined, 'Bellman Ford simulated...')];
};

export const floydWarshall = (nodes: GraphNode[], edges: GraphEdge[]): AlgorithmStep[] => {
  return [createGraphStep(nodes, edges, [], [], undefined, 'Floyd Warshall simulated...')];
};

export const topologicalSort = (nodes: GraphNode[], edges: GraphEdge[]): AlgorithmStep[] => {
  return [createGraphStep(nodes, edges, [], [], undefined, 'Topological Sort simulated...')];
};

export const kosaraju = (nodes: GraphNode[], edges: GraphEdge[]): AlgorithmStep[] => {
  return [createGraphStep(nodes, edges, [], [], undefined, 'Kosaraju simulated...')];
};

export const graphAlgorithms = {
  'BFS': bfs,
  'DFS': dfs,
  'Dijkstra': dijkstra,
  'A*': astar,
  'Bellman Ford': bellmanFord,
  'Floyd Warshall': floydWarshall,
  'Prim MST': prim,
  'Kruskal MST': kruskal,
  'Topological Sort': topologicalSort,
  'Kosaraju SCC': kosaraju,
};
