<template>
  <Sprite
    id="sprite"
    :class="{ flinch: flinch, critical: critical }"
    :image="require('@/assets/sprites/worm/idle.png')"
    :width="900"
    :height="900"
    :cuts="9"
    :duration="'1.0s'"
    :loop="'infinite'"
  />

  <!-- <Sprite
    id="sprite"
    :image="require('@/assets/sprites/worm/attack.png')"
    :width="900"
    :height="900"
    :cuts="15"
    :duration="'1.0s'"
    :loop="'1'"
    :fillMode="'forwards'"
    :direction="'normal'"
  /> -->

  <!-- <Sprite
    id="sprite"
    :image="require('@/assets/sprites/worm/death.png')"
    :width="900"
    :height="900"
    :cuts="7"
    :duration="'1.0s'"
    :loop="'1'"
    :fillMode="'forwards'"
    :direction="'normal'"
  /> -->

  <div id="monster-hp-bar">
    <div id="monster-hp"></div>
  </div>

  <div id="monster-info">
    <div>{{ monster.name }} (Lv {{ monster.level }})</div>
  </div>
</template>

<script>
import Sprite from "./sprite.vue";
export default {
  name: "Monster",
  components: {
    Sprite,
  },
  emits: ["dying", "dead"],
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
          id: String,
          name: String,
          element: String,
          damage: Number,
          dodgeWidth: Number,
        },
      ],
    },
  },
  data: () => ({
    status: "ACTIVE", // "ENTERING", "LEAVING", "DYING"
    hp: 0,
    flinch: false,
    critical: false,
  }),
  mounted() {
    this.hp = this.monster.maxHp;
    this.status = "ACTIVE";
    this.flinch = false;
    this.critical = false;
  },
  computed: {
    isActive() {
      return this.status === "ACTIVE";
    },
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
        this.status === "DYING";
        this.$emit("dead");
      }
    },
  },
};
</script>

<style scoped>
#sprite {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

#sprite.flinch {
  filter: grayscale(100%);
}

#sprite.critical {
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