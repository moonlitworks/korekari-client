<template>
  <g>
    <Arc :arc="defaultArc" />
    <Arc v-if="hasBonusArc" :arc="bonusArc" />
  </g>
</template>

<script>
import Arc from "./arc.vue";
export default {
  name: "ArcCombo",
  components: {
    Arc,
  },
  props: {
    arcCombo: {
      id: String,
      radius: Number,
      thickness: Number,
      color: String,
      start: Number,
      end: Number,
      bonusStart: Number,
      bonusEnd: Number,
    },
  },
  computed: {
    hasBonusArc() {
      return this.arcCombo.bonusStart && this.arcCombo.bonusEnd;
    },
    defaultArc() {
      return {
        radius: this.arcCombo.radius,
        thickness: this.arcCombo.thickness,
        color: this.arcCombo.color,
        start: this.arcCombo.start,
        end: this.arcCombo.end,
        opacity: this.hasBonusArc ? 0.3 : 0.7,
      };
    },
    bonusArc() {
      return {
        radius: this.arcCombo.radius,
        thickness: this.arcCombo.thickness,
        color: this.arcCombo.color,
        start: this.arcCombo.bonusStart,
        end: this.arcCombo.bonusEnd,
        opacity: 0.7,
      };
    },
  },
  methods: {
    hitType(angle) {
      if (
        this.hasBonusArc &&
        this.detectHit(angle, this.arcCombo.bonusStart, this.arcCombo.bonusEnd)
      ) {
        return "BONUS";
      } else if (
        this.detectHit(angle, this.arcCombo.start, this.arcCombo.end)
      ) {
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
      return Object.assign({}, this.arcCombo);
    },
  },
};
</script>

<style scoped>
</style>