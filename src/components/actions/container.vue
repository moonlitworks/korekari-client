<template>
  <svg id="action-container" ref="action-circle">
    <circle id="action-circle" />
    <g id="targets">
      <ActionTarget
        ref="action-target"
        v-for="target in targets"
        :key="target.id"
        :id="target.id"
        :radius="250"
        :thickness="thickness"
        :color="target.color"
        :defaultStartAngle="target.defaultStartAngle"
        :defaultEndAngle="target.defaultEndAngle"
        :criticalStartAngle="target.criticalStartAngle"
        :criticalEndAngle="target.criticalEndAngle"
      />
    </g>
    <g id="shadows">
      <ActionPointerShadow
        v-for="shadow in shadows"
        :key="shadow.id"
        :id="shadow.id"
        :radius="250"
        :thickness="thickness"
        :angle="shadow.angle"
        @remove="removeShadow"
      />
    </g>
    <circle id="action-pointer" ref="action-pointer" />
  </svg>
</template>

<script>
import { uuid } from "vue-uuid";
import ActionTarget from "./target.vue";
import ActionPointerShadow from "./pointer-shadow.vue";
export default {
  name: "ActionContainer",
  components: {
    ActionTarget,
    ActionPointerShadow,
  },
  props: {
    thickness: Number,
  },
  data: () => ({
    targets: [],
    shadows: [],
  }),
  computed: {
    actionCircleRadius() {
      return (
        this.$refs["action-circle"]?.getBoundingClientRect().width / 2 +
          this.thickness || 0
      );
    },
  },
  created() {
    this.addTarget(120, 255, 0, 0, 50, 30);
    this.addTarget(240, 255, 0, 0, 50, 6);
    this.addTarget(0, 255, 0, 0, 20, 6);
  },
  methods: {
    addTarget(angle, r, g, b, space, critSpace) {
      this.targets.push({
        id: uuid.v4(),
        color: { r, g, b },
        defaultStartAngle: this.clampAngle(angle - space / 2),
        defaultEndAngle: this.clampAngle(angle + space / 2),
        criticalStartAngle: this.clampAngle(angle - critSpace / 2),
        criticalEndAngle: this.clampAngle(angle + critSpace / 2),
      });
    },
    clampAngle(rawAngle) {
      return rawAngle % 360;
    },
    handleHit(angle) {
      return function (target) {
        const hit = target.checkHit(angle);
        if (hit === "CRITICAL") {
          this.$emit("monsterHit", 10, true);
        } else if (hit === "HIT") {
          this.$emit("monsterHit", 1, false);
        }
      };
    },
    checkHit(angle) {
      this.$refs["action-target"].forEach(this.handleHit(angle).bind(this));
    },
    addShadow(angle) {
      this.shadows.push({
        id: uuid.v4(),
        angle,
      });
    },
    removeShadow(shadowId) {
      this.shadows = this.shadows.filter((s) => s.id !== shadowId);
    },
    interact() {
      const currentPointerAngle = this.calculateAngleV1();
      this.addShadow(currentPointerAngle);
      this.checkHit(currentPointerAngle);
    },
    calculateAngleV1() {
      const actionPointer = this.$refs["action-pointer"];
      const style = window.getComputedStyle(actionPointer, null);
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
      return (angle + 270) % 360;
    },
  },
};
</script>

<style scoped>
#action-container {
  position: absolute;
  display: inline-block;
  max-width: 90vw;
  max-height: 90vh;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  pointer-events: none;
  transform-origin: 50% 50%;
  transform: translateX(-50%) translateY(-50%);
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

#action-circle {
  cx: 50%;
  cy: 50%;
  r: calc(50% - 10px);
  stroke: #0001;
  stroke-width: 10px;
  fill: none;
}

#action-pointer {
  cx: 250;
  cy: 10;
  r: 5px;
  fill: gray;
  transform-origin: 50% 50%;
  animation: action-pointer-rotate 3s linear infinite;
}

@keyframes action-pointer-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>