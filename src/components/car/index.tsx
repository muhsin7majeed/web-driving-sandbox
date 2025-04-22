import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Quaternion, Vector3 } from "three";

import useControls from "@/hooks/useControls";
import clamp from "@/utils/common";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import useCarTuning from "@/hooks/useCarTuning";
import { Text } from "@react-three/drei";

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
    const speed = Math.abs(currentSpeed.current);
    const dynamicSteeringSpeed = steeringSpeed * Math.min(speed / topSpeed + 0.5, 1); // Scale steering with speed
    const deltaSteer = dynamicSteeringSpeed * delta;

    if (controls.left) {
      steeringAngleRef.current -= deltaSteer;
    } else if (controls.right) {
      steeringAngleRef.current += deltaSteer;
    } else {
      steeringAngleRef.current *= 0.85; // Smoother auto-centering
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

    // Get the forward direction based on heading
    const forward = new Vector3(Math.sin(heading), 0, Math.cos(heading));

    // Apply force in the forward direction
    const force = forward.multiplyScalar(speed * 0.5); // Adjust multiplier for tuning
    rigidBody.addForce(force, true);

    // Update rotation using quaternion
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
    <>
      <Text position={[0, 3, 4]} fontSize={0.5} color="white">
        {Math.abs(Math.round(currentSpeed.current))} km/h
      </Text>

      <RigidBody
        ref={rigidBodyRef}
        colliders={"cuboid"}
        mass={800}
        friction={0.7}
        restitution={0.2}
        linearDamping={0.5}
        angularDamping={2}
        enabledRotations={[false, true, false]}
        position={[0, 3, 3]}
      >
        <group position={[0, 1.5, 0]}>
          {/* Car body */}
          <mesh castShadow>
            <boxGeometry args={[1, 0.8, 3]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>

          <group>
            {/* Front Windshield */}
            <mesh position={[0, 0.8, -1]} castShadow rotation={[1.8, 0, 0]}>
              <boxGeometry args={[0.8, 0.1, 1]} />
              <meshStandardMaterial color="black" transparent opacity={0.5} />
            </mesh>

            <mesh position={[0, 1.1, 0]} castShadow rotation={[0.15, 1.6, 1.6]}>
              <boxGeometry args={[0.1, 2, 1]} />
              <meshStandardMaterial color="hotpink" />
            </mesh>

            {/* Rear Windshield */}
            <mesh position={[0, 0.5, 1]} castShadow rotation={[1.2, 0, 0]}>
              <boxGeometry args={[0.8, 0.1, 1]} />
              <meshStandardMaterial color="gray" transparent opacity={0.5} />
            </mesh>
          </group>

          <group>
            {/* Headlights */}
            <mesh position={[0.4, -0.2, -1.5]} castShadow>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
            </mesh>
            <mesh position={[-0.4, -0.2, -1.5]} castShadow>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
            </mesh>
          </group>

          <group>
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
        </group>
      </RigidBody>
    </>
  );
}

export default Car;
