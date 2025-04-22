import { GizmoHelper, GizmoViewport, Text } from "@react-three/drei";
import { RapierRigidBody, RigidBody, useRevoluteJoint } from "@react-three/rapier";
import { useRef } from "react";
import { Mesh, Vector3 } from "three";
import { useControls as useLevaControls } from "leva";

import useKeyboardControls from "@/hooks/useControls";
import { useFrame } from "@react-three/fiber";

const CarTwo = () => {
  const carRigidBodyRef = useRef<RapierRigidBody>(null!);
  const frontLeftWheelRef = useRef<Mesh>(null!);
  const frontRightWheelRef = useRef<Mesh>(null!);
  const rearLeftWheelRef = useRef<RapierRigidBody>(null!);
  const rearRightWheelRef = useRef<RapierRigidBody>(null!);
  const rearAxleRef = useRef<RapierRigidBody>(null!);

  const currentSpeed = useRef(0);

  const { forward, backward, left, right, handBrake } = useKeyboardControls();

  const accelerateCar = () => {
    const rearLeftWheel = rearLeftWheelRef.current;
    const rearRightWheel = rearRightWheelRef.current;

    rearLeftWheel.applyTorqueImpulse(new Vector3(-0.05, 0, 0), true);
    rearRightWheel.applyTorqueImpulse(new Vector3(-0.05, 0, 0), true);
  };

  const applyHandBrake = () => {};

  const decelerateCar = () => {
    const rearLeftWheel = rearLeftWheelRef.current;
    const rearRightWheel = rearRightWheelRef.current;

    rearLeftWheel.applyTorqueImpulse(new Vector3(0, 0, 0), true);
    rearRightWheel.applyTorqueImpulse(new Vector3(0, 0, 0), true);
  };

  const steerLeft = () => {};

  const steerRight = () => {};

  useFrame(() => {
    if (!carRigidBodyRef.current) return;

    const rigidBody = carRigidBodyRef.current;

    if (forward) {
      accelerateCar();
    }

    if (backward) {
      decelerateCar();
    }

    // When no keys are pressed, slow down the car
    if (!forward && !backward) {
      decelerateCar();
    }
  });

  return (
    <>
      <Text position={[0, 3, 4]} fontSize={0.5} color="white">
        {Math.abs(Math.round(currentSpeed.current))} km/h
      </Text>

      <RigidBody
        ref={carRigidBodyRef}
        colliders={"cuboid"}
        mass={800}
        friction={0.7}
        restitution={0.2}
        linearDamping={0.5}
        angularDamping={2}
        enabledRotations={[false, true, false]}
        position={[0, 2, 0]}
      >
        <group>
          {/* Car body */}
          <mesh castShadow>
            <boxGeometry args={[1, 0.8, 3]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>

          <group>
            {/* Front Left */}
            <mesh ref={frontLeftWheelRef} castShadow position={[0.5, -0.5, -1]} rotation={[0, 0, -1.57]}>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
              <meshStandardMaterial color="gray" />
            </mesh>

            {/* Front Right */}
            <mesh ref={frontRightWheelRef} castShadow position={[-0.5, -0.5, -1]} rotation={[0, 0, -1.57]}>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
              <meshStandardMaterial color="gray" />
            </mesh>

            {/* Connect rear wheels to car body */}
            {/* <ImpulseJoint
              body1={carRigidBodyRef}
              body2={rearRightWheelRef}
              kind="spherical"
              worldAnchor1={[0.5, 1.5, 1]}
              worldAnchor2={[0.5, 1.5, 1]}
            />

            <ImpulseJoint
              body1={carRigidBodyRef}
              body2={rearLeftWheelRef}
              kind="spherical"
              worldAnchor1={[-0.5, 1.5, 1]}
              worldAnchor2={[-0.5, 1.5, 1]}
            /> */}
          </group>
        </group>
      </RigidBody>

      {/* Rear Right Wheel*/}
      <RigidBody ref={rearRightWheelRef} position={[0.5, 1, 1]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      </RigidBody>

      {/* Rear Left Wheel */}
      <RigidBody ref={rearLeftWheelRef} position={[-0.5, -0.5, 1]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </RigidBody>

      {/* Rear Axle */}
      <RigidBody ref={rearAxleRef} position={[0, 0, 1]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 1.3, 16]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
    </>
  );
};

export default CarTwo;
