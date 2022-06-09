<template>
  <div v-show="combo > 0" id="container">
    <div id="counter">Combo {{ combo }}</div>
    <Timer
      ref="timer"
      :width="120"
      :duration="5"
      :fromColor="'orangered'"
      :toColor="'snow'"
      @timeout="resetCombo"
    />
  </div>
</template>

<script>
import Timer from "../template/shrinking-timer.vue";
export default {
  name: "ComboSection",
  emits: ["lastCombo"],
  components: {
    Timer,
  },
  data: () => ({
    combo: 0,
    shrink: false,
  }),
  methods: {
    addCombo() {
      this.combo += 1;
      this.$refs["timer"].resetTimer();
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