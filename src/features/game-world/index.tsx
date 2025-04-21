import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import Car from "@/components/car";
import AiCar from "@/components/AiCar";
import Ground from "@/components/ground";
import Obstacles from "@/components/obstacles";

const GameWorld = () => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
      <Physics gravity={[0, -9.81, 0]}>
        <color attach="background" args={["skyblue"]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} castShadow />

        <Car />
        <AiCar />
        <Ground />
        <Obstacles count={30} areaSize={80} />

        <OrbitControls />
      </Physics>
    </Canvas>
  );
};

export default GameWorld;
