import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

interface BuildingProps {
  position: any;
  size: [number, number, number];
}

const Building = ({ position, size }: BuildingProps) => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="gray" />
      </mesh>
    </RigidBody>
  );
};

export default Building;
