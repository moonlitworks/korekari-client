<template>
  <transition>
    <div v-if="player">
      <div id="feedback" ref="feedback" :class="{ hurt: hurt }"></div>

      <div id="display-container">
        <DynamicRing
          id="player-hp"
          ref="playerHp"
          :side="100"
          :color="'white'"
          :opacity="0"
          :width="5"
          :arc="{
            color: 'red',
            opacity: 1,
            startPercent: 1,
            startSpeed: 0,
          }"
        />

        <EphemeralText
          id="hp-alert"
          ref="hpAlert"
          :duration="0.5"
          :endXPosition="'0px'"
          :endYPosition="'-20px'"
          :textTransformer="ephemeralText.textTransformer"
          :colorTransformer="ephemeralText.colorTransformer"
        />

        <div id="player-info">
          <div>{{ player.name }}</div>
        </div>
      </div>

      <Inventory
        id="player-inventory"
        ref="player-inventory"
        :armor="player.armor"
        :weapon="player.weapon"
      />
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, defineComponent, computed, onMounted } from "vue";
import emitter from "@/services/emitter";
import clamp from "@/services/clamp";
import DynamicRing from "../../template/dynamic-ring.vue";
import EphemeralText from "../../template/ephemeral-text.vue";
import Inventory from "./inventory.vue";

defineComponent({
  name: "PlayerBase",
  components: {
    DynamicRing,
    EphemeralText,
    Inventory,
  },
});

const playerHp = ref(null);
const hpAlert = ref(null);
const hurt = ref(false);
const ephemeralText = reactive({
  textTransformer: (hp) => {
    if (hp >= 0) return `+${hp}`;
    return hp.toString();
  },
  colorTransformer: (hp) => {
    if (hp >= 0) return "green";
    return "red";
  },
});

const data = reactive({
  player: undefined,
});
const player = computed(() => data.player);

function setPlayer(newPlayer) {
  data.player = newPlayer;
  setPlayerHp(player.value.hp, false);
}

function setPlayerHp(hp, showAlert = true) {
  const difference = hp - player.value.hp;
  const newHp = clamp(0, player.value.maxHp)(hp);
  player.value.hp = newHp;
  playerHp.value?.setToPercent(player.value.hp / player.value.maxHp, 0.5);
  if (showAlert) hpAlert.value.addText(difference);
}

onMounted(() => {
  emitter.on("player:set", setPlayer);
  emitter.on("player:hp", setPlayerHp);
});
</script>

<style scoped>
#display-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 70px;
  bottom: 70px;
  transform-origin: 50% 50%;
}

#feedback {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
}

#feedback.hurt {
  opacity: 1;
  background-color: rgba(255, 99, 71, 0.5);
  animation: hurt-animation 0.5s ease forwards 1;
}

@keyframes hurt-animation {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

#player-info {
  position: absolute;
}

#player-hp {
  position: absolute;
}

#player-inventory {
  position: absolute;
  width: 100%;
  height: 100%;
}

#hp-alert {
  position: absolute;
  bottom: 30px;
  left: 60px;
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