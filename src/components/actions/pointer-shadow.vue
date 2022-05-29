<template>
  <circle class="action-pointer-shadow" />
</template>

<script>
export default {
  name: "ActionPointerShadow",
  props: {
    id: String,
    radius: Number,
    thickness: Number,
    angle: Number,
  },
  computed: {
    transform() {
      return `rotate(${this.normalizedAngle(this.angle)}deg)`;
    },
    pointerRadius() {
      return `${this.thickness / 2}px`;
    },
    pointerRadiusEnd() {
      return `${(this.thickness / 2) * 2}px`;
    },
  },
  created() {
    setTimeout(() => {
      this.$emit("remove", this.id);
    }, 1000);
  },
  methods: {
    normalizedAngle(angle) {
      return (angle + 90) % 360;
    },
  },
};
</script>

<style scoped>
.action-pointer-shadow {
  cx: v-bind(radius);
  cy: v-bind(thickness);
  r: v-bind(pointerRadius);
  fill: gray;
  transform-origin: 50% 50%;
  transform: v-bind(transform);
  animation: action-pointer-pulse 0.5s ease-out forwards;
}

@keyframes action-pointer-pulse {
  0% {
    r: v-bind(pointerRadius);
  }
  100% {
    r: v-bind(pointerRadiusEnd);
    opacity: 0;
  }
}
</style>