<template>
  <svg id="ring-box" ref="ring-box">
    <circle id="ring-backdrop" />
    <circle id="ring" ref="ring" />
    <g id="targets">
      <Target
        ref="target-element"
        v-for="target in targetList"
        :key="target.id"
        :id="target.id"
        :radius="radius"
        :thickness="thickness"
        :type="target.type"
        :color="target.color"
        :angle="target.angle"
        :start="target.start"
        :end="target.end"
        :bonusStart="target.bonusStart"
        :bonusEnd="target.bonusEnd"
        :lifetime="target.lifetime"
        :hits="target.hits"
        :target="target"
        @remove="removeTarget"
        @missed="missedTarget"
      />
    </g>
    <g id="shadows">
      <Shadow
        ref="shadow-element"
        v-for="shadow in shadowList"
        :key="shadow.id"
        :id="shadow.id"
        :radius="radius"
        :thickness="thickness"
        :angle="shadow.angle"
        @remove="removeShadow"
      />
    </g>
    <circle id="pointer" ref="pointer" />
  </svg>
</template>

<script>
import { uuid } from "vue-uuid";
import Target from "./target.vue";
import Shadow from "./shadow.vue";
export default {
  name: "Ring",
  components: {
    Target,
    Shadow,
  },
  props: {
    thickness: Number,
    speed: String,
    ringColor: String, // unused
    ringOpacity: Number, // unused
    pointerColor: String, // unused
  },
  data: () => ({
    targetList: [],
    shadowList: [],
  }),
  computed: {
    activeTargets() {
      if (this.targetList.length <= 0) return [];
      return this.targets.filter((x) => x.active).map((x) => x.toObject());
    },
    targets() {
      if (this.targetList.length <= 0) return [];
      return this.$refs["target-element"];
    },
    shadows() {
      return this.$refs["shadow-element"] ?? [];
    },
    pointer() {
      return this.$refs["pointer"];
    },
    ringBox() {
      return this.$refs["ring-box"];
    },
    ring() {
      return this.$refs["ring"];
    },
    radius() {
      return this.ringBox.clientWidth / 2;
    },
    ringRadius() {
      return `calc(50% - ${this.thickness}px)`;
    },
    thicknessPx() {
      return `${this.thickness}px`;
    },
    backdropThicknessPx() {
      return `${this.thickness + this.thickness / 2}px`;
    },
    halfThicknessPx() {
      return `${this.thickness / 2}px`;
    },
  },
  methods: {
    addTarget(type, angle, color, size, bonusSize, lifetime, hits) {
      this.targetList.push({
        id: uuid.v4(),
        type,
        color,
        lifetime,
        hits,
        angle,
        start: angle - size,
        end: angle + size,
        bonusStart: bonusSize ? angle - bonusSize : undefined,
        bonusEnd: bonusSize ? angle + bonusSize : undefined,
      });
    },
    missedTarget(target) {
      this.$emit("missedTarget", target);
    },
    removeTarget(id) {
      this.targetList = this.targetList.filter((x) => x.id !== id);
    },
    fadeTarget(id, inactivate = false) {
      this.targets.find((x) => x.id === id)?.fade(inactivate);
    },
    hitTarget(id) {
      this.targets.find((x) => x.id === id)?.handleHit();
    },
    addShadow(angle) {
      this.shadowList.push({
        id: uuid.v4(),
        angle,
      });
    },
    removeShadow(id) {
      this.shadowList = this.shadowList.filter((x) => x.id !== id);
    },
    hit() {
      const currentAngle = this.calculateAngleV1();
      this.addShadow(currentAngle);
      const hits = this.targets
        .filter((target) => target.hitType(currentAngle))
        .map((target) => ({
          ...target.toObject(),
          hitType: target.hitType(currentAngle),
        }));
      return {
        angle: currentAngle,
        hits,
      };
    },
    calculateAngleV1() {
      const style = window.getComputedStyle(this.pointer, null);
      const transform =
        style.getPropertyValue("-webkit-transform") ||
        style.getPropertyValue("-moz-transform") ||
        style.getPropertyValue("-ms-transform") ||
        style.getPropertyValue("-o-transform") ||
        style.getPropertyValue("transform") ||
        undefined;
      const matrixRegex = transform.match(
        /matrix\((?<a>.+), (?<b>.+), (?<c>.+), (?<d>.+), (?<e>.+), (?<f>.+)\)/
      );

      const { a, b } = matrixRegex.groups;
      if (!a || !b) return undefined;

      const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      return (angle + 360) % 360;
    },
  },
};
</script>

<style scoped>
:root {
  --rotate-speed: 3s;
}

#ring-box {
  overflow: visible;
  position: absolute;
  display: inline-block;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  pointer-events: none;
  transform-box: fill-box;
  transform-origin: 50% 50%;
  transform: translateX(-50%) translateY(-50%);
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

#ring-backdrop {
  cx: 50%;
  cy: 50%;
  r: v-bind(ringRadius);
  stroke: black;
  stroke-opacity: 0.4;
  stroke-width: v-bind(backdropThicknessPx);
  fill: none;
}

#ring {
  cx: 50%;
  cy: 50%;
  r: v-bind(ringRadius);
  stroke: white;
  stroke-opacity: 1;
  stroke-width: v-bind(thicknessPx);
  fill: none;
}

#pointer {
  cx: 250;
  cy: v-bind(thicknessPx);
  r: v-bind(halfThicknessPx);
  fill: #474747;
  transform-origin: 50% 50%;
  animation-name: pointer-rotate;
  animation-duration: v-bind(speed);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes pointer-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>