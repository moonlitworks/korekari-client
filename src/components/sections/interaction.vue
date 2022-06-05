<template>
  <div id="instructions">Controls: Left Mouse Button or Spacebar</div>
  <div
    id="interaction-screen"
    ref="interaction-screen"
    tabindex="-1"
    @mousedown.left.prevent="interaction"
    @keydown.space.prevent="interaction"
  ></div>
</template>

<script>
export default {
  name: "Interaction",
  mounted() {
    this.focus();
  },
  methods: {
    interaction() {
      this.$emit("interaction");
    },
    focus() {
      this.$refs["interaction-screen"].focus();
    },
  },
};
</script>

<style scoped>
#interaction-screen {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  user-select: none;
}

#instructions {
  color: rgb(160, 156, 156);
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>