<template>
  <span id="connectStatus">{{
    connected ? "Connected" : "Not connected"
  }}</span>
</template>

<script>
export default {
  name: "Server",
  data: () => ({
    connected: false,
  }),
};
</script>

<style scoped>
#connectStatus {
  position: absolute;
  right: 20px;
  top: 20px;
  color: gray;
}
</style>