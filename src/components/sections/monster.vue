<template>
  <div>
    <component
      :is="sprite"
      :class="{ critical: critical }"
      :state="state"
      @setState="setState"
      @dead="dead"
    ></component>

    <DynamicRing
      id="monster-hp"
      ref="monster-hp"
      :side="100"
      :color="'white'"
      :opacity="0"
      :width="5"
      :arc="{
        color: 'red',
        opacity: 1,
        startPercent: 1,
        startSpeed: 0,
      }"
    />

    <EphemeralText
      id="hp-alert"
      ref="hp-alert"
      :duration="1"
      :endXPosition="'0px'"
      :endYPosition="'-12px'"
      :textTransformer="ephemeralText.textTransformer"
      :colorTransformer="ephemeralText.colorTransformer"
    />

    <div id="monster-info">
      <div id="monster-name">{{ monster.name }}</div>
      <div id="monster-lvl">{{ monster.level }}</div>
    </div>
  </div>
</template>

<script>
import { shallowRef } from "vue";
import DynamicRing from "../template/dynamic-ring.vue";
import EphemeralText from "../template/ephemeral-text.vue";
import Worm from "../sprites/worm.vue";
export default {
  name: "Monster",
  components: {
    DynamicRing,
    EphemeralText,
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
    isActive: false,
    state: "IDLE",
    hp: 0,
    critical: false,
    sprite: undefined,
    ephemeralText: {
      textTransformer: (hp) => {
        if (hp >= 0) return `+${hp}`;
        return hp.toString();
      },
      colorTransformer: (hp) => {
        if (hp >= 0) return "green";
        return "red";
      },
    },
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
    hpPercentageText() {
      return `${(this.hp / this.monster.maxHp) * 100}%`;
    },
  },
  methods: {
    receiveDamage(damage, critical, counter) {
      setTimeout(() => {
        this.critical = false;
      }, 100);
      if (critical) this.critical = true;

      this.setHp(this.hp - damage);
      if (this.hp <= 0) {
        this.hp = 0;
        this.setState("DYING");
        this.$emit("dying");
      } else {
        if (counter) {
          this.setState("COUNTERED");
        } else {
          this.setState("FLINCHING");
        }
      }
    },
    setHp(hp) {
      const difference = hp - this.hp;
      const newHp = Math.max(0, Math.min(hp, this.monster.maxHp));
      this.hp = newHp;
      this.$refs["monster-hp"].setToPercent(this.hp / this.monster.maxHp, 0.5);
      this.$refs["hp-alert"].addText(difference);
    },
    dead() {
      this.isActive = false;
      this.$emit("dead");
    },
    setState(state) {
      // don't flinch when attacking, unless state is "COUNTERED"
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

#monster-info {
  position: absolute;
  top: 7%;
  left: 7%;
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
}

#monster-lvl {
  font-size: 30px;
  font-weight: 777;
}

#monster-hp {
  position: absolute;
  top: 7%;
  left: 7%;
  transform: translateX(-50%) translateY(-50%);
  transform-origin: 50% 50%;
}

#hp-alert {
  position: absolute;
  top: 3%;
  left: 12%;
  transform: translateX(-50%) translateY(-50%);
  transform-origin: 50% 50%;
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