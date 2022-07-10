<template>
  <g>
    <path
      id="main-path"
      ref="mainPath"
      fill="none"
      :class="{ animate: animation.enabled }"
      :stroke="color"
      :stroke-opacity="opacity"
      :stroke-width="width + 'px'"
      :stroke-linecap="linecap"
      :d="calculatePathD(start, end, radius)"
    />
    <path
      v-if="shadow > 0"
      id="shadow-path"
      ref="shadowPath"
      fill="none"
      :stroke="color"
      :stroke-opacity="shadow"
      :stroke-width="width + 'px'"
      :stroke-linecap="linecap"
      :d="calculatePathD(start, end, radius)"
    />
  </g>
</template>

<script setup>
import {
  defineComponent,
  defineProps,
  defineExpose,
  ref,
  reactive,
  computed,
  onMounted,
} from "vue";
import { calculatePathD } from "@/services/angle";

defineComponent({
  name: "DynamicRingArc",
});

const props = defineProps({
  radius: Number,
  width: Number,
  color: String,
  opacity: Number,
  linecap: String,
  shadow: Number,
  init: {
    angle: Number,
    percent: Number,
    speed: Number,
  },
});

const mainPath = ref();
const shadowPath = ref();
const start = ref(0);
const end = ref(359.9);
const animation = reactive({
  enabled: false,
  from: 0,
  to: 0,
  speed: "0s",
});

const pathLength = computed(() => {
  return mainPath.value.getTotalLength();
});

onMounted(() => {
  const startAngle = props.init?.angle ?? 0;
  const startPercent = props.init?.percent ?? 0;
  const startSpeed = props.init?.speed ?? 0;
  if (startAngle > 0) {
    setToAngle(startAngle, startSpeed);
  } else if (startPercent > 0) {
    setToPercent(startPercent, startSpeed);
  }
});

function currentOffset() {
  return Number(
    getComputedStyle(mainPath.value)
      .getPropertyValue("stroke-dashoffset")
      .replace("px", "")
  );
}

function setToAngle(angle, speed) {
  angle = Math.max(0, Math.min(angle, 359.9));
  const percent = ((angle + 360) % 360) / 360;
  setToPercent(percent, speed);
}

function setToPercent(percent, speed) {
  percent = Math.max(0.0, Math.min(percent, 1.0));
  animation.enabled = false;
  animation.from = currentOffset();
  animation.to = pathLength.value * (1 - percent);
  animation.speed = speed + "s";
  requestAnimationFrame(() => {
    animation.enabled = true;
  });
}

defineExpose({
  setToAngle,
  setToPercent,
});
</script>

<style scoped>
#main-path {
  stroke-dasharray: v-bind(pathLength) v-bind(pathLength);
  stroke-dashoffset: v-bind(pathLength);
}

#shadow-path {
  stroke-dasharray: v-bind(pathLength) v-bind(pathLength);
  stroke-dashoffset: v-bind("animation.to");
}

#main-path.animate {
  animation: fill v-bind("animation.speed") ease-out forwards;
}

@keyframes fill {
  0% {
    stroke-dashoffset: v-bind("animation.from");
  }
  100% {
    stroke-dashoffset: v-bind("animation.to");
  }
}
</style>