<template>
  <svg :viewBox="viewBox" :width="boxSize" :height="boxSize">
    <circle
      v-if="!!backring"
      id="back-ring"
      :r="ringRadius"
      :stroke="backringColor"
      :stroke-opacity="backringOpacity"
      :stroke-width="backringWidth"
    />

    <circle
      id="main-ring"
      :r="ringRadius"
      :stroke="ringColor"
      :stroke-opacity="ringOpacity"
      :stroke-width="ringWidth"
    />

    <DynamicRingArc
      id="arc"
      ref="arcElement"
      :radius="radius"
      :width="width"
      :color="arc?.color ?? 'white'"
      :opacity="arc?.opacity ?? 0"
      :shadow="arc?.shadow ?? 0"
      :linecap="arc?.linecap ?? 'round'"
      :init="{
        angle: arc?.startAngle ?? 0,
        percent: arc?.startPercent ?? 0,
        speed: arc?.startSpeed ?? 0,
      }"
    />
  </svg>
</template>

<script setup>
import { defineComponent, defineProps, defineExpose, ref, computed } from "vue";
import DynamicRingArc from "./dynamic-ring-arc.vue";

defineComponent({
  name: "DynamicRing",
  components: {
    DynamicRingArc,
  },
});

const props = defineProps({
  side: Number,
  width: Number,
  color: String,
  opacity: Number,
  backring: {
    color: String,
    opacity: Number,
    width: Number,
  },
  arc: {
    color: String,
    opacity: Number,
    shadow: Number,
    linecap: String,
    startAngle: Number,
    startPercent: Number,
    startSpeed: Number,
  },
});

const arcElement = ref();

const radius = computed(() => props.side / 2);
const boxSize = computed(() => `${props.side}px`);
const viewBox = computed(() => `0 0 ${props.side} ${props.side}`);
const ringRadius = computed(() => `${radius.value}px`);
const ringColor = computed(() => props.color);
const ringOpacity = computed(() => props.opacity);
const ringWidth = computed(() => `${props.width}px`);
const backringColor = computed(() => {
  if (!props.backring) return undefined;
  return props.backring.color;
});
const backringOpacity = computed(() => {
  if (!props.backring) return undefined;
  return props.backring.opacity;
});
const backringWidth = computed(() => {
  if (!props.backring) return undefined;
  return `${props.backring.width}px`;
});

function setToAngle(angle, speed) {
  arcElement.value.setToAngle(angle, speed);
}

function setToPercent(percent, speed) {
  arcElement.value.setToPercent(percent, speed);
}

defineExpose({
  setToAngle,
  setToPercent,
});
</script>

<style>
svg {
  overflow: visible;
}

#back-ring {
  cy: 50%;
  cx: 50%;
  fill: none;
}

#main-ring {
  cy: 50%;
  cx: 50%;
  fill: none;
}
</style>