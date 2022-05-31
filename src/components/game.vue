<template>
  <div id="game-screen">
    <Player ref="player" :player="playerObject" />
    <Monster ref="monster" :monster="monsterObject" />
    <Ring
      ref="ring"
      :thickness="20"
      :speed="'3s'"
      :ringColor="'black'"
      :ringOpacity="0.1"
      :pointerColor="'red'"
    />
    <Interaction @interaction="interaction" />
    <Server />
  </div>
</template>

<script>
import Ring from "./game-components/ring.vue";
import Player from "./game-components/player.vue";
import Monster from "./game-components/monster.vue";
import Interaction from "./game-components/interaction.vue";
import Server from "./game-components/server.vue";

export default {
  name: "KoreKari",
  components: {
    Ring,
    Player,
    Monster,
    Interaction,
    Server,
  },
  data: () => ({
    playerObject: {
      name: "Player1",
      level: 1,
      maxHp: 100,
      items: [
        {
          id: "STICK",
          type: "WEAPON",
          name: "Stick",
          element: "Neutral",
          damage: 1,
        },
      ],
    },
    monsterObject: {
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
          id: "SLIME",
          name: "Slime",
          element: "NEUTRAL",
          damage: 10,
          dodgeWidth: 40,
        },
      ],
    },
  }),
  computed: {
    player() {
      return this.$refs["player"];
    },
    monster() {
      return this.$refs["monster"];
    },
    ring() {
      return this.$refs["ring"];
    },
  },
  mounted() {
    this.ring.addTarget(0, "red", 30, 20);
    this.ring.addTarget(120, "red", 30, 20);
    this.ring.addTarget(240, "red", 30, 20);
  },
  methods: {
    interaction() {
      const hitInfo = this.ring.hit();
      if (hitInfo.hits.length <= 0) {
        this.player.receiveDamage(10);
      } else {
        hitInfo.hits.forEach((hit) => {
          if (hit.hitType === "BONUS") {
            this.monster.receiveDamage(10, true);
          } else {
            this.monster.receiveDamage(1);
          }
        });
      }
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