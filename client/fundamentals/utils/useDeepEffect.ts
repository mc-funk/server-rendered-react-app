import { useRef, useEffect } from 'react';
import equal from 'fast-deep-equal';

export function useDeepEffect(fn: () => unknown, deps: Array<unknown>) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);
  useEffect(() => {
    const isSame = equal(prevDeps.current, deps);

    if (isFirst.current || !isSame) {
      fn();
    }

    isFirst.current = false;
    prevDeps.current = deps;
  }, deps);
}
