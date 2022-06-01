<template>
  <circle class="pointer-shadow" />
</template>

<script>
export default {
  name: "Shadow",
  props: {
    id: String,
    radius: Number,
    thickness: Number,
    angle: Number,
  },
  computed: {
    transform() {
      return `rotate(${(this.angle + 360) % 360}deg)`;
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
};
</script>

<style scoped>
.pointer-shadow {
  cx: v-bind(radius);
  cy: v-bind(thickness);
  r: v-bind(pointerRadius);
  fill: #474747;
  transform-origin: 50% 50%;
  transform: v-bind(transform);
  animation: pointer-pulse 0.5s ease-out forwards;
}

@keyframes pointer-pulse {
  0% {
    r: v-bind(pointerRadius);
    opacity: 1;
  }
  100% {
    r: v-bind(pointerRadiusEnd);
    opacity: 0;
  }
}
</style>