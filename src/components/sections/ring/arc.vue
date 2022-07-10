<template>
  <path
    :stroke="arc.color"
    :stroke-opacity="arc.opacity"
    :stroke-width="strokeWidth"
    :stroke-linecap="round ? 'round' : 'butt'"
    :filter="filter"
    fill="none"
    :d="calculatePathD(arc.start, arc.end, arc.radius, arcRadius)"
  />
</template>

<script setup>
import { computed, defineComponent, defineProps } from "vue";
import { calculatePathD } from "@/services/angle";

defineComponent({
  name: "ArcUnit",
});

const props = defineProps({
  arc: {
    radius: Number,
    thickness: Number,
    color: String,
    opacity: Number,
    start: Number,
    end: Number,
    round: Boolean,
    filter: String,
  },
});

const round = computed(() => {
  return props.arc.round ? "round" : "butt";
});

const filter = computed(() => {
  return props.arc.filter ?? "scale(1.0)";
});

const strokeWidth = computed(() => {
  return `${props.arc.thickness}px`;
});

const arcRadius = computed(() => {
  return props.arc.radius - props.arc.thickness;
});
</script>