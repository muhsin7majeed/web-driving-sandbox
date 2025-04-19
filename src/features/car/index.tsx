import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

import useControls from "@/hooks/useControls";

function Car() {
  const carRef = useRef<Mesh>(null);
  const controls = useControls();

  useFrame(() => {
    const speed = 0.1;
    const rotationSpeed = 0.03;

    if (!carRef.current) return;

    // Update car position based on controls
    if (controls.forward) carRef.current.position.z -= speed;
    if (controls.backward) carRef.current.position.z += speed;
    if (controls.left) carRef.current.rotation.y += rotationSpeed;
    if (controls.right) carRef.current.rotation.y -= rotationSpeed;
  });

  return (
    <mesh ref={carRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export default Car;
