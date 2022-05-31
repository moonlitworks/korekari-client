<template>
  <svg id="ring-box" ref="ring-box">
    <circle id="ring" />
    <g id="arcs">
      <ArcCombo
        ref="arc"
        v-for="arc in arcList"
        :key="arc.id"
        :arcCombo="arc"
      />
    </g>
    <g id="shadows">
      <Shadow
        v-for="shadow in shadowList"
        :key="shadow.id"
        :shadow="shadow"
        @remove="removeShadow"
      />
    </g>
    <circle id="pointer" ref="pointer" />
  </svg>
</template>

<script>
import { uuid } from "vue-uuid";
import ArcCombo from "./arc-combo.vue";
import Shadow from "./shadow.vue";
export default {
  name: "Ring",
  components: {
    ArcCombo,
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
    arcList: [],
    shadowList: [],
  }),
  computed: {
    arcs() {
      return this.$refs["arc"] ?? [];
    },
    pointer() {
      return this.$refs["pointer"];
    },
    ringBox() {
      return this.$refs["ring-box"];
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
    halfThicknessPx() {
      return `${this.thickness / 2}px`;
    },
  },
  methods: {
    addArc(angle, color, size, bonusSize) {
      this.arcList.push({
        id: uuid.v4(),
        radius: this.radius,
        thickness: this.thickness,
        color,
        start: angle - size,
        end: angle + size,
        bonusStart: bonusSize ? angle - bonusSize : undefined,
        bonusEnd: bonusSize ? angle + bonusSize : undefined,
      });
    },
    removeArc(id) {
      this.arcList = this.arcList.filter((x) => x.id !== id);
    },
    addShadow(angle) {
      this.shadowList.push({
        id: uuid.v4(),
        radius: this.radius,
        thickness: this.thickness,
        angle,
      });
    },
    removeShadow(id) {
      this.shadowList = this.shadowList.filter((x) => x.id !== id);
    },
    hit() {
      const currentAngle = this.calculateAngleV1();
      this.addShadow(currentAngle);
      const hits = this.arcs
        .filter((arc) => arc.hitType(currentAngle))
        .map((arc) => ({
          ...arc.toObject(),
          hitType: arc.hitType(currentAngle),
        }));
      return {
        angle: currentAngle,
        hits,
      };
      // .filter((arc) => arc.hitType(currentAngle) !== undefined)
      // .map((arc) => ({
      //   ...arc.toObject(),
      //   angle: currentAngle,
      //   hitType: arc.hitType(currentAngle),
      // }));
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
  position: absolute;
  display: inline-block;
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

#ring {
  cx: 50%;
  cy: 50%;
  r: v-bind(ringRadius);
  stroke: black;
  stroke-opacity: 0.1;
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