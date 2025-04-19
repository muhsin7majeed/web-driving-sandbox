export type CarTuningParams = {
  topSpeed: number;
  reverseRatio?: number;
  accelerationRatio?: number;
  frictionRatio?: number;
  turnSpeed?: number;
  reverseTurnSpeed?: number;
};

const getCarConstants = ({
  topSpeed,
  reverseRatio = 0.3,
  accelerationRatio = 0.02,
  frictionRatio = 0.015,
  turnSpeed = 0.06,
  reverseTurnSpeed = 0.02
}: CarTuningParams) => {
  return {
    maxSpeed: topSpeed,
    maxReverseSpeed: topSpeed * reverseRatio,
    acceleration: topSpeed * accelerationRatio,
    friction: topSpeed * frictionRatio,
    turnSpeed: topSpeed * turnSpeed,
    reverseTurnSpeed: topSpeed * reverseTurnSpeed
  };
};

export default getCarConstants;
