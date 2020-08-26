import { useEffect, MutableRefObject } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const defaultCallback = () => {};

export function useOnScreen(
  ref: MutableRefObject<HTMLDivElement | null>,
  rootMargin = '0px',
  callback: (x: boolean) => unknown = defaultCallback
) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        callback(entry.isIntersecting);
      },
      {
        rootMargin,
      }
    );
    if (ref && ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref && ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
}
