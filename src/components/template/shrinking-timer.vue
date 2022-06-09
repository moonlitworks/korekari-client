<template>
  <div id="timer" ref="timer" :class="{ shrink: shrink }"></div>
</template>

<script>
export default {
  name: "ShrinkingTimer",
  emits: ["timeout"],
  props: {
    duration: Number,
    width: Number,
    fromColor: String,
    toColor: String,
  },
  data: () => ({
    shrink: true,
  }),
  mounted() {
    this.$refs["timer"].addEventListener("animationend", () => {
      this.$emit("timeout");
    });
  },
  methods: {
    resetTimer() {
      this.shrink = false;
      requestAnimationFrame(() => {
        this.shrink = true;
      });
    },
  },
};
</script>

<style>
#timer.shrink {
  content: " ";
  height: 7px;
  border-radius: 20px;
  margin: auto;
  animation: shrink v-bind(duration + "s") linear forwards;
}

@keyframes shrink {
  0% {
    width: v-bind(width + "px");
    background-color: v-bind(fromColor);
  }
  100% {
    width: 0px;
    background-color: v-bind(toColor);
  }
}
</style>