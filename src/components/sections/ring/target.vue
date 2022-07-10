<template>
  <g :class="{ fade: fading }">
    <Arc :arc="defaultArc" :frailty="frailty" />
    <Arc v-if="hasBonusArc" :arc="bonusArc" :frailty="frailty" />
    <component id="icon" :is="icon" :angle="angle"></component>
  </g>
</template>

<script setup>
import {
  defineComponent,
  defineProps,
  defineExpose,
  onMounted,
  ref,
  computed,
} from "vue";
import emitter from "@/services/emitter";
import Sword from "../../icons/sword.vue";
import Heart from "../../icons/heart.vue";
import Shield from "../../icons/shield.vue";
import Item from "../../icons/item.vue";
import Arc from "./arc.vue";

defineComponent({
  name: "TargetSection",
  components: {
    Arc,
  },
});

const props = defineProps({
  id: String,
  type: String,
  angle: Number,
  radius: Number,
  thickness: Number,
  color: String,
  start: Number,
  end: Number,
  bonusStart: Number,
  bonusEnd: Number,
  lifetime: Number,
  hits: Number,
  strength: {
    normal: Number,
    rare: Number,
  },
});

const active = ref(true);
const fading = ref(false);
const hitsLeft = ref(undefined);
const round = ref(true);

const icon = computed(() => {
  switch (props.type) {
    case "DEFEND":
      return Shield;
    case "HEAL":
      return Heart;
    case "ATTACK":
    case "SKILL":
      return Sword;
    case "ITEM":
      return Item;
    default:
      return undefined;
  }
});

const frailty = computed(() => {
  if (props.hits === 1 || props.hits === undefined) {
    return "STURDY";
  } else if (hitsLeft.value >= 3) {
    return "STURDY";
  } else if (hitsLeft.value === 2) {
    return "WORN";
  } else {
    return "BRITTLE";
  }
});

const hasBonusArc = computed(() => {
  return props.bonusStart !== undefined && props.bonusEnd !== undefined;
});

const canBeHit = computed(() => {
  return active.value && (hitsLeft.value === undefined || hitsLeft.value > 0);
});

const defaultArc = computed(() => {
  return {
    round,
    radius: props.radius,
    thickness: props.thickness,
    color: props.color,
    start: props.start,
    end: props.end,
    opacity: hasBonusArc.value ? 0.4 : 0.9,
  };
});

const bonusArc = computed(() => {
  return {
    round,
    radius: props.radius,
    thickness: props.thickness,
    color: props.color,
    start: props.bonusStart,
    end: props.bonusEnd,
    opacity: 0.9,
  };
});

function fade(inactivate = false) {
  if (inactivate) active.value = false;
  fading.value = true;
  setTimeout(() => {
    // deactivate if not already
    active.value = false;

    // emit if missed
    if (hitsLeft.value !== undefined && hitsLeft.value > 0) {
      emitter.emit("target:miss", toObject);
    }

    // request to be removed
    emitter.emit("target:remove", props.id);
  }, 500);
}

function hitType(angle) {
  if (!canBeHit.value) return undefined;

  if (hasBonusArc.value && detectHit(angle, props.bonusStart, props.bonusEnd)) {
    return "BONUS";
  } else if (detectHit(angle, props.start, props.end)) {
    return "HIT";
  }

  return undefined;
}

function detectHit(angle, start, end) {
  if (start < 0) {
    return angle >= start + 360 || angle <= end;
  } else {
    return angle >= start && angle <= end;
  }
}

function handleHit() {
  if (hitsLeft.value > 0) {
    hitsLeft.value -= 1;
    if (hitsLeft.value <= 0) {
      fade(true);
      emitter.emit("target:hit", toObject);
    }
  }
}

function toObject() {
  return props;
}

onMounted(() => {
  if (props.lifetime) {
    setTimeout(() => {
      fade();
    }, props.lifetime);
  }
  hitsLeft.value = props.hits;
});

defineExpose({
  id: props.id,
  active,
  fade,
  hitType,
  canBeHit,
  detectHit,
  handleHit,
  toObject,
});
</script>

<style scoped>
g.fade {
  animation: fade 0.5s ease forwards;
}

@keyframes fade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>