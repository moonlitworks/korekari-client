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
  methods: {
    arcColor(opacity) {
      if (!this.color) return `rgba(0, 0, 0, ${opacity})`;
      return `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`;
    },
  },
};
</script>

<style>
</style>