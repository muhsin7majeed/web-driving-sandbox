/**
 * Clamps a value between a minimum and maximum value
 * @param value - The value to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped value
 */
const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export default clamp;

/**
 * Converts an angle in degrees to radians
 * @param angle - The angle in degrees
 * @returns The angle in radians
 */
const angleToRadians = (angle: number) => {
  return angle * (Math.PI / 180);
};

export { angleToRadians };
