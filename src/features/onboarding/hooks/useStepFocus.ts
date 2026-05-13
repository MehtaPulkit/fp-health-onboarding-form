import { useEffect, useRef } from "react";

export function useStepFocus(stepIndex: number) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  return headingRef;
}
