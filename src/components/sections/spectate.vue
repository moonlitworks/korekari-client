<template>
  <div>
    <button @click.left.prevent="toggleSpectateMode">
      Spectate Mode: {{ isSpectateMode ? "ON" : "OFF" }}
    </button>
  </div>
</template>

<script>
export default {
  name: "Spectate",
  props: {
    isSpectateMode: Boolean,
  },
  methods: {
    toggleSpectateMode() {
      this.$emit("toggleSpectateMode");
    },
  },
};
</script>

<style scoped>
div {
  position: absolute;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  left: 35px;
  bottom: 150px;
}
</style>