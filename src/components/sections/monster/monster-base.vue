<template>
  <transition>
    <div v-if="monster">
      <div id="sprite-container">
        <component
          id="sprite"
          :is="sprite"
          :class="{ critical: isCritical }"
          :state="state"
          :fps="13"
        ></component>
      </div>

      <div id="display-container">
        <DynamicRing
          id="monster-hp"
          ref="monsterHp"
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

        <div id="monster-info">
          <div id="monster-name">{{ monster.name }}</div>
          <div id="monster-lvl">{{ monster.level }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {
  defineComponent,
  markRaw,
  reactive,
  ref,
  computed,
  onMounted,
} from "vue";
import clamp from "@/services/clamp";
import emitter from "@/services/emitter";
import resetAnimation from "@/services/reset-animation";
import DynamicRing from "../../template/dynamic-ring.vue";
import EphemeralText from "../../template/ephemeral-text.vue";
import Dragorm from "../../sprites/dragorm.vue";

const isCritical = ref(false);
const monsterHp = ref(null);
const hpAlert = ref(null);
const sprite = ref(undefined);
const state = ref(undefined);
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
  monster: undefined,
});
const monster = computed(() => data.monster);
const isAlive = computed(() => {
  if (
    !data.monster ||
    [undefined, "ENTERING", "DYING", "DEAD"].includes(state.value)
  )
    return false;
  return true;
});

const sprites = {
  DRAGORM: markRaw(Dragorm),
};

function setMonster(newMonster) {
  data.monster = newMonster;
  sprite.value = sprites[monster.value.type ?? "DRAGORM"];
  setMonsterHp(monster.value.hp, false);
}

function setMonsterHp(hp, showAlert = true) {
  const difference = hp - monster.value.hp;
  const newHp = clamp(0, monster.value.maxHp)(hp);
  monster.value.hp = newHp;
  monsterHp.value?.setToPercent(monster.value.hp / monster.value.maxHp, 0.5);
  if (showAlert) hpAlert.value.addText(difference);
}

async function toggleCritical() {
  isCritical.value = true;
  await resetAnimation();
  isCritical.value = true;
}

function receiveDamage(damage, isCritical, isCounter) {
  if (!isAlive.value) return;

  if (isCritical) toggleCritical();
  setMonsterHp(monster.value.hp - damage);

  if (monster.value.hp <= 0) {
    state.value = "DYING";
    emitter.emit("monster:dying");
  } else {
    if (isCounter) state.value = "COUNTERING";
    else state.value = "FLINCHING";
  }
}

function transitionState(fromState) {
  switch (fromState) {
    case "FLINCHING":
    case "COUNTERED":
    case "ATTACKING":
    case "ENTERING":
      state.value = "IDLE";
      break;
    case "DYING":
      state.value = "DEAD";
      break;
  }
}

function setState(newState) {
  // don't flinch when attacking, unless state is "COUNTERED"
  if (newState === "FLINCHING" && state.value === "ATTACKING") return;
  if (newState !== state.value) state.value = newState;
  if (state.value === "DEAD") {
    emitter.emit("monster:dead");
  }
}

function onSpriteAnimationEnd() {
  transitionState(state.value);
}

emitter.on("monster:set", setMonster);
emitter.on("monster:hp", setMonsterHp);
emitter.on("monster:damage", receiveDamage);
emitter.on("monster:state:set", setState);
emitter.on("monster:sprite:animation:end", onSpriteAnimationEnd);

onMounted(() => {
  state.value = "IDLE";
});

defineComponent({
  name: "MonsterBase",
  components: {
    DynamicRing,
    EphemeralText,
  },
});
</script>

<style scoped>
#sprite {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

#sprite.critical {
  animation: image-shake 100ms linear infinite;
}

#display-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 70px;
  top: 70px;
  transform-origin: 50% 50%;
}

#monster-info {
  position: absolute;
  text-align: center;
}

#monster-lvl {
  font-size: 30px;
  font-weight: 777;
}

#monster-hp {
  position: absolute;
}

#hp-alert {
  position: absolute;
  bottom: 30px;
  left: 60px;
}

@keyframes image-shake {
  0% {
    transform: translateX(-50%) translateY(-50%) translate(2px, 1px)
      rotate(0deg);
  }
  10% {
    transform: translateX(-50%) translateY(-50%) translate(-1px, -2px)
      rotate(-1deg);
  }
  20% {
    transform: translateX(-50%) translateY(-50%) translate(-3px, 0px)
      rotate(1deg);
  }
  30% {
    transform: translateX(-50%) translateY(-50%) translate(0px, 2px)
      rotate(0deg);
  }
  40% {
    transform: translateX(-50%) translateY(-50%) translate(1px, -1px)
      rotate(1deg);
  }
  50% {
    transform: translateX(-50%) translateY(-50%) translate(-1px, 2px)
      rotate(-1deg);
  }
  60% {
    transform: translateX(-50%) translateY(-50%) translate(-3px, 1px)
      rotate(0deg);
  }
  70% {
    transform: translateX(-50%) translateY(-50%) translate(2px, 1px)
      rotate(-1deg);
  }
  80% {
    transform: translateX(-50%) translateY(-50%) translate(-1px, -1px)
      rotate(1deg);
  }
  90% {
    transform: translateX(-50%) translateY(-50%) translate(2px, 2px)
      rotate(0deg);
  }
  100% {
    transform: translateX(-50%) translateY(-50%) translate(1px, -2px)
      rotate(-1deg);
  }
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