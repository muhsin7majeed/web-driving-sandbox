import { useEffect, useState } from "react";

type Keys = "w" | "a" | "s" | "d" | "space";

export default function useControls() {
  const [keys, setKeys] = useState<Record<Keys, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);

      const key = e.key === " " ? "space" : e.key.toLowerCase();

      setKeys((prev) => ({ ...prev, [key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key === " " ? "space" : e.key.toLowerCase();

      setKeys((prev) => ({ ...prev, [key]: false }));
    };

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
    handBrake: keys.space || false
  };
}
