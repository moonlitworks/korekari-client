export const toRadians = deg => (deg + 270) * (Math.PI / 180);

export const calculateX = (angle, offset) => {
  return offset * Math.cos(toRadians(angle));
}

export const calculateY = (angle, offset) => {
  return offset * Math.sin(toRadians(angle));
}

export const isLargeArc = (start, end) => Math.abs((end - start) % 360) > 180

export const calculatePathD = (startAngle, endAngle, radius, innerRadius = radius) => {
  const startX = radius + calculateX(startAngle, innerRadius);
  const startY = radius + calculateY(startAngle, innerRadius);
  const endX = radius + calculateX(endAngle, innerRadius);
  const endY = radius + calculateY(endAngle, innerRadius);
  const largeArcFlag = isLargeArc(startAngle, endAngle) ? "1" : "0";
  return `M ${startX} ${startY} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
}

export const calculateAngle = (element) => {
  const style = window.getComputedStyle(element, null);
  const transform =
    style.getPropertyValue("-webkit-transform") ||
    style.getPropertyValue("-moz-transform") ||
    style.getPropertyValue("-ms-transform") ||
    style.getPropertyValue("-o-transform") ||
    style.getPropertyValue("transform") ||
    undefined;
  const matrixRegex = transform.match(
    /matrix\((?<a>.+), (?<b>.+), (?<c>.+), (?<d>.+), (?<e>.+), (?<f>.+)\)/
  );

  const { a, b } = matrixRegex.groups;
  if (!a || !b) return undefined;

  const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  return (angle + 360) % 360;
}