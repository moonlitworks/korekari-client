<template>
  <path
    d="M55.715,0c20.867,13.199,39.669,19.466,55.855,17.992
    c2.838,57.108-18.25,90.841-55.633,104.888C19.844,109.718-1.502,77.422,0.083,17.107C19.069,18.103,37.688,14.01,55.715,0
    L55.715,0L55.715,0z"
  />
</template>

<script setup>
import { computed, defineComponent, defineProps, ref } from "vue";
import { calculateX, calculateY } from "@/services/angle";

defineComponent({
  name: "ShieldIcon",
});

const props = defineProps({
  angle: Number,
});

const translateOffset = ref(53);
const scale = ref(0.2);

const transform = computed(() => {
  return `translateX(${calculateX(
    props.angle,
    translateOffset.value
  )}%) translateY(${calculateY(props.angle, translateOffset.value)}%) scale(${
    scale.value
  })`;
});
</script>

<style scoped>
path {
  transform: v-bind(transform);
  transform-origin: 60% 60%;
}
</style>