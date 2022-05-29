<template>
  <svg id="action-container" ref="action-circle">
    <circle id="action-circle" />
    <g id="targets">
      <ActionTarget
        v-for="target in targets"
        :key="target.id"
        :id="target.id"
        :radius="250"
        :thickness="thickness"
        :defaultStartAngle="target.defaultStartAngle"
        :defaultEndAngle="target.defaultEndAngle"
        :criticalStartAngle="target.criticalStartAngle"
        :criticalEndAngle="target.criticalEndAngle"
      />
    </g>
    <circle id="action-pointer" ref="action-pointer" />
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
    targets: [
      {
        id: uuid.v4(),
        defaultStartAngle: 260,
        defaultEndAngle: 280,
        criticalStartAngle: 267,
        criticalEndAngle: 273,
      },
    ],
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
  methods: {
    handleHit(angle) {
      return function (target) {
        if (
          angle >= target.criticalStartAngle &&
          angle <= target.criticalEndAngle
        ) {
          this.$emit("monsterHit", 10);
        } else if (
          angle >= target.defaultStartAngle &&
          angle <= target.defaultEndAngle
        ) {
          this.$emit("monsterHit", 1);
        }
      };
    },
    checkHit(angle) {
      this.targets.forEach(this.handleHit(angle).bind(this));

      if (
        this.targets.some(
          (t) => angle >= t.defaultStartAngle && angle <= t.defaultEndAngle
        )
      ) {
        this.$emit("monsterHit", 1);
      }
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
  stroke: #fff5;
  stroke-width: 10px;
  fill: none;
}

#action-pointer {
  cx: 250;
  cy: 10;
  r: 5px;
  fill: white;
  transform-origin: 50% 50%;
  animation: action-pointer-rotate 2s linear infinite;
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