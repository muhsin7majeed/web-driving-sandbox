import { GizmoHelper, GizmoViewport, Text, useHelper } from "@react-three/drei";
import { RapierRigidBody, RigidBody, useRevoluteJoint } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { AxesHelper, Mesh, Vector3 } from "three";
import { useControls as useLevaControls } from "leva";

import useKeyboardControls from "@/hooks/useControls";
import { useFrame } from "@react-three/fiber";

const printPosition = (e: any) => {
  const worldPos = new Vector3();

  if (!e.object) return;

  e.object.getWorldPosition(worldPos);
  console.log("World Position:", worldPos);
};

const CarTwo = () => {
  const carRigidBodyRef = useRef<RapierRigidBody>(null!);
  const frontLeftWheelRef = useRef<RapierRigidBody>(null!);
  const frontRightWheelRef = useRef<RapierRigidBody>(null!);
  const rearLeftWheelRef = useRef<RapierRigidBody>(null!);
  const rearRightWheelRef = useRef<RapierRigidBody>(null!);
  const rearAxleRef = useRef<RapierRigidBody>(null!);
  const frontAxleRef = useRef<RapierRigidBody>(null!);
  const currentSpeed = useRef(0);

  const { forward, backward, left, right, handBrake } = useKeyboardControls();

  //   useAutoRevoluteJoint(rearLeftWheelRef, rearAxleRef);

  // Connect front left wheel to front axle
  useRevoluteJoint(frontLeftWheelRef, frontAxleRef, [
    [0, 0, 0], // anchor in wheel
    [-0.8, 0, 0], // anchor in axle
    [0, 0, 1] // axis (horizontal spin)
  ]);

  // Connect front right wheel to front axle
  useRevoluteJoint(frontRightWheelRef, frontAxleRef, [
    [0, 0, 0], // anchor in wheel
    [0.8, 0, 0], // anchor in axle
    [0, 0, 1] // axis (horizontal spin)
  ]);

  // Connect front axle to car body
  useRevoluteJoint(frontAxleRef, carRigidBodyRef, [
    [0, 0, 0], // anchor in axle
    [0, -1, -1.5], // anchor in car
    [1, 0, 0] // axis (horizontal spin)
  ]);

  // Connect rear left wheel to rear axle
  useRevoluteJoint(rearRightWheelRef, rearAxleRef, [
    [0, 0, 0], // anchor in wheel
    [-0.8, 0, 0], // anchor in axle
    [0, 0, 1] // axis (horizontal spin)
  ]);

  // Connect rear right wheel to rear axle
  useRevoluteJoint(rearLeftWheelRef, rearAxleRef, [
    [0, 0, 0], // anchor in wheel
    [0.8, 0, 0], // anchor in axle
    [0, 0, 1] // axis (horizontal spin)
  ]);

  // Connect rear axle to car body
  useRevoluteJoint(rearAxleRef, carRigidBodyRef, [
    [0, 0, 0], // anchor in car
    [0, -1, 1.5], // anchor in axle
    [1, 0, 0] // axis (horizontal spin)
  ]);

  const accelerateCar = () => {
    // rearAxleJoint.current.configureMotorVelocity(0, 10);
    rearAxleRef.current.addTorque(new Vector3(-1, 0, 0), true);
    // frontAxleRef.current.addTorque(new Vector3(-1, 0, 0), true);

    // carRigidBodyRef.current.addForce(new Vector3(0, 0, -2), true);
  };

  const reverseCar = () => {
    rearAxleRef.current.addTorque(new Vector3(1, 0, 0), true);
    // frontAxleRef.current.addTorque(new Vector3(0.05, 0, 0), true);
  };

  const applyHandBrake = () => {};

  const decelerateCar = () => {
    // Get current velocity and apply opposite torque to slow down
    if (rearAxleRef.current) {
      const rearAngVel = rearAxleRef.current.angvel();

      // Apply counter-torque proportional to current angular velocity
      // This creates a braking effect that will eventually stop the wheels
      // if (rearAngVel.x !== 0) {
      //   const brakingForce = -rearAngVel.x * 0.1; // Adjust coefficient for braking strength
      //   rearAxleRef.current.addTorque(new Vector3(brakingForce, 0, 0), true);
      // }
    }
  };

  const steerLeft = () => {
    // frontAxleRef.current.setRotation({ x: 0, y: 0, z: .5, w: 0 }, true);
  };

  const steerRight = () => {
    // frontLeftWheelRef.current.rotation().z = 1;
    // frontRightWheelRef.current.rotation().z = 1;
  };

  const steerCenter = () => {
    // frontLeftWheelRef.current.rotation().z = 0;
    // frontRightWheelRef.current.rotation().z = 0;
  };

  useFrame(() => {
    if (!carRigidBodyRef.current) return;

    const rigidBody = carRigidBodyRef.current;

    if (forward) {
      accelerateCar();
    } else if (backward) {
      reverseCar();
    } else {
      decelerateCar();
    }

    if (left) {
      steerLeft();
    } else if (right) {
      steerRight();
    } else {
      steerCenter();
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
        </group>
      </RigidBody>

      <group>
        {/* Front Left Wheel */}
        <RigidBody ref={frontLeftWheelRef} position={[-1, 2, -3]} colliders={"trimesh"} mass={10} friction={1}>
          <mesh castShadow rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        </RigidBody>

        {/* Front Right Wheel */}
        <RigidBody ref={frontRightWheelRef} position={[1, 2, -3]} colliders={"trimesh"} mass={10} friction={1}>
          <mesh castShadow rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        </RigidBody>

        {/* Front Axle */}
        <RigidBody ref={frontAxleRef} position={[0, 2, -3]} mass={10}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} onClick={printPosition}>
            <axesHelper args={[2]} />
            <cylinderGeometry args={[0.1, 0.1, 1.3, 16]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        </RigidBody>
      </group>

      <group>
        {/* Rear Right Wheel*/}
        <RigidBody ref={rearRightWheelRef} position={[-1, 2, 1]} colliders={"trimesh"} mass={10} friction={1}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} onClick={printPosition}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        </RigidBody>

        {/* Rear Left Wheel */}
        <RigidBody ref={rearLeftWheelRef} position={[1, 2, 1]} colliders={"trimesh"} mass={10} friction={1}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} onClick={printPosition}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        </RigidBody>

        {/* Rear Axle */}
        <RigidBody ref={rearAxleRef} position={[0, 2, 1]} mass={10}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} onClick={printPosition}>
            <axesHelper args={[2]} />
            <cylinderGeometry args={[0.1, 0.1, 1.3, 16]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        </RigidBody>
      </group>
    </>
  );
};

export default CarTwo;
