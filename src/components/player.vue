<template>
  <div id="self-hp-bar">
    <div id="self-hp"></div>
  </div>
</template>

<script>
export default {
  name: "Player",
  props: {
    maxHp: Number,
  },
  data: () => ({
    hp: 0,
  }),
  created() {
    this.hp = this.maxHp;
  },
  computed: {
    hpPercentage() {
      const pct = (this.hp / this.maxHp) * 100;
      return `${pct}%`;
    },
  },
  methods: {
    receiveDamage(damage) {
      this.hp -= damage;
      if (this.hp <= 0) {
        this.hp = this.maxHp;
      }
    },
  },
};
</script>

<style scoped>
#self-hp-bar {
  position: absolute;
  width: 100%;
  height: 10px;
  bottom: 0;
  background-color: gainsboro;
}

#self-hp {
  background-color: rgba(255, 0, 0, 0.8);
  width: v-bind(hpPercentage);
  height: 100%;
}
</style>