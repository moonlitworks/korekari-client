<template>
  <img
    id="monster"
    :class="{ flinch: flinch }"
    src="https://i.pinimg.com/originals/39/c5/a8/39c5a8ef2f587d4a7f742ba16371ad48.gif"
  />

  <div id="monster-hp-bar">
    <div id="monster-hp"></div>
  </div>
</template>

<script>
export default {
  name: "Monster",
  props: {
    maxHp: Number,
  },
  data: () => ({
    hp: 0,
    flinch: false,
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
      setTimeout(() => {
        this.flinch = false;
      }, 100);
      this.flinch = true;
      if (this.hp <= 0) {
        this.hp = this.maxHp;
      }
    },
  },
};
</script>

<style scoped>
#monster {
  position: absolute;
  max-width: 100%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

#monster.flinch {
  filter: grayscale(100%);
}

#monster-hp-bar {
  height: 10px;
  background-color: gainsboro;
}

#monster-hp {
  background-color: rgba(255, 0, 0, 0.8);
  width: v-bind(hpPercentage);
  height: 100%;
}
</style>