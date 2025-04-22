import Building from "@/components/building/building";

const City = () => {
  const buildings = [];

  for (let x = -50; x < 50; x += 10) {
    for (let z = -50; z < 50; z += 10) {
      const height = Math.random() * 10 + 5;
      buildings.push(<Building key={`${x}-${z}`} position={[x, height / 2, z]} size={[5, height, 5]} />);
    }
  }
  return <group>{buildings}</group>;
};

export default City;
