<template>
  <div id="game-screen">
    <Player
      v-if="playerObject"
      ref="player"
      :player="playerObject"
      @gameOver="setGameOver"
    />
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
    <GameOver v-if="gameOver" @restart="restartGame" />
    <Server
      ref="server"
      :gm="this"
      @setMonster="setMonster"
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
    setInterval(() => {
      this.server.addTargetIfEmpty();
    }, 1000);
    this.restartGame();
  },
  methods: {
    restartGame() {
      this.monsterObject = undefined;
      this.playerObject = undefined;

      requestAnimationFrame(() => {
        this.gameOver = false;
        this.isSpectateMode = true;
        this.playerObject = {
          name: "Hunter",
          exp: 0,
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
        };
        this.server.spawnMonster(1, 0);
        this.interactionEl.focus();
      });
    },
    setGameOver() {
      this.toggleSpectateMode(true);
      this.gameOver = true;
    },
    registerCombo(value) {
      if (value > this.highestCombo) this.highestCombo = value;
    },
    calcHit() {
      const playerLevel = this.playerObject.level;
      const monsterLevel = this.monsterObject.level;
      if (!playerLevel || !monsterLevel) return 0;

      const hitRaw = Math.floor(playerLevel / monsterLevel);
      return hitRaw > 1 ? hitRaw : 1;
    },
    calcBonusHit() {
      const playerLevel = this.playerObject.level;
      const monsterLevel = this.monsterObject.level;
      if (!playerLevel || !monsterLevel) return 0;

      const hitRaw = Math.floor(10 * (playerLevel / monsterLevel));
      return hitRaw > 1 ? hitRaw : 1;
    },
    calcSkill() {
      const playerLevel = this.playerObject.level;
      const monsterLevel = this.monsterObject.level;
      if (!playerLevel || !monsterLevel) return 0;

      const hitRaw = Math.floor(10 * (playerLevel / monsterLevel));
      return hitRaw > 1 ? hitRaw : 1;
    },
    calcBonusSkill() {
      const playerLevel = this.playerObject.level;
      const monsterLevel = this.monsterObject.level;
      if (!playerLevel || !monsterLevel) return 0;

      const hitRaw = Math.floor(50 * (playerLevel / monsterLevel));
      return hitRaw > 1 ? hitRaw : 1;
    },
    calcMiss() {
      const playerLevel = this.playerObject.level;
      const monsterLevel = this.monsterObject.level;
      if (!playerLevel || !monsterLevel) return 0;

      const hitRaw = Math.floor(20 * (monsterLevel / playerLevel));
      return hitRaw > 1 ? hitRaw : 1;
    },
    calcCounter() {
      const playerLevel = this.playerObject.level;
      const monsterLevel = this.monsterObject.level;
      if (!playerLevel || !monsterLevel) return 0;

      const hitRaw = Math.floor(5 * (playerLevel / monsterLevel));
      return hitRaw > 1 ? hitRaw : 1;
    },
    calcHeal() {
      const playerLevel = this.playerObject.level;
      const monsterLevel = this.monsterObject.level;
      if (!playerLevel || !monsterLevel) return 0;

      const healRaw = Math.floor(10 * (monsterLevel / playerLevel));
      return healRaw > 10 ? healRaw : 10;
    },
    calcBonusHeal() {
      const playerLevel = this.playerObject.level;
      const monsterLevel = this.monsterObject.level;
      if (!playerLevel || !monsterLevel) return 0;

      const healRaw = Math.floor(50 * (monsterLevel / playerLevel));
      return healRaw > 10 ? healRaw : 10;
    },
    interaction() {
      const hitInfo = this.ring.hit();
      if (this.isSpectateMode) return;
      if (hitInfo.hits.length <= 0) {
        // dont damage player if no target is in ring
        if (this.monsterIsAlive) {
          this.player?.receiveDamage(3);
          this.combo?.resetCombo();
        }
      } else {
        hitInfo.hits.forEach((hit) => {
          if (hit.type === "HEAL") {
            console.log("Heal!");
            const healValue =
              hit.hitType === "BONUS" ? this.calcBonusHeal() : this.calcHeal();
            this.player?.heal(healValue);
          } else if (hit.type === "SKILL") {
            if (!this.monsterIsAlive) return;
            if (hit.hitType === "BONUS") {
              console.log("Bonus Skill!");
              this.monster?.receiveDamage(this.calcBonusSkill(), true);
            } else {
              console.log("Skill!");
              this.monster?.receiveDamage(this.calcSkill(), true);
            }
          } else if (hit.type === "ATTACK") {
            if (!this.monsterIsAlive) return;
            if (hit.hitType === "BONUS") {
              console.log("Bonus Hit!");
              this.monster?.receiveDamage(this.calcBonusHit(), true);
            } else {
              console.log("Hit!");
              this.monster?.receiveDamage(this.calcHit());
            }
          } else if (hit.type === "DEFEND" && hit.hitType === "BONUS") {
            console.log("Counter!");
            this.monster?.receiveDamage(this.calcCounter(), true, true);
          }

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
    },
    addTarget({ angle, hits, type, color }) {
      if (type === "DEFEND") this.monster.setState("ATTACKING");
      if (this.isSpectateMode) return;
      this.ring.addTarget(type, angle, color, 10, 2, 3000, hits);
    },
    missedTarget(target) {
      if (this.isSpectateMode) return;
      if ([undefined, "DEAD", "DYING"].includes(this.monster.state)) return;
      switch (target.type) {
        case "DEFEND":
          this.player?.receiveDamage(this.calcMiss());
          break;
      }
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
        this.server.spawnMonster(nextLevel, 2000);
      }, 1000);
    },
    rewardPlayer(exp, heal) {
      console.log(`Gaining ${exp} exp and ${heal} heal!`);
      this.player.heal(heal);

      if (this.playerObject) {
        const levels = Math.floor((this.playerObject.exp + exp) / 100);
        const excess = Math.floor((this.playerObject.exp + exp) % 100);
        this.playerObject.exp = excess;
        this.playerObject.level += levels;
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>