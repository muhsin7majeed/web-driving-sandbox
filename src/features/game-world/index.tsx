import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Car from "@/features/car";
import Ground from "@/features/ground";

const GameWorld = () => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
      <color attach="background" args={["skyblue"]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} castShadow />

      <Car />
      <Ground />

      <OrbitControls />
    </Canvas>
  );
};

export default GameWorld;
