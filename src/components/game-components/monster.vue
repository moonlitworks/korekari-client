<template>
  <div>
    <component
      :is="sprite"
      :class="{ critical: critical }"
      :state="state"
      @setState="setState"
      @dead="dead"
    ></component>

    <div id="monster-hp-bar">
      <div id="monster-hp"></div>
    </div>

    <div id="monster-info">
      <div>{{ monster.name }} (Lv {{ monster.level }})</div>
    </div>
  </div>
</template>

<script>
import { shallowRef } from "vue";
import Worm from "../sprites/worm.vue";
export default {
  name: "Monster",
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
    isActive: false,
    state: "IDLE",
    hp: 0,
    critical: false,
    sprite: undefined,
  }),
  mounted() {
    this.hp = this.monster.maxHp;
    this.state = "IDLE";
    this.critical = false;
    this.sprite = shallowRef(Worm);

    setTimeout(() => {
      this.isActive = true;
    }, 2000);
  },
  computed: {
    isAlive() {
      return (
        !["ENTERING", "DEAD", "DYING", undefined].includes(this.state) &&
        this.isActive
      );
    },
    hpPercentage() {
      const pct = (this.hp / this.monster.maxHp) * 100;
      return `${pct}%`;
    },
  },
  methods: {
    receiveDamage(damage, critical) {
      setTimeout(() => {
        this.critical = false;
      }, 100);
      if (critical) this.critical = true;

      this.hp -= damage;
      if (this.hp <= 0) {
        this.hp = 0;
        this.setState("DYING");
        this.$emit("dying");
      } else {
        this.setState("FLINCHING");
      }
    },
    dead() {
      this.isActive = false;
      this.$emit("dead");
    },
    setState(state) {
      // don't flinch when attacking
      if (state === "FLINCHING" && this.state === "ATTACKING") return;

      if (this.state !== state) this.state = state;
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