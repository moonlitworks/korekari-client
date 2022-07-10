<template>
  <div id="spectate-section">
    <!-- <div v-if="isSpectateMode">
      <img id="spectator-icon" src="@/assets/spectator.png" />
      <div>Spectator Mode is ON</div>
      <div>[Q] to turn it off</div>
    </div> -->

    <button @click.left.prevent="toggleSpectateMode">
      Spectate Mode: {{ isSpectateMode ? "ON" : "OFF" }}
    </button>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, defineExpose } from "vue";

defineComponent({
  name: "SpectateSection",
});

defineProps({
  isSpectateMode: Boolean,
});

function toggleSpectateMode() {
  this.$emit("toggleSpectateMode");
}

defineExpose({
  toggleSpectateMode,
});
</script>

<style scoped>
#spectate-section {
  position: absolute;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  right: 10px;
  bottom: 40px;
}

#spectate-section > button {
  padding: 5px;
}

#spectator-icon {
  width: 50px;
  opacity: 0.7;
}
</style>