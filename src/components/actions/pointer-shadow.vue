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
  r: 5px;
  fill: white;
  transform-origin: 50% 50%;
  transform: v-bind(transform);
  animation: action-pointer-pulse 0.5s ease-out forwards;
}

@keyframes action-pointer-pulse {
  0% {
    r: 5px;
  }
  100% {
    r: 10px;
    opacity: 0;
  }
}
</style>