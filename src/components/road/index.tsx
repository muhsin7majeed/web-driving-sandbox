import { Decal, useTexture } from "@react-three/drei";

const Road = () => {
  const texture = useTexture("/road-texture.jpg"); // Add a road texture
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="gray" />
      <Decal position={[0, 0, 0]} rotation={0} scale={[10, 10, 1]} map={texture} />
    </mesh>
  );
};

export default Road;
