import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

interface NPCCarProps {
  startPos: [number, number, number];
  speed: number;
}

const NPCCar = ({ startPos, speed }: NPCCarProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  useFrame(() => {
    if (!rigidBodyRef.current) return;
    rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: -speed }, true);
  });

  return (
    <RigidBody ref={rigidBodyRef} colliders="cuboid" position={startPos}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 3]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
};

export default NPCCar;
