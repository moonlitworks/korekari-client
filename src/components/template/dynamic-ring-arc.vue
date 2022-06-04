<template>
  <g>
    <path
      id="main-path"
      ref="main-path"
      fill="none"
      :class="{ animate: toAnimate }"
      :stroke="color"
      :stroke-opacity="opacity"
      :stroke-width="width + 'px'"
      :stroke-linecap="linecap"
      :d="d"
    />
    <path
      v-if="shadow > 0"
      id="shadow-path"
      ref="shadow-path"
      fill="none"
      :stroke="color"
      :stroke-opacity="shadow"
      :stroke-width="width + 'px'"
      :stroke-linecap="linecap"
      :d="d"
    />
  </g>
</template>

<script>
import { calculateX, calculateY, isLargeArc } from "../../utils";
export default {
  name: "DynamicRingArc",
  props: {
    radius: Number,
    width: Number,
    color: String,
    opacity: Number,
    linecap: String,
    shadow: Number,
    init: {
      angle: Number,
      percent: Number,
      speed: Number,
    },
  },
  data: () => ({
    start: 0,
    end: 359.9,
    animation: {
      enabled: false,
      from: 0,
      to: 0,
      speed: "0s",
    },
  }),
  computed: {
    mainPath() {
      return this.$refs["main-path"];
    },
    shadowPath() {
      return this.$refs["shadow-path"];
    },
    toAnimate() {
      return this.animation.enabled;
    },
    pathLength() {
      return this.mainPath.getTotalLength();
    },
    d() {
      const startX = this.radius + calculateX(this.start, this.radius);
      const startY = this.radius + calculateY(this.start, this.radius);
      const endX = this.radius + calculateX(this.end, this.radius);
      const endY = this.radius + calculateY(this.end, this.radius);
      const largeArcFlag = isLargeArc(this.start, this.end) ? "1" : "0";
      return `M ${startX} ${startY} A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    },
  },
  mounted() {
    const startAngle = this.init?.angle ?? 0;
    const startPercent = this.init?.percent ?? 0;
    const startSpeed = this.init?.speed ?? 0;
    if (startAngle > 0) {
      this.setToAngle(startAngle, startSpeed);
    } else if (startPercent > 0) {
      this.setToPercent(startPercent, startSpeed);
    }
  },
  methods: {
    currentOffset() {
      return Number(
        getComputedStyle(this.mainPath)
          .getPropertyValue("stroke-dashoffset")
          .replace("px", "")
      );
    },
    setToAngle(angle, speed) {
      angle = Math.max(0, Math.min(angle, 359.9));
      const percent = ((angle + 360) % 360) / 360;
      this.setToPercent(percent, speed);
    },
    setToPercent(percent, speed) {
      percent = Math.max(0.0, Math.min(percent, 1.0));
      this.animation.enabled = false;
      this.animation.from = this.currentOffset();
      this.animation.to = this.pathLength * (1 - percent);
      this.animation.speed = speed + "s";
      requestAnimationFrame(() => {
        this.animation.enabled = true;
      });
    },
  },
};
</script>

<style scoped>
#main-path {
  stroke-dasharray: v-bind(pathLength) v-bind(pathLength);
  stroke-dashoffset: v-bind(pathLength);
}

#shadow-path {
  stroke-dasharray: v-bind(pathLength) v-bind(pathLength);
  stroke-dashoffset: v-bind("animation.to");
}

#main-path.animate {
  animation: fill v-bind("animation.speed") ease-out forwards;
}

@keyframes fill {
  0% {
    stroke-dashoffset: v-bind("animation.from");
  }
  100% {
    stroke-dashoffset: v-bind("animation.to");
  }
}
</style>