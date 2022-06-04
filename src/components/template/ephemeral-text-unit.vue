<template>
  <div class="unit" ref="unit">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "EphemeralTextUnit",
  props: {
    id: String,
    text: String,
    color: String,
    duration: Number,
    endXPosition: String,
    endYPosition: String,
  },
  mounted() {
    this.$refs["unit"].addEventListener("animationend", () => {
      this.$emit("end", this.id);
    });
  },
};
</script>

<style scoped>
.unit {
  color: v-bind(color);
  transform-origin: 0 0;
  animation-name: disappear;
  animation-direction: normal;
  animation-duration: v-bind(duration + "s");
  animation-fill-mode: both;
  animation-iteration-count: 1;
  animation-timing-function: ease-out;
}

@keyframes disappear {
  from {
    opacity: 1;
    transform: translateX(0px) translateY(0px);
  }
  to {
    opacity: 0;
    transform: translateX(v-bind(endXPosition)) translateY(v-bind(endYPosition));
  }
}
</style>