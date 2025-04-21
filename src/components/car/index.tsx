import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Quaternion, Vector3 } from "three";

import useControls from "@/hooks/useControls";
import clamp from "@/utils/common";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import useCarTuning from "@/hooks/useCarTuning";

function Car() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const controls = useControls();
  const currentSpeed = useRef(0);
  const steeringAngleRef = useRef(0);
  const headingRef = useRef(0);
  const frontLeftWheelRef = useRef<Mesh>(null);
  const frontRightWheelRef = useRef<Mesh>(null);
  const { topSpeed, acceleration, friction } = useCarTuning();

  const maxReverseSpeed = topSpeed * 0.5;
  const maxSteeringAngle = Math.PI / 6; // ~30 degrees
  const wheelbase = 4; // meters
  const steeringSpeed = 2;

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

  const updateSteering = (delta: number) => {
    const deltaSteer = steeringSpeed * delta;

    if (controls.left) {
      steeringAngleRef.current -= deltaSteer;
    } else if (controls.right) {
      steeringAngleRef.current += deltaSteer;
    } else {
      // Auto-centering steering (smooth return to 0)
      steeringAngleRef.current *= 0.9;

      if (Math.abs(steeringAngleRef.current) < 0.001) {
        steeringAngleRef.current = 0;
      }
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
    const angularVelocity = (speed * 0.05) / turnRadius;

    headingRef.current += angularVelocity;
  };

  const applyMovement = () => {
    const rigidBody = rigidBodyRef.current;
    if (!rigidBody) return;

    const speed = currentSpeed.current;
    const heading = headingRef.current;

    // Get current velocity to preserve y component (gravity)
    const currentVel = rigidBody.linvel();

    const velocity = {
      x: Math.sin(heading) * speed,
      y: currentVel.y, // Preserve vertical velocity from gravity
      z: Math.cos(heading) * speed
    };

    rigidBody.setLinvel(velocity, true);

    // Convert heading (Y rotation) to quaternion
    const quat = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), heading);
    rigidBody.setRotation(quat, true);
  };

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;

    updateThrottle();
    updateSteering(delta);
    updateHeading();
    applyMovement();

    // Visually rotate the front wheels to match the steering angle
    if (frontLeftWheelRef.current) {
      frontLeftWheelRef.current.rotation.y = -steeringAngleRef.current;
    }
    if (frontRightWheelRef.current) {
      frontRightWheelRef.current.rotation.y = -steeringAngleRef.current;
    }

    // console.log(
    //   steeringAngleRef.current,
    //   frontLeftWheelRef.current?.rotation.y,
    //   frontRightWheelRef.current?.rotation.y
    // );
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={"cuboid"}
      mass={1200}
      friction={1.2}
      restitution={0.1}
      linearDamping={0.1}
      angularDamping={4}
      enabledRotations={[false, true, false]}
      position={[0, 3, 0]}
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
        <mesh ref={frontLeftWheelRef} castShadow position={[0.5, -0.5, -1]} rotation={[0, 0, -1.57]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="gray" />
        </mesh>

        {/* Front Right */}
        <mesh ref={frontRightWheelRef} castShadow position={[-0.5, -0.5, -1]} rotation={[0, 0, -1.57]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </group>
    </RigidBody>
  );
}

export default Car;
