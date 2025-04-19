import { useEffect, useState } from "react";

type Keys = "w" | "a" | "s" | "d";

export default function useControls() {
  const [keys, setKeys] = useState<Record<Keys, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) =>
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    const handleKeyUp = (e: KeyboardEvent) =>
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return {
    forward: keys.w || false,
    backward: keys.s || false,
    left: keys.a || false,
    right: keys.d || false,
  };
}
