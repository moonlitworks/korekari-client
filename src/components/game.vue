<template>
  <div id="game-screen">
    <Player />
    <Monster />
    <Ring
      ref="ring"
      :thickness="10"
      :speed="'3s'"
      :ringColor="'black'"
      :ringOpacity="0.1"
      :pointerColor="'red'"
      :showCenter="showCenter"
    />
    <Combo ref="combo" @lastCombo="registerCombo" />
    <Interaction ref="interaction" />
    <Spectate
      :isSpectateMode="isSpectateMode"
      @toggleSpectateMode="toggleSpectateMode"
    />
    <GameOver v-if="gameOver" @restart="startGame" />
    <Server />
  </div>
</template>

<script>
import emitter from "@/services/emitter";

import Server from "./server.vue";

import Ring from "./sections/ring/ring-base.vue";
import Monster from "./sections/monster/monster-base.vue";
import Player from "./sections/player/player-base.vue";
import Combo from "./sections/player/combo.vue";
import Interaction from "./sections/player/interaction.vue";
import Spectate from "./sections/spectate.vue";
import GameOver from "./sections/game-over.vue";

export default {
  name: "KoreKari",
  components: {
    Monster,
    Player,

    Ring,
    Combo,
    Spectate,
    GameOver,
    Interaction,
    Server,
  },
  data: () => ({
    showCenter: false,
    highestCombo: 0,
    gameOver: false,
    isSpectateMode: false,
    acceptingTargets: true,
    monsterObject: undefined,
    playerObject: undefined,
  }),
  computed: {
    monsterIsAlive() {
      if (!this.monsterObject) return false;
      return !!this.monster && this.monster.isAlive;
    },
    ring() {
      return this.$refs["ring"];
    },
    combo() {
      if (!this.monsterObject) return undefined;
      return this.$refs["combo"];
    },
    interactionEl() {
      return this.$refs["interaction"];
    },
  },
  mounted() {
    emitter.on("interaction", this.interaction);
    emitter.on("target:add", this.addTarget);
    emitter.on("player:set", (player) => {
      this.playerObject = player;
    });
    emitter.on("game:init", this.initGame);
    setTimeout(() => {
      emitter.emit("player:register", {
        name: "Test",
      });
    }, 3000);
  },
  methods: {
    restartAnimation(cb) {
      requestAnimationFrame(() => cb());
    },
    setGameOver() {
      this.combo?.resetCombo();
      this.isSpectateMode = true;
      this.gameOver = true;
      this.acceptingTargets = false;
      this.ring.targetList.forEach((x) => this.ring.fadeTarget(x.id, true));
    },
    registerCombo(value) {
      if (value > this.highestCombo) this.highestCombo = value;
    },
    interaction() {
      const hitInfo = this.ring.hit();
      if (this.isSpectateMode || this.gameOver) return;
      if (hitInfo.hits.length <= 0) {
        // dont damage player if no target is in ring
        if (this.monsterIsAlive) {
          emitter.emit("server:send", { type: "player:miss" });
          this.combo?.resetCombo();
        }
      } else {
        hitInfo.hits.forEach((hit) => {
          emitter.emit("server:send", { type: "target:hit", hit });
          this.combo?.addCombo();
          this.ring.hitTarget(hit.id);
        });
      }
    },
    toggleSpectateMode(value) {
      this.isSpectateMode = value === undefined ? !this.isSpectateMode : value;
      if (this.isSpectateMode) {
        this.ring.targetList.forEach((x) => this.ring.fadeTarget(x.id, true));
      }
      this.interactionEl.focus();
    },
    addTarget(data) {
      if (data.type === "DEFEND")
        emitter.emit("monster:state:set", "ATTACKING");
      if (!this.monsterObject || this.isSpectateMode || !this.acceptingTargets)
        return;
      const lifetime = data.expiry - new Date();
      const angle = Math.floor(Math.random() * 361);
      const color = ((type) => {
        switch (type) {
          case "DEFEND":
            return "blue";
          case "HEAL":
            return "green";
          case "SKILL":
            return "orange";
          case "ITEM":
            return "purple";
          case "ATTACK":
          default:
            return "red";
        }
      })(data.type);
      this.ring.addTarget(
        data,
        data.id,
        data.type,
        angle,
        color,
        data.size,
        data.bonus,
        lifetime,
        1
      );
    },
    missedTarget(target) {
      if (this.isSpectateMode) return;
      if ([undefined, "DEAD", "DYING"].includes(this.monster?.state)) return;
      emitter.emit("server:send", { type: "target:miss", target });
    },
    initGame({ player, monster }) {
      this.playerObject = undefined;
      this.monsterObject = undefined;
      this.restartAnimation(() => {
        this.playerObject = player;
        this.monsterObject = monster;
        this.interactionEl.focus();
        this.gameOver = false;
        this.isSpectateMode = false;
        setTimeout(() => {
          this.acceptingTargets = true;
        }, 2000);
      });
    },
    setMonster(monsterObject) {
      this.monsterObject = monsterObject;
    },
    monsterDying() {
      this.ring.targetList.forEach((x) => {
        switch (x.type) {
          case "ATTACK":
          case "DEFEND":
          case "SKILL":
            this.ring.fadeTarget(x.id, true);
            break;
        }
      });
    },
    monsterDead() {
      this.highestCombo = 0;
      this.monsterObject = undefined;
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>