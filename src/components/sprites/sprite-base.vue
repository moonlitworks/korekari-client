<template>
  <div>
    <div
      id="sprite-view"
      :style="{
        width: `${currentSprite.width}px`,
        height: `${currentSprite.height}px`,
      }"
    >
      <img
        id="sprite"
        ref="sprite"
        :class="{ animation: isAnimated }"
        :src="currentSprite.image"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  defineComponent,
  defineProps,
  onMounted,
  reactive,
  computed,
  watch,
} from "vue";
import resetAnimation from "@/services/reset-animation";
import emitter from "@/services/emitter";

defineComponent({
  name: "SpriteBase",
  inheritAttrs: false,
});

const sprite = ref();
const spriteState = ref("IDLE");
const isAnimated = ref(true);

const props = defineProps({
  fps: { type: Number, required: true },
  state: { type: String, required: true },

  idle: {
    image: { type: String, required: true },
    cuts: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },

  attack: {
    image: { type: String, required: true },
    cuts: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },

  flinch: {
    image: { type: String, required: true },
    cuts: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },

  death: {
    image: { type: String, required: true },
    cuts: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
});

const currentSprite = reactive({
  spriteWidth: undefined,
  cuts: undefined,
  width: undefined,
  height: undefined,
  image: undefined,
  type: undefined,
});

async function setCurrentSprite(spriteOptions) {
  currentSprite.image = spriteOptions.image;
  currentSprite.cuts = spriteOptions.cuts;
  currentSprite.width = spriteOptions.width;
  currentSprite.height = spriteOptions.height;
  currentSprite.type = spriteOptions.type;
}

const cuts = computed(() => {
  if (!currentSprite.cuts || !currentSprite.type) return 0;
  switch (currentSprite.type) {
    case "final":
    case "transitional":
      return currentSprite.cuts - 1;
    case "infinite":
    default:
      return currentSprite.cuts;
  }
});
const spriteDirection = computed(() => "normal");
const spriteFillMode = computed(() => "both");
const spriteDuration = computed(() => `${cuts.value / props.fps}s`);
const spriteTimingFunction = computed(() => `steps(${cuts.value})`);
const spriteIterationCount = computed(() => {
  switch (currentSprite.type) {
    case "final":
    case "transitional":
      return 1;
    case "infinite":
    default:
      return "infinite";
  }
});
const endTranslateX = computed(() => {
  if (!currentSprite.width) return `translateX(0px)`;
  return `translateX(${cuts.value * -currentSprite.width}px)`;
});

watch(
  () => props.state,
  () => {
    handleStateChange(props.state);
  }
);

function idle() {
  setCurrentSprite({ ...props.idle, type: "infinite" });
}
function attack() {
  setCurrentSprite({ ...props.attack, type: "transitional" });
}
function flinch() {
  setCurrentSprite({ ...props.flinch, type: "transitional" });
}
function die() {
  setCurrentSprite({ ...props.death, type: "final" });
}
async function setSpriteByState(newState, restartAnimation = false) {
  spriteState.value = newState;
  switch (newState) {
    case "ENTERING":
    case "IDLE":
      idle();
      break;
    case "ATTACKING":
      attack();
      break;
    case "FLINCHING":
    case "COUNTERED":
      flinch();
      break;
    case "DYING":
    case "DEAD":
      die();
      break;
  }
  if (restartAnimation) {
    isAnimated.value = false;
    await resetAnimation();
    isAnimated.value = true;
  }
}
function shouldRestartAnimation(fromState, toState) {
  if (fromState === "DYING" && toState === "DEAD") return false;
  if (fromState === "ENTERING" && toState === "IDLE") return false;
  return true;
}
function handleStateChange(newState) {
  setSpriteByState(
    newState,
    shouldRestartAnimation(spriteState.value, newState)
  );
}

onMounted(() => {
  sprite.value.addEventListener("animationend", () => {
    emitter.emit("monster:sprite:animation:end");
  });
  setSpriteByState(props.state, true);
});
</script>

<style scoped>
#sprite-view {
  position: relative;
  overflow: hidden;
}

#sprite.animation {
  animation-name: sprite-animation;
  animation-direction: v-bind(spriteDirection);
  animation-fill-mode: v-bind(spriteFillMode);
  animation-duration: v-bind(spriteDuration);
  animation-timing-function: v-bind(spriteTimingFunction);
  animation-iteration-count: v-bind(spriteIterationCount);
}

@keyframes sprite-animation {
  from {
    transform: translateX(0px);
  }
  to {
    transform: v-bind(endTranslateX);
  }
}
</style>