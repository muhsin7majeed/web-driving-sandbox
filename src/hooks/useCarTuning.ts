import { useControls as useLevaControls } from "leva";

const useCarTuning = () => {
  return useLevaControls("Car Tuning", {
    topSpeed: {
      value: 5,
      min: 0.1,
      max: 5,
      step: 0.01
    },
    acceleration: {
      value: 0.4,
      min: 0.001,
      max: 2,
      step: 0.001
    },
    friction: {
      value: 0.02,
      min: 0.001,
      max: 2,
      step: 0.001
    },
    turnSpeed: {
      value: 0.1,
      min: 0.001,
      max: 2,
      step: 0.001
    }
  });
};

export default useCarTuning;
