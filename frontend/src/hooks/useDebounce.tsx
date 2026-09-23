import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [val, setVal] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVal(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);
  return val;
}
