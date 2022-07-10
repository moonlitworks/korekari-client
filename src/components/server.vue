<template>
  <span id="connection-status">{{ connectionStatus }}</span>
  <span v-if="appUpdated" id="app-updated"
    >New content is available; please refresh.</span
  >
</template>

<script>
import { uuid } from "vue-uuid";
import { normalPlayerDamage, normalMonsterDamage } from "@/services/dynamics";
import { randomBetween } from "../utils";
import emitter from "@/services/emitter";
export default {
  name: "ServerSection",
  data: () => ({
    connectionStatus: "MOCKED",
    isClientReady: false,
    isMissDisabled: false,
    currentPlayers: [],
    currentPlayer: undefined,
    currentMonster: undefined,
    appUpdated: false,
  }),
  computed: {
    isMocked() {
      return this.connectionStatus === "MOCKED";
    },
    isMonsterAlive() {
      return this.currentMonster?.hp > 0;
    },
  },
  mounted() {
    this.generateMonster(1);
    setInterval(() => {
      if (!this.isClientReady || !this.isMonsterAlive) return;
      this.generateMonsterEvent();
    }, 1000);
    emitter.on("app:updated", () => {
      this.appUpdated = true;
    });
    const newPlayer = this.generateNewPlayer({ name: "Hunter" });
    emitter.emit("player:set", newPlayer);

    emitter.on("server:send", this.send.bind(this));
    emitter.on("server:receive", this.receive.bind(this));

    emitter.on("player:register", (data) => {
      const newPlayer = this.generateNewPlayer(data);
      this.currentPlayers.push(newPlayer);
      this.currentPlayer = newPlayer;
      this.isClientReady = true;
      this.receive("game:init", {
        player: newPlayer,
        monster: this.currentMonster,
      });

      emitter.emit("player:set", newPlayer);
    });
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

        emitter.emit("player:set", newPlayer);
        return;
      }

      if (data.type === "player:miss") {
        if (this.isMonsterAlive) {
          const damage = normalMonsterDamage(
            this.currentMonster,
            this.currentPlayer
          );
          this.currentPlayer.hp -= damage;
          this.receive("player:damage", {
            value: damage,
          });
        }
      }

      if (data.type === "target:hit") {
        const hit = data.hit;
        if (hit.type === "ATTACK") {
          if (!this.isMonsterAlive) return;
          const rawDamage = normalPlayerDamage(
            this.currentMonster,
            this.currentPlayer
          );
          const bonusMultiplier = hit.hitType === "BONUS" ? 10 : 1;
          const totalDamage = rawDamage * bonusMultiplier;
          this.currentMonster.hp -= totalDamage;
          this.receive("player:dealt", {
            value: totalDamage,
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
          if (!this.isMonsterAlive) return;
          const rawDamage = normalPlayerDamage(
            this.currentMonster,
            this.currentPlayer
          );
          const bonusMultiplier = hit.hitType === "BONUS" ? 50 : 10;
          const totalDamage = rawDamage * bonusMultiplier;
          this.currentMonster.hp -= totalDamage;
          this.receive("player:dealt", {
            value: totalDamage,
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
          if (hit.hitType !== "BONUS" || !this.isMonsterAlive) return;
          const rawDamage = normalPlayerDamage(
            this.currentMonster,
            this.currentPlayer
          );
          const totalDamage = rawDamage * 5;
          if (totalDamage > 0) {
            this.currentMonster.hp -= totalDamage;
            this.receive("player:dealt", {
              value: totalDamage,
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
          const heal = hit.hitType === "BONUS" ? 30 : 10;
          this.healPlayer(heal);
        }

        if (hit.type === "ITEM") {
          const rare = hit.hitType === "BONUS";
          const type = Math.random() < 0.6 ? "WEAPON" : "ARMOR";
          const strength = rare ? hit.strength.rare : hit.strength.normal;
          const name = type === "WEAPON" ? "Dragorm's Tooth" : "Dragorm's Hide";
          const description = `${type} from ${
            this.currentMonster?.name ?? "Dragorm"
          }`;
          const item = {
            type,
            id: uuid.v4(),
            element: this.currentMonster?.element ?? "FIRE",
            strength,
            name,
            description,
          };
          // TODO: fix issue where ITEM target is hit after monster
          // is defeated causing `this.currentMonster` to be undefined
          // and .name/.element properties fail but needed to generate
          // this item. Maybe pass on target creation? cache?
          this.receive("item:get", item);
        }

        this.checkMonsterHealth();
      }

      if (data.type === "target:miss") {
        if (data.target.type === "DEFEND" && !this.isMissDisabled) {
          const damage =
            2 * normalMonsterDamage(this.currentMonster, this.currentPlayer);
          this.currentPlayer.hp -= damage;
          this.receive("player:damage", {
            value: damage,
          });
        }
      }

      if (data.type === "item:accept") {
        switch (this.item.type) {
          case "WEAPON":
            this.currentPlayer.weapon = this.data.item;
            break;
          case "ARMOR":
            this.playerObject.armor = this.data.item;
            break;
        }
      }
    },
    mockReceive(event, data) {
      if (event === "game:init") {
        this.$emit("initGame", data);
        emitter.emit(event, data);
      }

      if (event === "player:damage") {
        emitter.emit(event, data);
      }

      if (event === "player:dealt") {
        this.$emit("playerDealt", data);
        emitter.emit(event, data);
      }

      if (event === "player:hp") {
        this.$emit("playerHp", data.value);
        emitter.emit(event, data.value);
      }

      if (event === "target:add") {
        const { playerId, ...targetData } = data;
        if (this.currentPlayer.id !== playerId) return;
        emitter.emit("target:add", targetData);
      }

      if (event === "item:get") {
        this.$emit("getItem", data);
        emitter.emit(event, data);
      }
    },

    generateNewPlayer(data) {
      return {
        id: uuid.v4(),
        name: data.name ?? "Random",
        hp: 100,
        maxHp: 100,
        weapon: undefined,
        armor: undefined,
      };
    },
    generateMonster(level) {
      const newMonster = {
        id: uuid.v4(),
        name: "Dragorm",
        type: "DRAGORM",
        level,
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
      };
      this.currentMonster = newMonster;
      emitter.emit("monster:set", newMonster);
    },
    generateMonsterEvent() {
      const now = new Date();
      const type = ((num) => {
        if (num < 0.5) return "ATTACK";
        if (num < 0.75) return "DEFEND";
        if (num < 0.875) return "DEFEND";
        if (num < 0.9375) return "HEAL";
        if (num < 0.96875) return "SKILL";
        return "ITEM";
      })(Math.random());

      const target = {
        id: uuid.v4(),
        angle: Math.round(Math.random() * 359),
        type,
        expiry: now.setSeconds(now.getSeconds() + 3),
        playerId: this.currentPlayer.id,
        bonus: 1,
        size: 10,
        strength: {
          rare: this.currentMonster.level + randomBetween(4, 10),
          normal: this.currentMonster.level + randomBetween(1, 4),
        },
      };

      if (target.type === "DEFEND")
        emitter.emit("monster:state:set", "ATTACKING");

      this.receive("target:add", target);
    },
    checkMonsterHealth() {
      if (this.isMonsterAlive || !this.currentMonster?.level) return;
      this.healPlayer(20);
      const lastLevel = this.currentMonster.level;
      this.currentMonster = undefined;
      setTimeout(() => {
        this.generateMonster(lastLevel + 1);
      }, 2000);
    },
    healPlayer(amount) {
      const newHp = Math.max(
        0,
        Math.min(this.currentPlayer.hp + amount, this.currentPlayer.maxHp)
      );
      this.currentPlayer.hp = newHp;
      this.receive("player:hp", { value: newHp });
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

#app-updated {
  position: absolute;
  right: 20px;
  top: 40px;
  color: gray;
}
</style>