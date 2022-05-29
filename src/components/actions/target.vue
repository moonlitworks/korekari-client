<template>
  <g>
    <ActionArc
      :radius="radius"
      :thickness="thickness"
      :color="arcColor(0.3)"
      :startAngle="defaultStartAngle"
      :endAngle="defaultEndAngle"
    />
    <ActionArc
      :radius="radius"
      :thickness="thickness"
      :color="arcColor(0.7)"
      :startAngle="criticalStartAngle"
      :endAngle="criticalEndAngle"
    />
  </g>
</template>

<script>
import ActionArc from "./arc.vue";
export default {
  name: "ActionTarget",
  components: {
    ActionArc,
  },
  props: {
    id: String,
    color: {
      r: Number,
      g: Number,
      b: Number,
    },
    radius: Number,
    thickness: Number,
    defaultStartAngle: Number,
    defaultEndAngle: Number,
    criticalStartAngle: Number,
    criticalEndAngle: Number,
  },
  data: () => ({
    active: false,
  }),
  mounted() {
    this.active = true;
  },
  methods: {
    arcColor(opacity) {
      if (!this.color) return `rgba(0, 0, 0, ${opacity})`;
      return `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`;
    },
    checkHit(angle) {
      if (!this.active) return undefined;

      if (angle >= this.criticalStartAngle && angle <= this.criticalEndAngle) {
        this.inactivateTemporarily(777);
        return "CRITICAL";
      } else if (
        angle >= this.defaultStartAngle &&
        angle <= this.defaultEndAngle
      ) {
        this.inactivateTemporarily(777);
        return "HIT";
      } else {
        return undefined;
      }
    },
    inactivateTemporarily(delay) {
      setTimeout(() => {
        this.active = true;
      }, delay);
      this.active = false;
    },
  },
};
</script>

<style>
</style>