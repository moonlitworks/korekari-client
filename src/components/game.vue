<template>
  <div id="game-screen">
    <Player v-if="playerObject" ref="player" :player="playerObject" />
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
    <Combo ref="combo" />
    <Interaction @interaction="interaction" />
    <Spectate
      :isSpectateMode="isSpectateMode"
      @toggleSpectateMode="toggleSpectateMode"
    />
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
import Spectate from "./game-components/spectate.vue";
import Interaction from "./game-components/interaction.vue";
import Server from "./game-components/server.vue";

export default {
  name: "KoreKari",
  components: {
    Ring,
    Player,
    Monster,
    Combo,
    Spectate,
    Interaction,
    Server,
  },
  data: () => ({
    isSpectateMode: true,
    monsterObject: undefined,
    playerObject: {
      name: "Hunter",
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
    server() {
      return this.$refs["server"];
    },
  },
  mounted() {
    this.server.spawnMonster(0);
    setInterval(() => {
      this.server.addTargetIfEmpty();
    }, 1000);
  },
  methods: {
    interaction() {
      const hitInfo = this.ring.hit();
      if (this.isSpectateMode) return;
      if (hitInfo.hits.length <= 0) {
        // dont damage player if no target is in ring
        if (this.monsterIsAlive) {
          this.player?.receiveDamage(3);
          this.combo.resetCombo();
        }
      } else {
        hitInfo.hits.forEach((hit) => {
          if (hit.type === "HEAL") {
            console.log("Heal!");
            const healValue = hit.hitType === "BONUS" ? 50 : 10;
            this.player?.heal(healValue);
          } else if (hit.type === "SKILL") {
            if (!this.monsterIsAlive) return;
            if (hit.hitType === "BONUS") {
              console.log("Bonus Skill!");
              this.monster?.receiveDamage(50, true);
            } else {
              console.log("Skill!");
              this.monster?.receiveDamage(10, true);
            }
          } else if (hit.type === "ATTACK") {
            if (!this.monsterIsAlive) return;
            if (hit.hitType === "BONUS") {
              console.log("Bonus Hit!");
              this.monster?.receiveDamage(10, true);
            } else {
              console.log("Hit!");
              this.monster?.receiveDamage(1);
            }
          } else if (hit.type === "DEFEND" && hit.hitType === "BONUS") {
            console.log("Counter!");
            this.monster?.receiveDamage(5);
          }

          this.combo?.addCombo();
          this.ring.hitTarget(hit.id);
        });
      }
    },
    toggleSpectateMode() {
      this.isSpectateMode = !this.isSpectateMode;
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
          this.player?.receiveDamage(20);
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
      setTimeout(() => {
        this.monsterObject = undefined;
        this.server.spawnMonster(2000);
      }, 1000);
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