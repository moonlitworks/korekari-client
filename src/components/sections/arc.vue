<template>
  <path
    :stroke="arc.color"
    :stroke-opacity="arc.opacity"
    :stroke-width="strokeWidth"
    :stroke-linecap="round ? 'round' : 'butt'"
    :filter="filter"
    fill="none"
    :d="calculatePathD(arc.start, arc.end)"
  />
</template>

<script>
import { calculateX, calculateY, isLargeArc } from "../../utils";
export default {
  name: "ArcUnit",
  props: {
    arc: {
      radius: Number,
      thickness: Number,
      color: String,
      opacity: Number,
      start: Number,
      end: Number,
      round: Boolean,
      filter: String,
    },
  },
  computed: {
    round() {
      return this.arc.round ? "round" : "butt";
    },
    filter() {
      return this.arc.filter ?? "scale(1.0)";
    },
    strokeWidth() {
      return `${this.arc.thickness}px`;
    },
    arcRadius() {
      return this.arc.radius - this.arc.thickness;
    },
  },
  methods: {
    calculatePathD(startAngle, endAngle) {
      const startX = this.arc.radius + calculateX(startAngle, this.arcRadius);
      const startY = this.arc.radius + calculateY(startAngle, this.arcRadius);
      const endX = this.arc.radius + calculateX(endAngle, this.arcRadius);
      const endY = this.arc.radius + calculateY(endAngle, this.arcRadius);
      const largeArcFlag = isLargeArc(startAngle, endAngle) ? "1" : "0";
      return `M ${startX} ${startY} A ${this.arcRadius} ${this.arcRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    },
  },
};
</script>