<template>
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
    this.$refs["interaction-screen"].focus();
  },
  methods: {
    interaction() {
      this.$emit("interaction");
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
</style>