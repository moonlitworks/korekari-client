<template>
  <g>
    <ActionArc
      :radius="radius"
      :thickness="thickness"
      color="rgba(255, 0, 0, 0.3)"
      :startAngle="defaultStartAngle"
      :endAngle="defaultEndAngle"
    />
    <ActionArc
      :radius="radius"
      :thickness="thickness"
      color="rgba(255, 0, 0, 0.7)"
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
    radius: Number,
    thickness: Number,
    defaultStartAngle: Number,
    defaultEndAngle: Number,
    criticalStartAngle: Number,
    criticalEndAngle: Number,
  },
};
</script>

<style>
</style>