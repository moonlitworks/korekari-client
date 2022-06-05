<template>
  <div v-show="combo > 0" id="container">
    <div id="counter">Combo {{ combo }}</div>
    <div id="timer" ref="timer" :class="{ shrink: shrink }"></div>
  </div>
</template>

<script>
export default {
  name: "Combo",
  data: () => ({
    combo: 0,
    shrink: false,
  }),
  mounted() {
    this.$refs["timer"].addEventListener("animationend", () => {
      this.resetCombo();
    });
  },
  methods: {
    addCombo() {
      this.shrink = false;
      requestAnimationFrame(() => {
        this.shrink = true;
        this.combo += 1;
      });
    },
    resetCombo() {
      this.$emit("lastCombo", this.combo);
      this.combo = 0;
      this.shrink = false;
    },
  },
};
</script>

<style scoped>
#container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: 50% 50%;
  transform: translateX(-300px) translateY(-300px);
  text-align: center;
  width: 200px;
}

#counter {
  font-size: 30px;
}

#timer.shrink {
  content: " ";
  height: 7px;
  border-radius: 20px;
  margin: auto;
  animation: shrink 5s linear forwards;
}

@keyframes shrink {
  0% {
    width: 120px;
    background-color: orangered;
  }
  100% {
    width: 0px;
    background-color: snow;
  }
}
</style>