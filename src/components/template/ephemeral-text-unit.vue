<template>
  <div class="unit" ref="unit">
    {{ text }}
  </div>
</template>

<script setup>
import { defineComponent, defineProps, defineEmits, onMounted, ref } from "vue";
defineComponent({
  name: "EphemeralTextUnit",
});

const props = defineProps({
  id: String,
  text: String,
  color: String,
  duration: Number,
  endXPosition: String,
  endYPosition: String,
});

const emit = defineEmits(["end"]);

const unit = ref();

onMounted(() => {
  unit.value.addEventListener("animationend", () => {
    emit("end", props.id);
  });
});
</script>

<style scoped>
.unit {
  color: v-bind(color);
  transform-origin: 0 0;
  animation-name: disappear;
  animation-direction: normal;
  animation-duration: v-bind(duration + "s");
  animation-fill-mode: both;
  animation-iteration-count: 1;
  animation-timing-function: ease-out;
}

@keyframes disappear {
  from {
    opacity: 1;
    transform: translateX(0px) translateY(0px);
  }
  to {
    opacity: 0;
    transform: translateX(v-bind(endXPosition)) translateY(v-bind(endYPosition));
  }
}
</style>