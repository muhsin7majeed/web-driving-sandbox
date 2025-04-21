import { Vector3 } from "three";

const Building = ({ position }: { position: any }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[2, 10, 2]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default Building;
