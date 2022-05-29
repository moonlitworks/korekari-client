<template>
  <path
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    fill="none"
    :d="calculatePathD(startAngle, endAngle)"
  />
</template>

<script>
export default {
  name: "ActionArc",
  props: {
    radius: Number,
    thickness: Number,
    color: String,
    startAngle: Number,
    endAngle: Number,
  },
  computed: {
    strokeWidth() {
      return `${this.thickness}px`;
    },
    arcRadius() {
      return this.radius - this.thickness;
    },
  },
  methods: {
    calculatePathD(startAngle, endAngle) {
      const startX =
        this.radius +
        this.calculateAngleX(this.toRadians(startAngle), this.arcRadius);
      const startY =
        this.radius +
        this.calculateAngleY(this.toRadians(startAngle), this.arcRadius);
      const endX =
        this.radius +
        this.calculateAngleX(this.toRadians(endAngle), this.arcRadius);
      const endY =
        this.radius +
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
      return deg * (Math.PI / 180);
    },
  },
};
</script>

<style>
</style>