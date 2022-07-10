<template>
  <circle class="pointer-shadow" ref="pointerShadow" />
</template>

<script setup>
import { ref, computed, defineComponent, defineProps, onMounted } from "vue";
import emitter from "@/services/emitter";

defineComponent({
  name: "ShadowSection",
});

const props = defineProps({
  id: String,
  radius: Number,
  thickness: Number,
  angle: Number,
});

const pointerShadow = ref();
const transform = computed(() => `rotate(${(props.angle + 360) % 360}deg)`);
const pointerRadius = computed(() => `${props.thickness / 2}px`);
const pointerRadiusEnd = computed(() => `${(props.thickness / 2) * 2}px`);

onMounted(() => {
  pointerShadow.value.addEventListener("animationend", () => {
    emitter.emit("shadow:remove", props.id);
  });
});
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