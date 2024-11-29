import { useCallback, useState } from "react";

export function useClientRect() {
  const [rect, setRect] = useState<DOMRect | null>(null);

  const ref = useCallback((node: HTMLElement) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);

  return { rect, ref };
}
