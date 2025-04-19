import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

const AiCar = () => {
  const carRef = useRef<Group>(null);

  useFrame(() => {
    if (!carRef.current) return;

    const turnSpeed = 0.01; // How much the car turns every frame
    const speed = 0.05; // How fast the car moves forward

    // Rotate the car slowly
    carRef.current.rotation.y += turnSpeed;

    // Get the current angle the car is facing
    const rotationY = carRef.current.rotation.y;

    // Move in the direction it's facing (just like your car)
    const dx = Math.sin(rotationY) * -speed;
    const dz = Math.cos(rotationY) * -speed;

    // Update position
    carRef.current.position.x += dx;
    carRef.current.position.z += dz;
  });

  return (
    <group ref={carRef} position={[0, 0.5, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 3]} />
        <meshStandardMaterial color="yellow" />
      </mesh>

      <mesh castShadow position={[0, 1, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    </group>
  );
};

export default AiCar;
