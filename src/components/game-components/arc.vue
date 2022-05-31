<template>
  <path
    :stroke="arc.color"
    :stroke-opacity="arc.opacity"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    fill="none"
    :d="calculatePathD(arc.start, arc.end)"
  />
</template>

<script>
export default {
  name: "Arc",
  props: {
    arc: {
      radius: Number,
      thickness: Number,
      color: String,
      opacity: Number,
      start: Number,
      end: Number,
    },
  },
  computed: {
    strokeWidth() {
      return `${this.arc.thickness}px`;
    },
    arcRadius() {
      return this.arc.radius - this.arc.thickness;
    },
  },
  methods: {
    calculatePathD(startAngle, endAngle) {
      const startX =
        this.arc.radius +
        this.calculateAngleX(this.toRadians(startAngle), this.arcRadius);
      const startY =
        this.arc.radius +
        this.calculateAngleY(this.toRadians(startAngle), this.arcRadius);
      const endX =
        this.arc.radius +
        this.calculateAngleX(this.toRadians(endAngle), this.arcRadius);
      const endY =
        this.arc.radius +
        this.calculateAngleY(this.toRadians(endAngle), this.arcRadius);
      const largeArcFlag =
        Math.abs((endAngle - startAngle) % 360) <= 180 ? "0" : "1";
      return `M ${startX} ${startY} A ${this.arcRadius} ${this.arcRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    },
    calculateAngleX(angle, radius) {
      return radius * Math.cos(angle);
    },
    calculateAngleY(angle, radius) {
      return radius * Math.sin(angle);
    },
    toRadians(deg) {
      return (deg + 270) * (Math.PI / 180);
    },
  },
};
</script>

<style>
</style>