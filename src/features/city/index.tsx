import Building from "@/components/building/building";
import Road from "@/components/road";

function City() {
  const numRows = 5; // Number of rows of roads
  const numColumns = 5; // Number of columns of roads

  const roads = [];
  const buildings = [];

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColumns; j++) {
      roads.push(
        <Road key={`road-${i}-${j}`} position={[i * 15, 0, j * 15]} /> // Adjust spacing
      );

      if (Math.random() < 0.8) {
        // 80% chance to place a building
        buildings.push(<Building key={`building-${i}-${j}`} position={[i * 15, 5, j * 15]} />);
      }
    }
  }

  return (
    <>
      {roads}
      {buildings}
    </>
  );
}

export default City;
