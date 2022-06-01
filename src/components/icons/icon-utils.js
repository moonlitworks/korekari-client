const toRadians = deg => (deg + 270) * (Math.PI / 180);

export const calculateX = (angle, offset) => {
  return offset * Math.cos(toRadians(angle));
}

export const calculateY = (angle, offset) => {
  return offset * Math.sin(toRadians(angle));
}