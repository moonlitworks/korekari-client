<template>
  <g :class="{ fade: !active }">
    <Arc :arc="defaultArc" />
    <Arc v-if="hasBonusArc" :arc="bonusArc" />
  </g>
</template>

<script>
import Arc from "./arc.vue";
export default {
  name: "Target",
  components: {
    Arc,
  },
  props: {
    target: {
      id: String,
      type: String,
      radius: Number,
      thickness: Number,
      color: String,
      start: Number,
      end: Number,
      bonusStart: Number,
      bonusEnd: Number,
      lifetime: Number,
      hits: Number,
    },
  },
  data: () => ({
    active: true,
  }),
  computed: {
    id() {
      return this.target.id;
    },
    hasBonusArc() {
      return this.target.bonusStart && this.target.bonusEnd;
    },
    defaultArc() {
      return {
        radius: this.target.radius,
        thickness: this.target.thickness,
        color: this.target.color,
        start: this.target.start,
        end: this.target.end,
        opacity: this.hasBonusArc ? 0.3 : 0.7,
      };
    },
    bonusArc() {
      return {
        radius: this.target.radius,
        thickness: this.target.thickness,
        color: this.target.color,
        start: this.target.bonusStart,
        end: this.target.bonusEnd,
        opacity: 0.7,
      };
    },
  },
  mounted() {
    if (this.target.lifetime) {
      setTimeout(() => {
        this.fade();
      }, this.target.lifetime);
    }
  },
  methods: {
    fade() {
      this.active = false;
      setTimeout(() => {
        this.$emit("remove", this.target.id);
      }, 500);
    },
    hitType(angle) {
      if (!this.active) return undefined;

      if (
        this.hasBonusArc &&
        this.detectHit(angle, this.target.bonusStart, this.target.bonusEnd)
      ) {
        return "BONUS";
      } else if (this.detectHit(angle, this.target.start, this.target.end)) {
        return "HIT";
      }

      return undefined;
    },
    detectHit(angle, start, end) {
      if (start < 0) {
        return angle >= start + 360 || angle <= end;
      } else {
        return angle >= start && angle <= end;
      }
    },
    toObject() {
      return Object.assign({}, this.target);
    },
  },
};
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