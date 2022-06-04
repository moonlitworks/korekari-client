<template>
  <div id="game-screen">
    <transition>
      <Player
        v-if="!!playerObject"
        ref="player"
        :player="playerObject"
        @gameOver="setGameOver"
      />
    </transition>
    <transition>
      <Monster
        v-if="!!monsterObject"
        ref="monster"
        :monster="monsterObject"
        @dying="monsterDying"
        @dead="monsterDead"
      />
    </transition>
    <Ring
      ref="ring"
      :thickness="10"
      :speed="'3s'"
      :ringColor="'black'"
      :ringOpacity="0.1"
      :pointerColor="'red'"
      @missedTarget="missedTarget"
    />
    <Combo ref="combo" @lastCombo="registerCombo" />
    <Interaction ref="interaction" @interaction="interaction" />
    <Spectate
      :isSpectateMode="isSpectateMode"
      @toggleSpectateMode="toggleSpectateMode"
    />
    <GameOver v-if="gameOver" @restart="startGame" />
    <Server
      ref="server"
      :gm="this"
      @initGame="initGame"
      @setMonster="setMonster"
      @playerDamage="playerDamage"
      @playerDealt="playerDealt"
      @playerHp="playerHp"
      @addTarget="addTarget"
    />
  </div>
</template>

<script>
import Ring from "./sections/ring.vue";
import Player from "./sections/player.vue";
import Monster from "./sections/monster.vue";
import Combo from "./sections/combo.vue";
import Spectate from "./sections/spectate.vue";
import GameOver from "./sections/game-over.vue";
import Interaction from "./sections/interaction.vue";
import Server from "./sections/server.vue";

export default {
  name: "KoreKari",
  components: {
    Ring,
    Player,
    Monster,
    Combo,
    Spectate,
    GameOver,
    Interaction,
    Server,
  },
  data: () => ({
    highestCombo: 0,
    gameOver: false,
    isSpectateMode: false,
    monsterObject: undefined,
    playerObject: undefined,
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
    server() {
      return this.$refs["server"];
    },
  },
  mounted() {
    this.startGame();
  },
  methods: {
    startGame() {
      this.server.send({
        type: "player:register",
        name: "Hunter",
      });
    },
    restartAnimation(cb) {
      requestAnimationFrame(() => cb());
    },
    setGameOver() {
      this.gameOver = true;
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
          this.server.send({ type: "player:miss" });
          this.combo?.resetCombo();
        }
      } else {
        hitInfo.hits.forEach((hit) => {
          this.server.send({ type: "target:hit", hit });
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
      if (data.type === "DEFEND") this.monster.setState("ATTACKING");
      if (this.isSpectateMode) return;
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
          case "ATTACK":
          default:
            return "red";
        }
      })(data.type);
      this.ring.addTarget(
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
      if ([undefined, "DEAD", "DYING"].includes(this.monster.state)) return;
      this.server.send({
        type: "target:miss",
        target,
      });
    },
    initGame({ player, monster }) {
      this.playerObject = undefined;
      this.monsterObject = undefined;
      this.restartAnimation(() => {
        this.playerObject = player;
        this.monsterObject = monster;
        this.gameOver = false;
      });
    },
    setMonster(monsterObject) {
      this.monsterObject = monsterObject;
    },
    playerDamage(damage) {
      this.player?.receiveDamage(damage);
    },
    playerDealt({ value, isCritical, isCounter }) {
      this.monster?.receiveDamage(value, isCritical, isCounter);
    },
    playerHp(newHp) {
      this.player?.setHp(newHp);
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
      const nextLevelRaw =
        2 * Math.floor(this.playerObject.level / this.monsterObject.level);
      const nextLevelUp = nextLevelRaw > 1 ? nextLevelRaw : 1;
      const nextLevel = this.monsterObject.level + nextLevelUp;

      const exp =
        3 *
        this.highestCombo *
        (this.monsterObject.level / this.playerObject.level);
      this.rewardPlayer(exp, 50);
      this.highestCombo = 0;

      setTimeout(() => {
        this.monsterObject = undefined;
        this.server.send({
          type: "monster:fetch",
          level: nextLevel,
          delay: 2000,
        });
      }, 1000);
    },
    rewardPlayer(exp, heal) {
      this.player.heal(heal);
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