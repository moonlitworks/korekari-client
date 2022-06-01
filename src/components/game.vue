<template>
  <div id="game-screen">
    <Player v-if="playerObject" ref="player" :player="playerObject" />
    <Monster
      v-if="monsterObject"
      ref="monster"
      :monster="monsterObject"
      @dead="monsterDead"
    />
    <Ring
      ref="ring"
      :thickness="10"
      :speed="'2s'"
      :ringColor="'black'"
      :ringOpacity="0.1"
      :pointerColor="'red'"
    />
    <Combo ref="combo" />
    <Interaction @interaction="interaction" />
    <Server
      ref="server"
      :gm="this"
      @setPlayer="setPlayer"
      @setMonster="setMonster"
      @addTarget="addTarget"
    />
  </div>
</template>

<script>
import Ring from "./game-components/ring.vue";
import Player from "./game-components/player.vue";
import Monster from "./game-components/monster.vue";
import Combo from "./game-components/combo.vue";
import Interaction from "./game-components/interaction.vue";
import Server from "./game-components/server.vue";

export default {
  name: "KoreKari",
  components: {
    Ring,
    Player,
    Monster,
    Combo,
    Interaction,
    Server,
  },
  data: () => ({
    playerObject: undefined,
    monsterObject: undefined,
  }),
  computed: {
    player() {
      if (!this.playerObject) return undefined;
      return this.$refs["player"];
    },
    monster() {
      if (!this.monsterObject) return undefined;
      return this.$refs["monster"];
    },
    ring() {
      return this.$refs["ring"];
    },
    combo() {
      if (!this.monsterObject) return undefined;
      return this.$refs["combo"];
    },
    server() {
      return this.$refs["server"];
    },
  },
  mounted() {
    this.server.spawnPlayer();
    this.server.spawnMonster(0);
  },
  methods: {
    interaction() {
      const hitInfo = this.ring.hit();
      if (!this.monster?.isActive) return;
      if (hitInfo.hits.length <= 0) {
        // dont damage player if no target is in ring
        if (this.ring.activeTargets.length > 0) {
          this.player?.receiveDamage(3);
          this.combo.resetCombo();
        }
      } else {
        hitInfo.hits.forEach((hit) => {
          if (hit.type === "HEAL") {
            const healValue = hit.hitType === "BONUS" ? 50 : 10;
            this.player?.heal(healValue);
          } else if (hit.type === "SKILL") {
            if (hit.hitType === "BONUS") {
              this.monster?.receiveDamage(50, true);
            } else {
              this.monster?.receiveDamage(10, true);
            }
          } else if (hit.type === "ATTACK") {
            if (hit.hitType === "BONUS") {
              this.monster?.receiveDamage(10, true);
            } else {
              this.monster?.receiveDamage(1);
            }
          }

          this.combo?.addCombo();
          this.ring.hitTarget(hit.id);
        });
      }
    },
    addTarget({ angle, hits, type, color }) {
      this.ring.addTarget(type, angle, color, 10, 2, 2000, hits);
    },
    setPlayer(playerObject) {
      this.playerObject = playerObject;
    },
    setMonster(monsterObject) {
      this.monsterObject = monsterObject;
    },
    monsterDead() {
      this.monsterObject = undefined;
      this.ring.targetList.forEach((x) => this.ring.fadeTarget(x.id, true));
      this.server.spawnMonster(3000);
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