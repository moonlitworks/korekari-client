<template>
  <div id="feedback" :class="{ hurt: hurt }"></div>

  <!-- <div id="player-hp-bar">
    <div id="player-hp"></div>
  </div> -->

  <DynamicRing
    id="player-hp"
    ref="player-hp"
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

  <div id="player-info">
    <div>{{ player.name }}</div>
  </div>
</template>

<script>
import DynamicRing from "../template/dynamic-ring.vue";
import EphemeralText from "../template/ephemeral-text.vue";
export default {
  name: "Player",
  components: {
    DynamicRing,
    EphemeralText,
  },
  emits: ["gameOver"],
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
    exp: 0,
    hurt: false,
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
    this.hp = this.player.maxHp;
  },
  computed: {
    hpPercentage() {
      const pct = (this.hp / this.player.maxHp) * 100;
      return `${pct}%`;
    },
  },
  methods: {
    setHp(hp) {
      const difference = hp - this.hp;
      const newHp = Math.max(0, Math.min(hp, this.player.maxHp));
      this.hp = newHp;
      this.$refs["player-hp"].setToPercent(this.hp / this.player.maxHp, 0.5);
      this.$refs["hp-alert"].addText(difference);
      if (this.hp <= 0) {
        this.$emit("gameOver");
      }
    },
    receiveDamage(damage) {
      this.setHp(this.hp - damage);
      setTimeout(() => {
        this.hurt = false;
      }, 500);
      this.hurt = true;
    },
    heal(value) {
      this.setHp(this.hp + value);
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

#player-info {
  position: absolute;
  bottom: 12px;
  left: 10px;
  position: absolute;
  bottom: 7%;
  left: 7%;
  transform: translateX(-50%) translateY(50%);
  transform-origin: 50% 50%;
}

#player-hp {
  position: absolute;
  bottom: 7%;
  left: 7%;
  transform: translateX(-50%) translateY(50%);
  transform-origin: 50% 50%;
}

#hp-alert {
  position: absolute;
  bottom: 10%;
  left: 12%;
  transform: translateX(-50%) translateY(-50%);
  transform-origin: 50% 50%;
}
</style>