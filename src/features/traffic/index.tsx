import NPCCar from "@/components/npc-car";

const Traffic = () => {
  return (
    <group>
      <NPCCar startPos={[5, 1, 0]} speed={10} />
      <NPCCar startPos={[-5, 1, 0]} speed={8} />
    </group>
  );
};

export default Traffic;
