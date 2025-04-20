import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import useControls from "@/hooks/useControls";
import clamp from "@/utils/common";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import useCarTuning from "@/hooks/useCarTuning";
import { Quaternion, Vector3 } from "three";

function Car() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const controls = useControls();
  const currentSpeed = useRef(0);
  const steeringAngleRef = useRef(0);
  const headingRef = useRef(0);
  const { topSpeed, acceleration, friction } = useCarTuning();

  const maxReverseSpeed = topSpeed * 0.5;
  const maxSteeringAngle = Math.PI / 6; // ~30 degrees
  const wheelbase = 4; // meters
  const steeringSpeed = 0.001;

  const updateThrottle = () => {
    const speed = currentSpeed.current;
    const speedRatio = Math.abs(speed) / topSpeed;
    const dynamicAccel = acceleration * (1 - speedRatio);

    if (controls.forward) {
      // Forward acceleration
      currentSpeed.current = clamp(currentSpeed.current - dynamicAccel, -topSpeed, maxReverseSpeed);
    } else if (controls.backward) {
      // Reverse acceleration
      currentSpeed.current = clamp(currentSpeed.current + dynamicAccel, -topSpeed, maxReverseSpeed);
    } else {
      // Friction slowdown
      if (speed < 0) {
        currentSpeed.current = Math.min(speed + friction, 0);
      } else if (speed > 0) {
        currentSpeed.current = Math.max(speed - friction, 0);
      }
    }
  };

  const updateSteering = () => {
    if (controls.left) {
      steeringAngleRef.current -= steeringSpeed;
    } else if (controls.right) {
      steeringAngleRef.current += steeringSpeed;
    } else {
      // Auto-centering steering (smooth return to 0)
      steeringAngleRef.current *= 0.9;
    }

    steeringAngleRef.current = clamp(steeringAngleRef.current, -maxSteeringAngle, maxSteeringAngle);
  };

  const updateHeading = () => {
    const speed = currentSpeed.current;
    const isMoving = Math.abs(speed) > 0.01;

    if (!isMoving) return;

    // Skip if steering angle is very small (avoids instability)
    if (Math.abs(steeringAngleRef.current) < 0.001) return;

    const turnRadius = wheelbase / Math.sin(steeringAngleRef.current); // Based on simple bicycle model
    const angularVelocity = speed / turnRadius;

    headingRef.current += angularVelocity;
  };

  const applyMovement = () => {
    const rigidBody = rigidBodyRef.current;
    if (!rigidBody) return;

    const speed = currentSpeed.current;
    const heading = headingRef.current;

    const velocity = {
      x: Math.sin(heading) * speed,
      y: 0,
      z: Math.cos(heading) * speed
    };

    rigidBody.setLinvel(velocity, true);

    // Convert heading (Y rotation) to quaternion
    const quat = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), heading);
    rigidBody.setRotation(quat, true);
  };

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    updateThrottle();
    updateSteering();
    updateHeading();
    applyMovement();
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={"cuboid"}
      mass={1200}
      friction={1.2}
      restitution={0}
      linearDamping={0.2}
      angularDamping={4}
      enabledRotations={[false, true, false]}
    >
      <group position={[0, 1.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 3]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>

        {/* Rear Right */}
        <mesh castShadow position={[0.5, -0.5, 1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Rear Right */}
        <mesh castShadow position={[-0.5, -0.5, 1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Front Left */}
        <mesh castShadow position={[0.5, -0.5, -1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Front Right */}
        <mesh castShadow position={[-0.5, -0.5, -1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </group>
    </RigidBody>
  );
}

export default Car;
