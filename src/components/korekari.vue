<template>
  <div id="game-screen" @mousedown="interact">
    <Monster ref="monster" :maxHp="100" />

    <ActionContainer
      ref="action-container"
      @monsterHit="monsterHit"
      :thickness="10"
    />
  </div>
</template>

<script>
import Monster from "./monster.vue";
import ActionContainer from "./actions/container.vue";

export default {
  name: "KoreKari",
  components: {
    Monster,
    ActionContainer,
  },
  methods: {
    interact() {
      this.$refs["action-container"].interact();
    },
    monsterHit(damage) {
      this.$refs["monster"].receiveDamage(damage);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#game-screen {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: gray;
  overflow: hidden;
}
</style>
