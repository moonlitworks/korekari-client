<template>
  <div id="timer" ref="timer" :class="{ shrink: shrink }"></div>
</template>

<script setup>
import {
  defineComponent,
  defineProps,
  defineEmits,
  defineExpose,
  onMounted,
  ref,
} from "vue";
defineComponent({
  name: "ShrinkingTimer",
});

defineProps({
  duration: Number,
  width: Number,
  fromColor: String,
  toColor: String,
});

const emit = defineEmits(["timeout"]);
const shrink = ref(true);

const timer = ref();
onMounted(() => {
  timer.value.addEventListener("animationend", () => {
    emit("timeout");
  });
});

function resetTimer() {
  shrink.value = false;
  requestAnimationFrame(() => {
    shrink.value = true;
  });
}

defineExpose({
  resetTimer,
});
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