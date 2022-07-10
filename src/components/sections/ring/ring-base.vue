<template>
  <svg id="ring-box" ref="ringBox">
    <circle v-if="showCenter" id="centerpoint" cy="50%" cx="50%" r="5" />
    <circle id="ring-backdrop" />
    <circle id="ring" ref="ring" />
    <g id="targets">
      <Target
        ref="targetElement"
        v-for="target in targetList"
        :key="target.id"
        :id="target.id"
        :radius="radius"
        :thickness="thickness"
        :type="target.type"
        :color="target.color"
        :angle="target.angle"
        :start="target.start"
        :end="target.end"
        :bonusStart="target.bonusStart"
        :bonusEnd="target.bonusEnd"
        :lifetime="target.lifetime"
        :hits="target.hits"
        :strength="target.strength"
      />
    </g>
    <g id="shadows">
      <Shadow
        ref="shadowElement"
        v-for="shadow in shadowList"
        :key="shadow.id"
        :id="shadow.id"
        :radius="radius"
        :thickness="thickness"
        :angle="shadow.angle"
      />
    </g>
    <circle id="pointer" ref="pointer" />
  </svg>
</template>

<script setup>
import {
  computed,
  defineComponent,
  defineProps,
  defineExpose,
  ref,
  onMounted,
} from "vue";
import { uuid } from "vue-uuid";
import emitter from "@/services/emitter";
import { calculateAngle } from "@/services/angle";
import Target from "./target.vue";
import Shadow from "./shadow.vue";

defineComponent({
  name: "RingBase",
  components: {
    Target,
    Shadow,
  },
});

defineProps({
  thickness: Number,
  speed: String,
  showCenter: Boolean,
});

const pointer = ref();
const ringBox = ref();
const radius = computed(() => {
  return ringBox.value.clientWidth / 2;
});

const targetElement = ref();
const targetList = ref([]);
const targets = computed(() => {
  if (targetList.value.length <= 0) return [];
  return targetElement.value;
});

function removeTarget(id) {
  targetList.value = targetList.value.filter((x) => x.id !== id);
}

function hitTarget(id) {
  targets.value.find((x) => x.id === id)?.handleHit();
}

function hit() {
  const currentAngle = calculateAngle(pointer.value);
  addShadow(currentAngle);
  const hits = targets.value
    .filter((target) => target.hitType(currentAngle))
    .map((target) => ({
      ...target.toObject(),
      hitType: target.hitType(currentAngle),
    }));
  return {
    angle: currentAngle,
    hits,
  };
}

// TODO: update
function addTarget(
  rawData,
  id,
  type,
  angle,
  color,
  size,
  bonus,
  lifetime,
  hits
) {
  targetList.value.push({
    id: id ?? uuid.v4(),
    type,
    color,
    lifetime,
    hits,
    angle,
    start: angle - size,
    end: angle + size,
    bonusStart: bonus ? angle - bonus : undefined,
    bonusEnd: bonus ? angle + bonus : undefined,
    strength: rawData.strength,
  });
}

function fadeTarget(id, inactivate = false) {
  targets.value.find((x) => x.id === id)?.fade(inactivate);
}

const shadowList = ref([]);
function removeShadow(id) {
  shadowList.value = shadowList.value.filter((x) => x.id !== id);
}

function addShadow(angle) {
  shadowList.value.push({
    id: uuid.v4(),
    angle,
  });
}

onMounted(() => {
  emitter.on("shadow:remove", removeShadow);
  emitter.on("target:remove", removeTarget);
});

defineExpose({
  hit,
  hitTarget,
  targetList,
  addTarget,
  fadeTarget,
});
</script>

<style scoped>
:root {
  --rotate-speed: 3s;
}

#ring-box {
  overflow: visible;
  position: absolute;
  display: inline-block;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  pointer-events: none;
  transform-box: fill-box;
  transform-origin: 50% 50%;
  transform: translateX(-50%) translateY(-50%);
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

#ring-backdrop {
  cx: 50%;
  cy: 50%;
  r: calc(50% - v-bind(thickness + "px"));
  stroke: black;
  stroke-opacity: 0.4;
  stroke-width: v-bind((thickness + thickness/2) + "px");
  fill: none;
}

#ring {
  cx: 50%;
  cy: 50%;
  r: calc(50% - v-bind(thickness + "px"));
  stroke: white;
  stroke-opacity: 1;
  stroke-width: v-bind(thickness);
  fill: none;
}

#pointer {
  cx: 250;
  cy: v-bind(thickness + "px");
  r: v-bind((thickness/2) + "px");
  fill: #474747;
  transform-origin: 50% 50%;
  animation-name: pointer-rotate;
  animation-duration: v-bind(speed);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes pointer-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>