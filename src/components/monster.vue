<template>
  <img
    id="monster-image"
    :class="{ flinch: flinch, critical: critical }"
    src="https://i.pinimg.com/originals/39/c5/a8/39c5a8ef2f587d4a7f742ba16371ad48.gif"
  />

  <div id="monster-hp-bar">
    <div id="monster-hp"></div>
  </div>

  <div id="monster-info">
    <div>{{ monster.name }} (Lv {{ monster.level }})</div>
  </div>
</template>

<script>
export default {
  props: {
    monster: {
      name: String,
      level: Number,
      maxHp: Number,
      element: String,
      hitConfig: {
        normalWidth: Number,
        normalDamage: Number,
        criticalWidth: Number,
        criticalDamage: Number,
        normalAttack: Number,
      },
      skills: [
        {
          name: String,
          element: String,
          damage: Number,
          dodgeWidth: Number,
        },
      ],
    },
  },
  data: () => ({
    hp: 0,
    flinch: false,
    critical: false,
  }),
  mounted() {
    this.hp = this.monster.maxHp;
  },
  computed: {
    hpPercentage() {
      const pct = (this.hp / this.monster.maxHp) * 100;
      return `${pct}%`;
    },
  },
  methods: {
    receiveDamage(damage, critical) {
      this.hp -= damage;
      setTimeout(() => {
        this.flinch = false;
        this.critical = false;
      }, 100);
      this.flinch = true;
      if (critical) {
        this.critical = true;
      }
      if (this.hp <= 0) {
        this.hp = this.monster.maxHp;
      }
    },
  },
};
</script>

<style scoped>
#monster-image {
  position: absolute;
  max-width: 100%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

#monster-image.flinch {
  filter: grayscale(100%);
}

#monster-image.critical {
  animation: image-shake 100ms linear infinite;
}

#monster-hp-bar {
  position: absolute;
  width: 100%;
  height: 10px;
  top: 0;
  background-color: gainsboro;
}

#monster-info {
  position: absolute;
  top: 12px;
  left: 10px;
}

#monster-hp {
  background-color: rgba(255, 0, 0, 0.8);
  width: v-bind(hpPercentage);
  height: 100%;
}

@keyframes image-shake {
  0% {
    transform: translateX(-50%) translateY(-50%) translate(2px, 1px)
      rotate(0deg);
  }
  10% {
    transform: translateX(-50%) translateY(-50%) translate(-1px, -2px)
      rotate(-1deg);
  }
  20% {
    transform: translateX(-50%) translateY(-50%) translate(-3px, 0px)
      rotate(1deg);
  }
  30% {
    transform: translateX(-50%) translateY(-50%) translate(0px, 2px)
      rotate(0deg);
  }
  40% {
    transform: translateX(-50%) translateY(-50%) translate(1px, -1px)
      rotate(1deg);
  }
  50% {
    transform: translateX(-50%) translateY(-50%) translate(-1px, 2px)
      rotate(-1deg);
  }
  60% {
    transform: translateX(-50%) translateY(-50%) translate(-3px, 1px)
      rotate(0deg);
  }
  70% {
    transform: translateX(-50%) translateY(-50%) translate(2px, 1px)
      rotate(-1deg);
  }
  80% {
    transform: translateX(-50%) translateY(-50%) translate(-1px, -1px)
      rotate(1deg);
  }
  90% {
    transform: translateX(-50%) translateY(-50%) translate(2px, 2px)
      rotate(0deg);
  }
  100% {
    transform: translateX(-50%) translateY(-50%) translate(1px, -2px)
      rotate(-1deg);
  }
}
</style>