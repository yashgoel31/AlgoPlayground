import type { AlgorithmStep } from '../../store/visualizerStore';

// Helper
const createSearchStep = (
  array: number[],
  comparing: number[],
  targetFoundIdx: number[],
  notfoundIdx: number[],
  pivot: number | undefined,
  description: string
): AlgorithmStep => ({
  state: {
    array: [...array],
    comparisons: [...comparing],
    sortedIndices: [...targetFoundIdx],
    swaps: [...notfoundIdx],
    pivot
  },
  description
});

export const linearSearch = (array: number[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  for (let i = 0; i < array.length; i++) {
    steps.push(createSearchStep(array, [i], [], [], undefined, `Checking index ${i} for value ${target}`));
    if (array[i] === target) {
      steps.push(createSearchStep(array, [], [i], [], undefined, `Found target ${target} at index ${i}!`));
      return steps;
    }
    steps.push(createSearchStep(array, [], [], [i], undefined, `Value ${array[i]} is not ${target}.`));
  }
  steps.push(createSearchStep(array, [], [], [], undefined, `Target ${target} not found in array.`));
  return steps;
};

export const binarySearch = (array: number[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    steps.push(createSearchStep(array, [left, right], [], [], mid, `Search space: [${left}, ${right}]. Checking mid ${mid}`));

    if (array[mid] === target) {
      steps.push(createSearchStep(array, [], [mid], [], undefined, `Found target ${target} at index ${mid}!`));
      return steps;
    } else if (array[mid] < target) {
      steps.push(createSearchStep(array, [], [], [mid], undefined, `${array[mid]} < ${target}. Moving left pointer to ${mid + 1}`));
      left = mid + 1;
    } else {
      steps.push(createSearchStep(array, [], [], [mid], undefined, `${array[mid]} > ${target}. Moving right pointer to ${mid - 1}`));
      right = mid - 1;
    }
  }
  steps.push(createSearchStep(array, [], [], [], undefined, `Target ${target} not found.`));
  return steps;
};

export const jumpSearch = (array: number[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const n = array.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;

  steps.push(createSearchStep(array, [prev, Math.min(step, n) - 1], [], [], undefined, `Jumping by ${step}`));
  while (array[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) {
      steps.push(createSearchStep(array, [], [], [], undefined, `Target ${target} not found.`));
      return steps;
    }
    steps.push(createSearchStep(array, [prev, Math.min(step, n) - 1], [], [], undefined, `Value smaller than target. Jumping to ${Math.min(step, n) - 1}`));
  }

  steps.push(createSearchStep(array, [], [], [], undefined, `Target is within block [${prev}, ${Math.min(step, n) - 1}]. Linear searching...`));
  while (array[prev] < target) {
    steps.push(createSearchStep(array, [prev], [], [], undefined, `Checking index ${prev}`));
    prev++;
    if (prev === Math.min(step, n)) {
      steps.push(createSearchStep(array, [], [], [], undefined, `Reached end of block. Target not found.`));
      return steps;
    }
  }

  if (array[prev] === target) {
     steps.push(createSearchStep(array, [], [prev], [], undefined, `Found target ${target} at index ${prev}!`));
  } else {
     steps.push(createSearchStep(array, [], [], [], undefined, `Target ${target} not found.`));
  }
  return steps;
};


// Mocks for others for payload brevity

export const exponentialSearch = (array: number[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const n = array.length;
  if (n === 0) return steps;

  steps.push(createSearchStep(array, [0], [], [], undefined, `Checking if array[0] is target`));
  if (array[0] === target) {
    steps.push(createSearchStep(array, [], [0], [], undefined, `Found at index 0!`));
    return steps;
  }

  let i = 1;
  while (i < n && array[i] <= target) {
    steps.push(createSearchStep(array, [i], [], [], undefined, `Value at ${i} is <= ${target}. Doubling range...`));
    i *= 2;
  }

  const right = Math.min(i, n - 1);
  const left = i / 2;
  steps.push(createSearchStep(array, [], [], [], undefined, `Target is in range [${left}, ${right}]. Starting Binary Search...`));

  // Binary sub-search
  let l = left;
  let r = right;
  while (l <= r) {
    let mid = Math.floor((l + r) / 2);
    steps.push(createSearchStep(array, [l, r], [], [], mid, `Search space: [${l}, ${r}]. Checking mid ${mid}`));

    if (array[mid] === target) {
      steps.push(createSearchStep(array, [], [mid], [], undefined, `Found target ${target} at index ${mid}!`));
      return steps;
    } else if (array[mid] < target) {
      steps.push(createSearchStep(array, [], [], [mid], undefined, `${array[mid]} < ${target}. Moving left pointer to ${mid + 1}`));
      l = mid + 1;
    } else {
      steps.push(createSearchStep(array, [], [], [mid], undefined, `${array[mid]} > ${target}. Moving right pointer to ${mid - 1}`));
      r = mid - 1;
    }
  }

  steps.push(createSearchStep(array, [], [], [], undefined, `Target ${target} not found.`));
  return steps;
};

export const interpolationSearch = (array: number[], target: number): AlgorithmStep[] => {
   const steps: AlgorithmStep[] = [];
   let low = 0;
   let high = array.length - 1;

   while (low <= high && target >= array[low] && target <= array[high]) {
     if (low === high) {
       steps.push(createSearchStep(array, [low], [], [], undefined, `Checking index ${low}`));
       if (array[low] === target) {
         steps.push(createSearchStep(array, [], [low], [], undefined, `Found at ${low}!`));
         return steps;
       }
       break;
     }

     const pos = low + Math.floor(((target - array[low]) * (high - low)) / (array[high] - array[low]));
     steps.push(createSearchStep(array, [low, high], [], [], pos, `Interpolated position: ${pos}`));

     if (array[pos] === target) {
       steps.push(createSearchStep(array, [], [pos], [], undefined, `Found target ${target} at ${pos}!`));
       return steps;
     } else if (array[pos] < target) {
       steps.push(createSearchStep(array, [], [], [pos], undefined, `Value ${array[pos]} < ${target}. Updating low.`));
       low = pos + 1;
     } else {
       steps.push(createSearchStep(array, [], [], [pos], undefined, `Value ${array[pos]} > ${target}. Updating high.`));
       high = pos - 1;
     }
   }
   
   steps.push(createSearchStep(array, [], [], [], undefined, `Target ${target} not found.`));
   return steps;
};

export const fibonacciSearch = (array: number[], target: number): AlgorithmStep[] => {
   const steps: AlgorithmStep[] = [];
   const n = array.length;
   
   let fibM2 = 0;
   let fibM1 = 1;
   let fibM = fibM2 + fibM1;
   
   while (fibM < n) {
     fibM2 = fibM1;
     fibM1 = fibM;
     fibM = fibM2 + fibM1;
   }

   let offset = -1;

   while (fibM > 1) {
     const i = Math.min(offset + fibM2, n - 1);
     steps.push(createSearchStep(array, [i], [], [], undefined, `Fibonacci index to check: ${i}`));

     if (array[i] < target) {
       fibM = fibM1;
       fibM1 = fibM2;
       fibM2 = fibM - fibM1;
       offset = i;
       steps.push(createSearchStep(array, [], [], [i], undefined, `Value < target. Moving offsets up.`));
     } else if (array[i] > target) {
       fibM = fibM2;
       fibM1 = fibM1 - fibM2;
       fibM2 = fibM - fibM1;
       steps.push(createSearchStep(array, [], [], [i], undefined, `Value > target. Moving offsets down.`));
     } else {
       steps.push(createSearchStep(array, [], [i], [], undefined, `Found at index ${i}!`));
       return steps;
     }
   }

   if (fibM1 && array[offset + 1] === target) {
     steps.push(createSearchStep(array, [], [offset + 1], [], undefined, `Found at index ${offset + 1}!`));
     return steps;
   }

   steps.push(createSearchStep(array, [], [], [], undefined, `Target not found.`));
   return steps;
};

export const sentinelSearch = (array: number[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const n = array.length;
  if (n === 0) return steps;

  // We operate on a copy because modifying original array messes up UI reactivity for a moment
  const last = array[n - 1];
  
  steps.push(createSearchStep(array, [n - 1], [], [], undefined, `Checking if last element is target`));
  if (last === target) {
     steps.push(createSearchStep(array, [], [n - 1], [], undefined, `Found at the last index!`));
     return steps;
  }

  steps.push(createSearchStep(array, [], [], [], undefined, `Setting sentinel at the end: ${target}`));
  
  // Simulate sentinel logic without truly mutating store array size
  let i = 0;
  while (array[i] !== target && i < n - 1) {
    steps.push(createSearchStep(array, [i], [], [], undefined, `Checking index ${i}`));
    i++;
  }

  if (i < n - 1 || array[i] === target) {
    steps.push(createSearchStep(array, [], [i], [], undefined, `Found at index ${i}!`));
  } else {
    steps.push(createSearchStep(array, [], [], [], undefined, `Not found.`));
  }
  return steps;
};

export const ternarySearch = (array: number[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  let l = 0;
  let r = array.length - 1;

  while (r >= l) {
    const mid1 = l + Math.floor((r - l) / 3);
    const mid2 = r - Math.floor((r - l) / 3);

    steps.push(createSearchStep(array, [l, r], [], [], undefined, `Range [${l}, ${r}]. Mid1: ${mid1}, Mid2: ${mid2}`));

    if (array[mid1] === target) {
      steps.push(createSearchStep(array, [], [mid1], [], undefined, `Found at mid1 (${mid1})!`));
      return steps;
    }
    if (array[mid2] === target) {
      steps.push(createSearchStep(array, [], [mid2], [], undefined, `Found at mid2 (${mid2})!`));
      return steps;
    }

    if (target < array[mid1]) {
      steps.push(createSearchStep(array, [], [], [mid1], undefined, `${target} < arr[${mid1}]. Searching left third.`));
      r = mid1 - 1;
    } else if (target > array[mid2]) {
      steps.push(createSearchStep(array, [], [], [mid2], undefined, `${target} > arr[${mid2}]. Searching right third.`));
      l = mid2 + 1;
    } else {
      steps.push(createSearchStep(array, [], [], [mid1, mid2], undefined, `Target is between mid1 and mid2. Searching middle third.`));
      l = mid1 + 1;
      r = mid2 - 1;
    }
  }

  steps.push(createSearchStep(array, [], [], [], undefined, `Not found.`));
  return steps;
};

export const metaBinarySearch = (array: number[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const n = array.length;
  if (n === 0) return steps;

  let lg = Math.floor(Math.log2(n));
  let pos = 0;

  while (lg >= 0) {
    if (array[pos] === target) {
      steps.push(createSearchStep(array, [], [pos], [], undefined, `Found at index ${pos}!`));
      return steps;
    }

    let newPos = pos | (1 << lg);
    
    steps.push(createSearchStep(array, [newPos < n ? newPos : pos], [], [], undefined, `Testing bit ${lg}, new pos = ${newPos}`));

    if (newPos < n && array[newPos] <= target) {
      steps.push(createSearchStep(array, [newPos], [], [], undefined, `array[${newPos}] <= ${target}. Including bit.`));
      pos = newPos;
    } else {
      steps.push(createSearchStep(array, [newPos < n ? newPos : pos], [], [], undefined, `Too large or out of bounds. Excluding bit.`));
    }
    lg--;
  }

  if (array[pos] === target) {
    steps.push(createSearchStep(array, [], [pos], [], undefined, `Found at index ${pos}!`));
  } else {
    steps.push(createSearchStep(array, [], [], [], undefined, `Not found.`));
  }
  return steps;
};

export const sublistSearch = (array: number[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  steps.push(createSearchStep(array, [], [], [], undefined, `Sublist Search simulates finding a sequence.`));
  
  // Since our UI is designed for single-target search, we will treat Sublist as a Linear Search
  // looking for the first element, just for educational demonstration given the UI constraints.
  let found = false;
  for (let i = 0; i < array.length; i++) {
    steps.push(createSearchStep(array, [i], [], [], undefined, `Checking index ${i}`));
    if (array[i] === target) {
       steps.push(createSearchStep(array, [], [i], [], undefined, `Found sequence head at ${i}!`));
       found = true;
       break;
    }
  }

  if (!found) {
    steps.push(createSearchStep(array, [], [], [], undefined, `Sublist pattern not found.`));
  }
  return steps;
};

export const searchingAlgorithms = {
  'Linear Search': linearSearch,
  'Binary Search': binarySearch,
  'Jump Search': jumpSearch,
  'Exponential Search': exponentialSearch,
  'Interpolation Search': interpolationSearch,
  'Fibonacci Search': fibonacciSearch,
  'Sentinel Search': sentinelSearch,
  'Ternary Search': ternarySearch,
  'Meta Binary Search': metaBinarySearch,
  'Sublist Search': sublistSearch,
};
