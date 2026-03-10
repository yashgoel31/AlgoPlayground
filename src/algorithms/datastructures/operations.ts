import type { GraphNode, GraphEdge, AlgorithmStep } from '../../store/visualizerStore';

// Common step generator mapping internal logical states to visual Graph Nodes/Edges
export const createDataStructureStep = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  highlightedNodes: string[],
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
        visitedNodes: [...highlightedNodes], // We'll hijack visited mapping for highlight colors
        highlightedEdges: [],
      }
    },
    description
  };
};

class BSTNode {
  val: number;
  id: string;
  left: BSTNode | null = null;
  right: BSTNode | null = null;
  constructor(val: number) {
    this.val = val;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

// Tree layout generator
const layoutTree = (root: BSTNode | null): { nodes: GraphNode[], edges: GraphEdge[] } => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  if (!root) return { nodes, edges };

  const traverse = (node: BSTNode, x: number, y: number, offset: number) => {
    nodes.push({ id: node.id, label: node.val.toString(), x, y });
    if (node.left) {
      edges.push({ id: `${node.id}-${node.left.id}`, source: node.id, target: node.left.id });
      traverse(node.left, x - offset, y + 80, offset / 2);
    }
    if (node.right) {
      edges.push({ id: `${node.id}-${node.right.id}`, source: node.id, target: node.right.id });
      traverse(node.right, x + offset, y + 80, offset / 2);
    }
  };
  // Much wider distribution to prevent deep tree nodes from colliding
  traverse(root, 600, 50, 300);
  return { nodes, edges };
};

export class BSTController {
  root: BSTNode | null = null;
  
  insert(val: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    if (!this.root) {
      this.root = new BSTNode(val);
      const { nodes, edges } = layoutTree(this.root);
      steps.push(createDataStructureStep(nodes, edges, [this.root.id], `Inserted ${val} as root.`));
      return steps;
    }

    let curr = this.root;
    while (true) {
      const { nodes, edges } = layoutTree(this.root);
      steps.push(createDataStructureStep(nodes, edges, [curr.id], `Comparing ${val} with ${curr.val}...`));
      
      if (val < curr.val) {
        if (curr.left) {
           curr = curr.left;
        } else {
           curr.left = new BSTNode(val);
           const finalLayout = layoutTree(this.root);
           steps.push(createDataStructureStep(finalLayout.nodes, finalLayout.edges, [curr.left.id], `Inserted ${val} to the left of ${curr.val}.`));
           break;
        }
      } else {
        if (curr.right) {
           curr = curr.right;
        } else {
           curr.right = new BSTNode(val);
           const finalLayout = layoutTree(this.root);
           steps.push(createDataStructureStep(finalLayout.nodes, finalLayout.edges, [curr.right.id], `Inserted ${val} to the right of ${curr.val}.`));
           break;
        }
      }
    }
    return steps;
  }
}

// Linear Structure
export class StackController {
  items: number[] = [];
  
  private getLayout() {
    const nodes: GraphNode[] = [];
    // Vertical layout from bottom up
    this.items.forEach((val, i) => {
      nodes.push({ id: `stack-${i}`, label: val.toString(), x: 300, y: 300 - (i * 55) });
    });
    return { nodes, edges: [] };
  }

  push(val: number): AlgorithmStep[] {
    this.items.push(val);
    const { nodes, edges } = this.getLayout();
    return [createDataStructureStep(nodes, edges, [`stack-${this.items.length - 1}`], `Pushed ${val} onto stack.`)];
  }

  pop(): AlgorithmStep[] {
    if (this.items.length === 0) return [createDataStructureStep([], [], [], 'Stack is empty!')];
    const val = this.items.pop();
    const { nodes, edges } = this.getLayout();
    return [createDataStructureStep(nodes, edges, [], `Popped ${val} from stack.`)];
  }
}

// Stub Queue, Linked List, HashTable for brevity but standardizing exports
export class QueueController {
  items: number[] = [];
  // Horizontal layout
  private getLayout() {
    return { 
      nodes: this.items.map((v, i) => ({ id: `q-${i}`, label: v.toString(), x: 50 + (i * 60), y: 150 })), 
      edges: [] 
    };
  }
  enqueue(val: number): AlgorithmStep[] {
    this.items.push(val);
    const { nodes, edges } = this.getLayout();
    return [createDataStructureStep(nodes, edges, [`q-${this.items.length - 1}`], `Enqueued ${val}.`)];
  }
  dequeue(): AlgorithmStep[] {
     if (!this.items.length) return [createDataStructureStep([], [], [], 'Queue empty')];
     const val = this.items.shift();
     const { nodes, edges } = this.getLayout();
     return [createDataStructureStep(nodes, edges, [], `Dequeued ${val}.`)];
  }
}

export const controllers = {
  'Stack': new StackController(),
  'Queue': new QueueController(),
  'Priority Queue': new QueueController(), // Mapped
  'Linked List': new QueueController(),    // Mapped
  'Binary Tree': new BSTController(),      // Mapped
  'Binary Search Tree': new BSTController(),
  'AVL Tree': new BSTController(),         // Mapped
  'Heap': new BSTController(),             // Mapped
  'Trie': new BSTController(),             // Mapped
  'Hash Table': new QueueController(),     // Mapped
};
