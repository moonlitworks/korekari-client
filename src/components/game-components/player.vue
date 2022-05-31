<template>
  <div id="feedback" :class="{ hurt: hurt }"></div>

  <div id="player-hp-bar">
    <div id="player-hp"></div>
  </div>

  <div id="player-info">
    <div>{{ player.name }} (Lv {{ player.level }})</div>
  </div>
</template>

<script>
export default {
  props: {
    player: {
      name: String,
      level: Number,
      maxHp: Number,
      items: [
        {
          id: String,
          type: String,
          name: String,
          element: String,
          damage: Number,
        },
      ],
    },
  },
  data: () => ({
    hp: 0,
    hurt: false,
  }),
  mounted() {
    this.hp = this.player.maxHp;
  },
  computed: {
    hpPercentage() {
      const pct = (this.hp / this.player.maxHp) * 100;
      return `${pct}%`;
    },
  },
  methods: {
    receiveDamage(damage) {
      this.hp -= damage;
      setTimeout(() => {
        this.hurt = false;
      }, 500);
      this.hurt = true;
      if (this.hp <= 0) this.hp = this.player.maxHp;
    },
  },
};
</script>

<style scoped>
#feedback {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
}

#feedback.hurt {
  opacity: 1;
  background-color: rgba(255, 99, 71, 0.5);
  animation: hurt-animation 0.5s ease forwards;
}

@keyframes hurt-animation {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

#player-hp-bar {
  position: absolute;
  width: 100%;
  height: 10px;
  bottom: 0;
  background-color: gainsboro;
}

#player-info {
  position: absolute;
  bottom: 12px;
  left: 10px;
}

#player-hp {
  background-color: rgba(255, 0, 0, 0.8);
  width: v-bind(hpPercentage);
  height: 100%;
}
</style>