import type { AlgorithmStep } from '../store/visualizerStore';

export const createStep = (
  array: number[],
  comparisons: number[] = [],
  swaps: number[] = [],
  sortedIndices: number[] = [],
  description: string = '',
  pivot?: number
): AlgorithmStep => {
  return {
    state: {
      array: [...array],
      comparisons: [...comparisons],
      swaps: [...swaps],
      sortedIndices: [...sortedIndices],
      pivot
    },
    description
  };
};

export const swap = (arr: number[], i: number, j: number) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

export const generateRandomArray = (size: number, min = 10, max = 100): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1) + min));
};
