import { TextureLoader, Vector3 } from "three";

const Road = ({ position }: { position: any }) => {
  const roadTexture = new TextureLoader().load("./assets/road-texture.jpg");

  return (
    <mesh position={position}>
      <planeGeometry args={[10, 100]} /> {/* Adjust width and length */}
      <meshStandardMaterial map={roadTexture} />
    </mesh>
  );
};

export default Road;
