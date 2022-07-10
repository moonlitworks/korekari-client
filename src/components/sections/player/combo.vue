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

<script setup>
import { defineComponent, defineExpose, ref } from "vue";
import emitter from "@/services/emitter";
import Timer from "../../template/shrinking-timer.vue";

defineComponent({
  name: "ComboSection",
  components: {
    Timer,
  },
});

const timer = ref();
const combo = ref(0);
const shrink = ref(false);

function addCombo() {
  combo.value += 1;
  timer.value.resetTimer();
}

function resetCombo() {
  emitter.emit("lastCombo", combo.value);
  combo.value = 0;
  shrink.value = false;
}

defineExpose({
  addCombo,
  resetCombo,
});
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