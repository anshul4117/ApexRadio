import { useState, useEffect, useRef } from 'react';

/**
 * Typewriter text animation hook
 * @param {string} text - Full text string to reveal
 * @param {number} [speed=18] - Milliseconds per character
 * @param {boolean} [active=true] - Whether typewriter is actively typing
 * @returns {{ displayedText: string, isDone: boolean }}
 */
export const useTypewriter = (text = '', speed = 18, active = true) => {
  const [displayedText, setDisplayedText] = useState(active ? '' : text);
  const [isDone, setIsDone] = useState(!active);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active || !text) {
      setDisplayedText(text || '');
      setIsDone(true);
      return;
    }

    setDisplayedText('');
    setIsDone(false);
    indexRef.current = 0;

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayedText(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current);
        setIsDone(true);
      }
    }, speed);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [text, speed, active]);

  return { displayedText, isDone };
};

export default useTypewriter;
