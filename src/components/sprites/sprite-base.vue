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
  defineEmits,
  defineProps,
  onMounted,
  reactive,
  computed,
  watch,
} from "vue";
import resetAnimation from "@/services/reset-animation";

const sprite = ref();
const spriteState = ref("IDLE");
const isAnimated = ref(true);

const emit = defineEmits(["setState"]);

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

function transitionState(fromState) {
  switch (fromState) {
    case "FLINCHING":
    case "COUNTERED":
    case "ATTACKING":
    case "ENTERING":
      emit("setState", "IDLE");
      break;
    case "DYING":
      emit("setState", "DEAD");
      break;
  }
}

onMounted(() => {
  sprite.value.addEventListener("animationend", () => {
    transitionState(spriteState.value);
  });
  setSpriteByState(props.state, true);
});

defineComponent({
  name: "SpriteBase",
  inheritAttrs: false,
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