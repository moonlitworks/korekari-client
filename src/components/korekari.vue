<template>
  <div id="game-screen" @mousedown="interact">
    <Player ref="player" :maxHp="100" />
    <Monster ref="monster" :maxHp="100" />

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#game-screen {
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
