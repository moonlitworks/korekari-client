<template>
  <svg :viewBox="viewBox" :width="boxSize" :height="boxSize">
    <circle
      v-if="!!backring"
      id="back-ring"
      :r="ringRadius"
      :stroke="backringColor"
      :stroke-opacity="backringOpacity"
      :stroke-width="backringWidth"
    />

    <circle
      id="main-ring"
      :r="ringRadius"
      :stroke="ringColor"
      :stroke-opacity="ringOpacity"
      :stroke-width="ringWidth"
    />

    <DynamicRingArc
      id="arc"
      ref="arc"
      :radius="radius"
      :width="width"
      :color="arc?.color ?? 'white'"
      :opacity="arc?.opacity ?? 0"
      :shadow="arc?.shadow ?? 0"
      :linecap="arc?.linecap ?? 'round'"
      :init="{
        angle: arc?.startAngle ?? 0,
        percent: arc?.startPercent ?? 0,
        speed: arc?.startSpeed ?? 0,
      }"
    />
  </svg>
</template>

<script>
import DynamicRingArc from "./dynamic-ring-arc.vue";
export default {
  name: "DynamicRing",
  components: {
    DynamicRingArc,
  },
  props: {
    side: Number,
    width: Number,
    color: String,
    opacity: Number,
    backring: {
      color: String,
      opacity: Number,
      width: Number,
    },
    arc: {
      color: String,
      opacity: Number,
      shadow: Number,
      linecap: String,
      startAngle: Number,
      startPercent: Number,
      startSpeed: Number,
    },
  },
  computed: {
    radius() {
      return this.side / 2;
    },
    boxSize() {
      return `${this.side}px`;
    },
    viewBox() {
      return `0 0 ${this.side} ${this.side}`;
    },
    ringRadius() {
      return `${this.radius}px`;
    },
    ringColor() {
      return this.color;
    },
    ringOpacity() {
      return this.opacity;
    },
    ringWidth() {
      return `${this.width}px`;
    },
    backringColor() {
      if (!this.backring) return undefined;
      return this.backring.color;
    },
    backringOpacity() {
      if (!this.backring) return undefined;
      return this.backring.opacity;
    },
    backringWidth() {
      if (!this.backring) return undefined;
      return `${this.backring.width}px`;
    },
  },
  methods: {
    setToAngle(angle, speed) {
      this.$refs["arc"].setToAngle(angle, speed);
    },
    setToPercent(percent, speed) {
      this.$refs["arc"].setToPercent(percent, speed);
    },
  },
};
</script>

<style>
svg {
  overflow: visible;
}

#back-ring {
  cy: 50%;
  cx: 50%;
  fill: none;
}

#main-ring {
  cy: 50%;
  cx: 50%;
  fill: none;
}
</style>