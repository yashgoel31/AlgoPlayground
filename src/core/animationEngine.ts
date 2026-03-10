import { useEffect, useRef } from 'react';
import { useVisualizerStore } from '../store/visualizerStore';

export const useAnimationEngine = () => {
  const { isPlaying, speed, nextStep, steps, togglePlay } = useVisualizerStore();
  const requestRef = useRef<number>(undefined);
  const lastUpdateRef = useRef<number>(0);

  // Derive delay from speed (1 to 100)
  // Re-calculate delay explicitly inside animate to rely on latest state if needed,
  // but since we include speed in dependency array, the effect resets on speed change.
  const minDelay = 10;
  const maxDelay = 1000;
  const delay = maxDelay - (speed / 100) * (maxDelay - minDelay);

  useEffect(() => {
    const animate = (time: number) => {
      if (time - lastUpdateRef.current > delay) {
        // We're passing state checks from the store to avoid stale closures.
        const state = useVisualizerStore.getState();
        if (state.currentStepIndex < state.steps.length - 1) {
           nextStep();
           lastUpdateRef.current = time;
        } else {
           // Finished
           if (state.isPlaying) {
             togglePlay();
           }
           return;
        }
      }
      if (useVisualizerStore.getState().isPlaying) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      if (lastUpdateRef.current === 0) {
        lastUpdateRef.current = performance.now();
      }
      requestRef.current = requestAnimationFrame(animate);
    } else {
       if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed, steps.length, delay, nextStep, togglePlay]);
};
