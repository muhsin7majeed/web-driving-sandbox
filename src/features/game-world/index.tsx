import { Canvas } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, OrbitControls, useHelper } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import Car from "@/components/car";
import Ground from "@/components/ground";
import { useRef } from "react";
import { CameraHelper, DirectionalLight, DirectionalLightHelper } from "three";
import { useControls } from "leva";
import City from "@/features/city";
import Traffic from "../traffic";
import CarTwo from "@/components/car/CarTwo";

const EARTH_GRAVITY = 9.81;

const Lights = () => {
  const directionalLightRef = useRef<DirectionalLight>(null!);

  useHelper(directionalLightRef, DirectionalLightHelper, 2, "white");
  const { lightX, lightY, lightZ } = useControls({
    lightX: { value: 10 },
    lightY: { value: 10 },
    lightZ: { value: 0 }
  });

  const shadow = useRef(null!);

  useHelper(shadow, CameraHelper);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight ref={directionalLightRef} position={[lightX, lightY, lightZ]} castShadow />
    </>
  );
};

const GameWorld = () => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 80 }}>
      <OrbitControls />
      <Lights />
      <color attach="background" args={["skyblue"]} />

      <GizmoHelper alignment={"bottom-right"}>
        <GizmoViewport />
      </GizmoHelper>

      <gridHelper args={[100, 100]} />
      <axesHelper args={[5]} />

      <Physics gravity={[0, -EARTH_GRAVITY, 0]}>
        <mesh receiveShadow>
          {/* <Car /> */}
          <CarTwo />
        </mesh>

        <Ground />
        {/* <City /> */}
        {/* <Traffic /> */}

        {/* <Obstacles count={30} areaSize={80} /> */}
      </Physics>
    </Canvas>
  );
};

export default GameWorld;
