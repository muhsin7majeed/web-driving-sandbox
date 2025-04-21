import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import { BoxGeometry, CylinderGeometry, SphereGeometry } from "three";

type ObstacleProps = {
  count?: number;
  areaSize?: number;
};

const COLORS = ["red", "orange", "purple", "teal", "blue", "brown"];

const Obstacles = ({ count = 20, areaSize = 50 }: ObstacleProps) => {
  const obstacles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Random position within area
      const x = (Math.random() - 0.5) * areaSize;
      const z = (Math.random() - 0.5) * areaSize;
      const y = 0.5 + Math.random() * 2; // Height above ground
      
      // Random rotation
      const rotation = Math.random() * Math.PI * 2;
      
      // Random type (0 = box, 1 = cylinder, 2 = sphere)
      const type = Math.floor(Math.random() * 3);
      
      // Random color
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      // Random size
      const size = 0.5 + Math.random() * 2;
      
      return {
        id: i,
        position: [x, y, z],
        rotation: [0, rotation, 0],
        type,
        color,
        size
      };
    });
  }, [count, areaSize]);
  
  return (
    <>
      {obstacles.map((obstacle) => {
        const { id, position, rotation, type, color, size } = obstacle;
        
        return (
          <RigidBody
            key={id}
            colliders="cuboid"
            position={position as [number, number, number]}
            rotation={rotation as [number, number, number]}
            restitution={0.4}
            friction={0.7}
          >
            {type === 0 && (
              <mesh castShadow>
                <boxGeometry args={[size, size, size]} />
                <meshStandardMaterial color={color} />
              </mesh>
            )}
            
            {type === 1 && (
              <mesh castShadow>
                <cylinderGeometry args={[size/2, size/2, size, 16]} />
                <meshStandardMaterial color={color} />
              </mesh>
            )}
            
            {type === 2 && (
              <mesh castShadow>
                <sphereGeometry args={[size/2, 16, 16]} />
                <meshStandardMaterial color={color} />
              </mesh>
            )}
          </RigidBody>
        );
      })}
    </>
  );
};

export default Obstacles; 