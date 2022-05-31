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
  mounted() {
    // socket.on("data", () => receive(data))

    // create mock server events
    setInterval(() => {
      this.addTarget();
    }, 1000);
  },
  methods: {
    addTarget() {
      // this.$emit("addTarget", Math.floor(Math.random() * (360 + 1)));
    },
    send(data) {
      console.log("sent to server", data);
    },
    receive(data) {
      console.log("received from server", data);
    },
  },
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