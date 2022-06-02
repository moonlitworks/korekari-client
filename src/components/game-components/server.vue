<template>
  <span id="connectStatus">{{ connected ? "Connected" : "Mocked" }}</span>
</template>

<script>
export default {
  name: "Server",
  props: {
    gm: undefined,
  },
  data: () => ({
    connected: false,
  }),
  methods: {
    addTargetIfEmpty() {
      const hasMonster = ![undefined, "DEAD", "DYING"].includes(
        this.gm.monster?.state
      );
      const canAdd = this.gm.ring.activeTargets.length < 4;
      if (!hasMonster || !canAdd) return;

      const angle = Math.floor(Math.random() * 361);
      const hits = 1;
      const type =
        Math.random() < 0.8
          ? "ATTACK"
          : Math.random() < 0.8
          ? "DEFEND"
          : Math.random() < 0.8
          ? "HEAL"
          : "SKILL";
      const color = (() => {
        switch (type) {
          case "DEFEND":
            return "green";
          case "HEAL":
            return "gold";
          case "SKILL":
            return "blue";
          case "ATTACK":
          default:
            return "red";
        }
      })();
      this.$emit("addTarget", { angle, hits, type, color });
    },
    send(data) {
      console.log("sent to server", data);
    },
    receive(data) {
      console.log("received from server", data);
    },
    spawnMonster(delay) {
      setTimeout(() => {
        this.$emit("setMonster", {
          name: "Dragorm",
          level: 1,
          maxHp: 100,
          element: "FIRE",
          hitConfig: {
            normalWidth: 50,
            criticalWidth: 35,
            normalDamage: 1,
            criticalDamage: 10,
            normalAttack: 1,
          },
          skills: [
            {
              id: "FIRE_BREATH",
              name: "Fire Breath",
              element: "FIRE",
              damage: 10,
              dodgeWidth: 40,
            },
          ],
        });
      }, delay);
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