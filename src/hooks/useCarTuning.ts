import { useControls as useLevaControls } from "leva";

const useCarTuning = () => {
  return useLevaControls("Car Tuning", {
    topSpeed: {
      value: 15,
      min: 1,
      max: 40,
      step: 0.1
    },
    acceleration: {
      value: 1.5,
      min: 0.1,
      max: 10,
      step: 0.1
    },
    friction: {
      value: 0.1,
      min: 0.001,
      max: 2,
      step: 0.001
    }
  });
};

export default useCarTuning;
