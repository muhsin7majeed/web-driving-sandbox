import { useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

import useControls from "@/hooks/useControls";

function Car() {
  const carRef = useRef<Group>(null);
  const controls = useControls();

  useFrame(() => {
    const speed = 0.1;
    const turnSpeed = 0.03;

    if (!carRef.current) return;

    // Get current rotation - where the car is facing to
    const rotationY = carRef.current.rotation.y;

    // Whether the car is moving forward or backward
    let velocity = 0;
    if (controls.forward) velocity = -speed;
    if (controls.backward) velocity = speed;

    const direction = velocity < 0 ? "forward" : "backward";

    // Turn the car only if moving
    if (velocity !== 0) {
      if (direction === "forward") {
        // Turn in correct direction
        if (controls.left) carRef.current.rotation.y += turnSpeed;
        if (controls.right) carRef.current.rotation.y -= turnSpeed;
      }

      if (direction === "backward") {
        // Turn in opposite direction
        if (controls.left) carRef.current.rotation.y -= turnSpeed;
        if (controls.right) carRef.current.rotation.y += turnSpeed;
      }
    }

    // Calculate the movement vector based on rotation
    // Basically: if the car is rotated 90 degrees, move sideways instead of forward
    const dx = Math.sin(rotationY) * velocity;
    const dz = Math.cos(rotationY) * velocity;

    // // Update position
    carRef.current.position.x += dx;
    carRef.current.position.z += dz;
  });

  return (
    <group ref={carRef} position={[0, 0.5, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 3]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      <mesh castShadow position={[0, 1, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    </group>
  );
}

export default Car;
