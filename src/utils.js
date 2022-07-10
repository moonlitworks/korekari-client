export const toRadians = deg => (deg + 270) * (Math.PI / 180);

export const calculateX = (angle, offset) => {
  return offset * Math.cos(toRadians(angle));
}

export const calculateY = (angle, offset) => {
  return offset * Math.sin(toRadians(angle));
}

export const isLargeArc = (start, end) => Math.abs((end - start) % 360) > 180

export const toObject = x => JSON.parse(JSON.stringify(x))

export const randomBetween = (min, max) => Math.round(Math.random() * (max - min)) + min;
