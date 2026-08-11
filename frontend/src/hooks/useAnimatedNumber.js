import { useState, useEffect, useRef } from 'react';

/**
 * Smooth 60fps easing count-up animation for numeric values
 * @param {number} targetValue - Destination value
 * @param {number} [duration=800] - Duration in ms
 * @returns {number} Current animated value
 */
export const useAnimatedNumber = (targetValue, duration = 800) => {
  const [displayValue, setDisplayValue] = useState(targetValue || 0);
  const startValueRef = useRef(targetValue || 0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const startVal = displayValue;
    const targetVal = Number(targetValue) || 0;
    startValueRef.current = startVal;
    startTimeRef.current = null;

    if (startVal === targetVal) {
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Ease out cubic: 1 - pow(1 - progress, 3)
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (targetVal - startVal) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetVal);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
};

export default useAnimatedNumber;
