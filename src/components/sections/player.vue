<template>
  <div>
    <div id="feedback" ref="feedback" :class="{ hurt: hurt }"></div>

    <div id="player-container">
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
        :duration="0.5"
        :endXPosition="'0px'"
        :endYPosition="'-20px'"
        :textTransformer="ephemeralText.textTransformer"
        :colorTransformer="ephemeralText.colorTransformer"
      />

      <div id="player-info">
        <div>{{ player.name }}</div>
      </div>
    </div>

    <Inventory
      id="player-inventory"
      ref="player-inventory"
      :armor="player.armor"
      :weapon="player.weapon"
      :newItem="newItem"
      @acceptNewItem="acceptNewItem"
      @declineNewItem="declineNewItem"
    />
  </div>
</template>

<script>
import DynamicRing from "../template/dynamic-ring.vue";
import EphemeralText from "../template/ephemeral-text.vue";
import Inventory from "./inventory.vue";
export default {
  name: "PlayerSection",
  components: {
    DynamicRing,
    EphemeralText,
    Inventory,
  },
  emits: ["gameOver", "acceptNewItem"],
  props: {
    player: {
      name: String,
      level: Number,
      maxHp: Number,
      weapon: undefined,
      armor: undefined,
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
    newItem: undefined,
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
    acceptNewItem(item) {
      this.$emit("acceptNewItem", item);
      this.resetNewItem();
    },
    declineNewItem() {
      this.resetNewItem();
    },
    acceptNewItemTrigger() {
      this.$refs["player-inventory"].acceptNew();
    },
    rejectNewItemTrigger() {
      this.$refs["player-inventory"].declineNew();
    },
    resetNewItem() {
      this.$refs["player-inventory"].unsetNewItem();
    },
    setNewItem(item) {
      this.$refs["player-inventory"].setNewItem(item);
    },
    setHp(hp) {
      const difference = hp - this.hp;
      const newHp = Math.max(0, Math.min(hp, this.player.maxHp));
      if (newHp < this.hp) this.showHurt();
      this.hp = newHp;
      this.$refs["player-hp"].setToPercent(this.hp / this.player.maxHp, 0.5);
      this.$refs["hp-alert"].addText(difference);
      if (this.hp <= 0) {
        this.$emit("gameOver");
      }
    },
    receiveDamage(damage) {
      this.setHp(this.hp - damage);
      this.showHurt();
    },
    showHurt() {
      this.hurt = false;
      requestAnimationFrame(() => {
        this.hurt = true;
      });
    },
    heal(value) {
      this.setHp(this.hp + value);
    },
  },
};
</script>

<style scoped>
#player-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 70px;
  bottom: 70px;
  transform-origin: 50% 50%;
}

#feedback {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
}

#feedback.hurt {
  opacity: 1;
  background-color: rgba(255, 99, 71, 0.5);
  animation: hurt-animation 0.5s ease forwards 1;
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
}

#player-hp {
  position: absolute;
}

#player-inventory {
  position: absolute;
  width: 100%;
  height: 100%;
}

#hp-alert {
  position: absolute;
  bottom: 30px;
  left: 60px;
}
</style>