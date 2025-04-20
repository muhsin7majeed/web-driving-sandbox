import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import useControls from "@/hooks/useControls";
import clamp from "@/utils/common";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import useCarTuning from "@/hooks/useCarTuning";

function Car() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const controls = useControls();
  const currentSpeed = useRef(0);
  const { topSpeed, acceleration, friction, turnSpeed } = useCarTuning();

  const maxReverseSpeed = topSpeed * 0.5;

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const rigidBody = rigidBodyRef.current;
    const rotation = rigidBody.rotation();
    const rotationY = rotation.y;

    const speed = currentSpeed.current;
    const speedRatio = Math.abs(speed) / topSpeed;
    const dynamicAcceleration = acceleration * (1 - speedRatio);

    const goForward = () => {
      currentSpeed.current = clamp(currentSpeed.current - dynamicAcceleration, -topSpeed, maxReverseSpeed);
    };

    const goBackward = () => {
      currentSpeed.current = clamp(currentSpeed.current + dynamicAcceleration, -topSpeed, maxReverseSpeed);
    };

    const applyFriction = () => {
      if (currentSpeed.current < 0) {
        currentSpeed.current = Math.min(currentSpeed.current + friction, 0);
      } else if (currentSpeed.current > 0) {
        currentSpeed.current = Math.max(currentSpeed.current - friction, 0);
      }
    };

    const handleTurn = () => {
      let steeringAngle = 0;

      if (controls.left) steeringAngle += 0.02;
      if (controls.right) steeringAngle -= 0.02;

      const isMoving = Math.abs(currentSpeed.current) > 0.01;

      if (isMoving) {
        if (controls.left) steeringAngle += turnSpeed;
        if (controls.right) steeringAngle -= turnSpeed;

        let skidFactor = 1;

        if (Math.abs(currentSpeed.current) > topSpeed * 0.7) {
          skidFactor = 0.3; // very little turning ability
        }

        // Apply rotation
        rigidBody.setRotation(
          {
            x: 0,
            y: rotationY + steeringAngle * turnSpeed * skidFactor,
            z: 0,
            w: 1
          },
          true
        );
      }
    };

    const handleMovement = () => {
      const forwardDir = {
        x: Math.sin(rotationY),
        y: 0,
        z: Math.cos(rotationY)
      };

      const velocity = {
        x: forwardDir.x * currentSpeed.current,
        y: 0,
        z: forwardDir.z * currentSpeed.current
      };

      rigidBody.setLinvel(velocity, true);
    };

    if (controls.forward) {
      goForward();
    } else if (controls.backward) {
      goBackward();
    } else {
      applyFriction();
    }

    handleTurn();
    handleMovement();
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={"cuboid"}
      mass={1}
      friction={2}
      restitution={0.1}
      linearDamping={1.5}
      angularDamping={1.5}
      enabledRotations={[false, true, false]}
    >
      <group position={[0, 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 3]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>

        <mesh castShadow position={[0, 1, 0.5]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </group>
    </RigidBody>
  );
}

export default Car;
