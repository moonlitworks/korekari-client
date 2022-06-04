<template>
  <div id="sprite" ref="sprite" :class="{ 'run-animation': animate }"></div>
</template>

<script>
import { watch } from "vue";
export default {
  name: "Sprite",
  props: {
    state: String,
    fps: Number,
    idle: {
      image: String,
      width: Number,
      height: Number,
      cuts: Number,
      loop: Number | "infinite",
      fillMode: String,
      direction: String,
    },
    attack: {
      image: String,
      width: Number,
      height: Number,
      cuts: Number,
      loop: Number | "infinite",
      fillMode: String,
      direction: String,
    },
    flinch: {
      image: String,
      width: Number,
      height: Number,
      cuts: Number,
      loop: Number | "infinite",
      fillMode: String,
      direction: String,
    },
    death: {
      image: String,
      width: Number,
      height: Number,
      cuts: Number,
      loop: Number | "infinite",
      bgPosition: String,
      fillMode: String,
      direction: String,
    },
  },
  data: () => ({
    animate: false,
    currentSprite: undefined,
    defaults: {
      backgroundImage: "none",
      cuts: 0,
      spriteWidth: "0px",
      spriteHeight: "0px",
      endBackgroundPosition: "0px",
      loop: 1,
      duration: "0s",
      direction: "normal",
      fillMode: "forwards",
    },
  }),
  computed: {
    hasSprite() {
      return !!this.currentSprite;
    },
    spriteElement() {
      return this.$refs["sprite"];
    },
    backgroundImage() {
      if (!this.hasSprite) return `none`;
      return `url(${this.currentSprite.image})`;
    },
    cuts() {
      if (!this.hasSprite) return this.defaults.cuts;
      return this.currentSprite.cuts;
    },
    spriteWidth() {
      if (!this.hasSprite) return this.defaults.spriteWidth;
      return `${this.currentSprite.width}px`;
    },
    spriteHeight() {
      if (!this.hasSprite) return this.defaults.spriteHeight;
      return `${this.currentSprite.height}px`;
    },
    endBackgroundPosition() {
      if (!this.hasSprite) return this.defaults.endBackgroundPosition;
      return `${-(this.currentSprite.width * this.cuts)}px`;
    },
    steps() {
      return `steps(${this.cuts})`;
    },
    loop() {
      if (!this.hasSprite) return this.defaults.loop;
      return this.currentSprite.loop ?? this.defaults.loop;
    },
    duration() {
      if (!this.hasSprite) return this.defaults.duration;
      return `${this.cuts / this.fps}s`;
    },
    direction() {
      if (!this.hasSprite) return this.defaults.direction;
      return this.currentSprite.direction ?? this.defaults.direction;
    },
    fillMode() {
      if (!this.hasSprite) return this.defaults.fillMode;
      return this.currentSprite.fillMode ?? this.defaults.fillMode;
    },
  },
  mounted() {
    this.initializeSprite();
  },
  methods: {
    initializeSprite() {
      this.spriteElement.addEventListener(
        "animationend",
        this.handleAnimationEnd.bind(this)
      );
      watch(() => this.state, this.handleStateChange.bind(this));
      this.setSprite(this.idle, true);
    },
    shouldRestartAnimation(newState) {
      if (this.state === "DYING" && newState === "DEAD") return false;
      if (this.state === "ENTERING" && newState === "IDLE") return false;
      return true;
    },
    spriteByState(state) {
      switch (state) {
        case "ATTACKING":
          return this.attack;
        case "FLINCHING":
        case "COUNTERED":
          return this.flinch;
        case "DYING":
        case "DEAD":
          return this.death;
        case "IDLE":
        case "ENTERING":
        default:
          return this.idle;
      }
    },
    handleAnimationEnd() {
      switch (this.state) {
        case "DYING":
          this.$emit("dead");
          break;
        case "ATTACKING":
        case "FLINCHING":
        case "COUNTERED":
        case "ENTERING":
          this.$emit("setState", "IDLE");
      }
    },
    handleStateChange(state) {
      this.setSprite(
        this.spriteByState(state),
        this.shouldRestartAnimation(state)
      );
    },
    setSprite(sprite, restartAnimation) {
      this.currentSprite = sprite;
      if (restartAnimation) this.restartAnimation();
    },
    restartAnimation() {
      this.animate = false;
      requestAnimationFrame(() => {
        this.animate = true;
      });
    },
  },
};
</script>

<style scoped>
#sprite {
  background: transparent v-bind(backgroundImage) no-repeat 0 0;
  width: v-bind(spriteWidth);
  height: v-bind(spriteHeight);
}

#sprite.run-animation {
  animation-name: sprite-play-position;
  animation-direction: v-bind(direction);
  animation-fill-mode: v-bind(fillMode);
  animation-duration: v-bind(duration);
  animation-timing-function: v-bind(steps);
  animation-iteration-count: v-bind(loop);
}

@keyframes sprite-play-position {
  from {
    background-position: 0;
  }
  to {
    background-position: v-bind(endBackgroundPosition);
  }
}

/*
Apparently, animating background-position is intensive
Ideally should be animating translate but couldn't figure it out yet
*/
@keyframes sprite-play-transform {
  from {
    transform: translateX(-50%) translateY(-50%) translateX(0px);
  }
  to {
    transform: translateX(-50%) translateY(-50%) translateX(-8100px);
  }
}
</style>