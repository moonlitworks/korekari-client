<template>
  <span id="connection-status">{{ connectionStatus }}</span>
</template>

<script>
import { uuid } from "vue-uuid";
export default {
  name: "Server",
  props: {
    gm: undefined,
  },
  data: () => ({
    connectionStatus: "MOCKED",
    isClientReady: false,
    currentPlayers: [],
    currentPlayer: undefined,
    currentMonster: {
      id: uuid.v4(),
      name: "Dragorm",
      level: 1,
      hp: 100,
      maxHp: 100,
      element: "FIRE",
      hitConfig: {
        normalWidth: 50,
        criticalWidth: 35,
        normalDamage: 1,
        criticalDamage: 10,
        normalAttack: 1,
      },
      skills: [
        {
          id: "FIRE_BREATH",
          name: "Fire Breath",
          element: "FIRE",
          damage: 10,
          dodgeWidth: 40,
        },
      ],
    },
  }),
  computed: {
    isMocked() {
      return this.connectionStatus === "MOCKED";
    },
  },
  mounted() {
    setInterval(() => {
      if (!this.isClientReady || this.currentMonster.hp <= 0) return;
      this.generateMonsterEvent();
    }, 1000);
  },
  methods: {
    send(data) {
      if (this.isMocked) return this.mockSend(data);
    },
    receive(event, data) {
      if (this.isMocked) return this.mockReceive(event, data);
    },

    // These are for local testing only until a real server is up
    mockSend(data) {
      if (data.type === "player:register") {
        const newPlayer = this.generateNewPlayer(data);
        this.currentPlayers.push(newPlayer);
        this.currentPlayer = newPlayer;
        this.isClientReady = true;
        this.receive("game:init", {
          player: newPlayer,
          monster: this.currentMonster,
        });
        return;
      }

      if (data.type === "player:miss") {
        this.currentPlayer.hp -= 3;
        this.receive("player:damage", {
          value: 3,
        });
      }

      if (data.type === "target:hit") {
        const hit = data.hit;
        if (hit.type === "ATTACK") {
          const damage = hit.hitType === "BONUS" ? 10 : 1;
          this.currentMonster.hp -= damage;
          this.receive("player:dealt", {
            value: damage,
            isCritical: hit.hitType === "BONUS",
            isCounter: false,
          });
          this.receive("monster:update", {
            status: "ALIVE",
            id: this.currentMonster.id,
            hp: this.currentMonster.hp,
          });
        }

        if (hit.type === "SKILL") {
          const damage = hit.hitType === "BONUS" ? 50 : 10;
          this.currentMonster.hp -= damage;
          this.receive("player:dealt", {
            value: damage,
            isCritical: hit.hitType === "BONUS",
            isCounter: false,
          });
          this.receive("monster:update", {
            status: "ALIVE",
            id: this.currentMonster.id,
            hp: this.currentMonster.hp,
          });
        }

        if (hit.type === "DEFEND") {
          const damage = hit.hitType === "BONUS" ? 5 : 0;
          if (damage > 0) {
            this.currentMonster.hp -= damage;
            this.receive("player:dealt", {
              value: damage,
              isCritical: true,
              isCounter: true,
            });
            this.receive("monster:update", {
              status: "ALIVE",
              id: this.currentMonster.id,
              hp: this.currentMonster.hp,
            });
          }
        }

        if (hit.type === "HEAL") {
          const heal = hit.hitType === "BONUS" ? 50 : 10;
          const newHp = Math.max(
            0,
            Math.min(this.currentPlayer.hp + heal, this.currentPlayer.maxHp)
          );
          this.currentPlayer.hp = newHp;
          this.receive("player:hp", { value: newHp });
        }
      }

      if (data.type === "target:miss") {
        if (data.target.type === "DEFEND") {
          this.currentPlayer.hp -= 5;
          this.receive("player:damage", {
            value: 5,
          });
        }
      }
    },
    mockReceive(event, data) {
      if (event === "game:init") {
        this.$emit("initGame", data);
      }

      if (event === "player:damage") {
        this.$emit("playerDamage", data.value);
      }

      if (event === "player:dealt") {
        this.$emit("playerDealt", data);
      }

      if (event === "player:hp") {
        this.$emit("playerHp", data.value);
      }

      if (event === "target:add") {
        const { playerId, ...targetData } = data;
        if (this.currentPlayer.id !== playerId) return;
        this.$emit("addTarget", targetData);
      }
    },

    addTargetIfEmpty() {
      const canAdd = this.gm.ring.activeTargets.length < 4;
      if (!this.gm.monsterIsAlive || !canAdd) return;

      const angle = Math.floor(Math.random() * 361);
      const hits = 1;
      const type =
        Math.random() < 0.8
          ? "ATTACK"
          : Math.random() < 0.8
          ? "DEFEND"
          : Math.random() < 0.8
          ? "HEAL"
          : "SKILL";
      const color = (() => {
        switch (type) {
          case "DEFEND":
            return "green";
          case "HEAL":
            return "gold";
          case "SKILL":
            return "blue";
          case "ATTACK":
          default:
            return "red";
        }
      })();
      this.$emit("addTarget", { angle, hits, type, color });
    },
    generateNewPlayer(data) {
      return {
        id: uuid.v4(),
        name: data.name ?? "Random",
        hp: 100,
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
    },
    generateMonsterEvent() {
      const now = new Date();

      const type =
        Math.random() < 0.8
          ? "ATTACK"
          : Math.random() < 0.8
          ? "DEFEND"
          : Math.random() < 0.8
          ? "HEAL"
          : "SKILL";

      const target = {
        id: uuid.v4(),
        type,
        expiry: now.setSeconds(now.getSeconds() + 3),
        playerId: this.currentPlayer.id,
        bonus: 2,
        size: 10,
      };

      this.receive("target:add", target);
    },
  },
};
</script>

<style scoped>
#connection-status {
  position: absolute;
  right: 20px;
  top: 20px;
  color: gray;
}
</style>