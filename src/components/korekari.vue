<template>
  <div id="game-screen" @mousedown="interact">
    <Player v-if="player" ref="player" :player="player" />
    <Monster v-if="monster" ref="monster" :monster="monster" />

    <ActionContainer
      ref="action-container"
      @playerHit="playerHit"
      @monsterHit="monsterHit"
      :thickness="10"
    />
  </div>
</template>

<script>
import Player from "./player.vue";
import Monster from "./monster.vue";
import ActionContainer from "./actions/container.vue";

export default {
  name: "KoreKari",
  components: {
    Player,
    Monster,
    ActionContainer,
  },
  data: () => ({
    player: {
      name: "Player1",
      level: 1,
      maxHp: 100,
      items: [
        {
          name: "Stick",
          element: "Neutral",
          damage: 1,
        },
      ],
    },
    monster: {
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
          name: "Slime",
          element: "NEUTRAL",
          damage: 10,
          dodgeWidth: 40,
        },
      ],
    },
  }),
  mounted() {
    this.$refs["action-container"].setMonsterAttackTargets(this.monster);
  },
  methods: {
    interact() {
      this.$refs["action-container"].interact();
    },
    playerHit(damage) {
      this.$refs["player"].receiveDamage(damage);
    },
    monsterHit(damage, critical) {
      this.$refs["monster"].receiveDamage(damage, critical);
    },
  },
};
</script>

<style scoped>
#game-screen {
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
