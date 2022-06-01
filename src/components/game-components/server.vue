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
  mounted() {
    // mock server events
    setInterval(() => {
      this.addTargetIfEmpty();
    }, 1000);
  },
  methods: {
    addTargetIfEmpty() {
      const hasMonster = this.gm.monsterObject !== undefined;
      const canAdd = this.gm.ring.activeTargets.length < 2;
      if (!hasMonster || !canAdd) return;

      const angle = Math.floor(Math.random() * 361);
      const hits = 1;
      const type = Math.random() > 0.95 ? "SKILL" : "ATTACK";
      const color = type === "SKILL" ? "blue" : "red";
      this.$emit("addTarget", { angle, hits, type, color });
    },
    send(data) {
      console.log("sent to server", data);
    },
    receive(data) {
      console.log("received from server", data);
    },
    spawnPlayer() {
      this.$emit("setPlayer", {
        name: "Player1",
        level: 1,
        maxHp: 100,
        items: [
          {
            id: "STICK",
            type: "WEAPON",
            name: "Stick",
            element: "Neutral",
            damage: 1,
          },
        ],
      });
    },
    spawnMonster(delay) {
      setTimeout(() => {
        this.$emit("setMonster", {
          name: "Goop",
          level: 1,
          maxHp: 100,
          element: "NEUTRAL",
          hitConfig: {
            normalWidth: 50,
            criticalWidth: 35,
            normalDamage: 1,
            criticalDamage: 10,
            normalAttack: 1,
          },
          skills: [
            {
              id: "SLIME",
              name: "Slime",
              element: "NEUTRAL",
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