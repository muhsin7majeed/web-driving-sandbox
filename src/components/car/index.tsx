import { useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

import useControls from "@/hooks/useControls";
import clamp from "@/utils/common";
import getCarConstants from "@/utils/getCarConstants";

function Car() {
  const carRef = useRef<Group>(null);
  const controls = useControls();

  const { maxSpeed, maxReverseSpeed, acceleration, friction, turnSpeed, reverseTurnSpeed } = getCarConstants({
    topSpeed: 0.5
  });

  const currentSpeed = useRef(0);

  useFrame(() => {
    if (!carRef.current) return;

    // Get current rotation - where the car is facing to
    const rotationY = carRef.current.rotation.y;
    const speed = currentSpeed.current;
    const speedRatio = Math.abs(speed) / maxSpeed;
    const dynamicAcceleration = acceleration * (1 - speedRatio);

    const updateSpeed = () => {
      if (controls.forward) {
        // Accelerate forward
        currentSpeed.current = clamp(speed - dynamicAcceleration, -maxSpeed, maxReverseSpeed);
      } else if (controls.backward) {
        // Accelerate backward
        currentSpeed.current = clamp(speed + dynamicAcceleration, -maxSpeed, maxReverseSpeed);
      } else {
        // Apply friction when idle
        if (speed < 0) {
          currentSpeed.current = Math.min(speed + friction, 0);
        } else if (speed > 0) {
          currentSpeed.current = Math.max(speed - friction, 0);
        }
      }
    };

    const updateRotation = () => {
      const speed = currentSpeed.current;
      if (speed === 0) return;

      const direction = speed < 0 ? "forward" : "backward";
      const rotation = carRef.current!.rotation;

      if (direction === "forward") {
        if (controls.left) rotation.y += turnSpeed;
        if (controls.right) rotation.y -= turnSpeed;
      } else {
        if (controls.left) rotation.y -= reverseTurnSpeed;
        if (controls.right) rotation.y += reverseTurnSpeed;
      }
    };

    const updatePosition = () => {
      const speed = currentSpeed.current;

      // Calculate the movement vector based on rotation
      // Basically: if the car is rotated 90 degrees, move sideways instead of forward
      const dx = Math.sin(rotationY) * speed;
      const dz = Math.cos(rotationY) * speed;

      carRef.current!.position.x += dx;
      carRef.current!.position.z += dz;
    };

    updateSpeed();
    updateRotation();
    updatePosition();
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
