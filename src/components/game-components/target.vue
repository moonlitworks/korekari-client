<template>
  <g :class="{ fade: fading }">
    <Arc :arc="defaultArc" :frailty="frailty" />
    <Arc v-if="hasBonusArc" :arc="bonusArc" :frailty="frailty" />
    <component id="icon" :is="icon" :angle="angle"></component>
  </g>
</template>

<script>
import Arc from "./arc.vue";
import Sword from "../icons/sword.vue";
import Heart from "../icons/heart.vue";
export default {
  name: "Target",
  components: {
    Arc,
  },
  props: {
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
  },
  data: () => ({
    active: true,
    fading: false,
    hitsLeft: undefined,
  }),
  computed: {
    icon() {
      switch (this.type) {
        case "HEAL":
          return Heart;
        case "ATTACK":
        case "SKILL":
        default:
          return Sword;
      }
    },
    frailty() {
      if (this.hits === 1 || this.hits === undefined) {
        return "STURDY";
      } else if (this.hitsLeft >= 3) {
        return "STURDY";
      } else if (this.hitsLeft === 2) {
        return "WORN";
      } else {
        return "BRITTLE";
      }
    },
    hasBonusArc() {
      return this.bonusStart !== undefined && this.bonusEnd !== undefined;
    },
    canBeHit() {
      return this.active && (this.hitsLeft === undefined || this.hitsLeft > 0);
    },
    defaultArc() {
      return {
        radius: this.radius,
        thickness: this.thickness,
        color: this.color,
        start: this.start,
        end: this.end,
        opacity: this.hasBonusArc ? 0.4 : 0.9,
      };
    },
    bonusArc() {
      return {
        radius: this.radius,
        thickness: this.thickness,
        color: this.color,
        start: this.bonusStart,
        end: this.bonusEnd,
        opacity: 0.9,
      };
    },
  },
  mounted() {
    if (this.lifetime) {
      setTimeout(() => {
        this.fade();
      }, this.lifetime);
    }
    this.hitsLeft = this.hits;
  },
  methods: {
    fade(inactivate = false) {
      if (inactivate) this.active = false;
      this.fading = true;
      setTimeout(() => {
        this.active = false;
        this.$emit("remove", this.id);
      }, 500);
    },
    hitType(angle) {
      if (!this.canBeHit) return undefined;

      if (
        this.hasBonusArc &&
        this.detectHit(angle, this.bonusStart, this.bonusEnd)
      ) {
        return "BONUS";
      } else if (this.detectHit(angle, this.start, this.end)) {
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
    handleHit() {
      if (this.hitsLeft > 0) {
        this.hitsLeft -= 1;
        if (this.hitsLeft <= 0) {
          this.fade(true);
        }
      }
    },
    toObject() {
      return {
        id: this.id,
        type: this.type,
        radius: this.radius,
        thickness: this.thickness,
        color: this.color,
        start: this.start,
        end: this.end,
        bonusStart: this.bonusStart,
        bonusEnd: this.bonusEnd,
        lifetime: this.lifetime,
        hits: this.hits,
      };
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