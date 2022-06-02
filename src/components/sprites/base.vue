<template>
  <div id="sprite" ref="sprite" class="run-animation"></div>
</template>

<script>
export default {
  name: "Sprite",
  props: {
    state: String,
    idle: {
      image: String,
      width: Number,
      height: Number,
      cuts: Number,
      duration: String,
      loop: String,
      fillMode: String,
      direction: String,
    },
    attack: {
      image: String,
      width: Number,
      height: Number,
      cuts: Number,
      duration: String,
      loop: String,
      fillMode: String,
      direction: String,
    },
    flinch: {
      image: String,
      width: Number,
      height: Number,
      cuts: Number,
      duration: String,
      loop: String,
      fillMode: String,
      direction: String,
    },
    death: {
      image: String,
      width: Number,
      height: Number,
      cuts: Number,
      duration: String,
      loop: String,
      bgPosition: String,
      fillMode: String,
      direction: String,
    },
  },
  computed: {
    sprite() {
      return this.$refs["sprite"];
    },
    currentSpriteOptions() {
      const sprite = this.spriteByState(this.state);
      this.handleStateChange(this.state);
      return sprite ?? this.idle;
    },
    backgroundImage() {
      if (!this.currentSpriteOptions) return undefined;
      return `url(${this.currentSpriteOptions.image})`;
    },
    steps() {
      if (!this.currentSpriteOptions) return undefined;
      return `steps(${this.currentSpriteOptions.cuts})`;
    },
    spriteWidth() {
      if (!this.currentSpriteOptions) return undefined;
      return `${this.currentSpriteOptions.width}px`;
    },
    spriteHeight() {
      if (!this.currentSpriteOptions) return undefined;
      return `${this.currentSpriteOptions.height}px`;
    },
    endBackgroundPosition() {
      if (!this.currentSpriteOptions) return undefined;
      return `${
        -this.currentSpriteOptions.width * this.currentSpriteOptions.cuts
      }px`;
    },
    loop() {
      return this.currentSpriteOptions?.loop;
    },
    duration() {
      return this.currentSpriteOptions?.duration;
    },
    direction() {
      return this.currentSpriteOptions?.direction;
    },
    fillMode() {
      return this.currentSpriteOptions?.fillMode;
    },
  },
  mounted() {
    this.sprite.addEventListener("animationend", () => {
      switch (this.state) {
        case "DYING":
          this.$emit("dead");
          break;
        case "ATTACKING":
        case "FLINCHING":
          this.$emit("setState", "IDLE");
      }
    });
  },
  methods: {
    restartAnimation() {
      this.sprite.classList.remove("run-animation");
      void this.sprite.offsetWidth;
      this.sprite.classList.add("run-animation");
    },
    handleStateChange(state) {
      if (this.state === "DYING" && state === "DEAD") return;
      if (this.state === "ENTERING" && state === "IDLE") return;
      this.restartAnimation();
    },
    spriteByState(state) {
      switch (state) {
        case "ATTACKING":
          return this.attack;
        case "FLINCHING":
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
  },
};
</script>

<style scoped>
#sprite {
  background-image: v-bind(backgroundImage);
  width: v-bind(spriteWidth);
  height: v-bind(spriteHeight);
}

#sprite.run-animation {
  animation-name: sprite-play;
  animation-direction: v-bind(direction);
  animation-fill-mode: v-bind(fillMode);
  animation-duration: v-bind(duration);
  animation-timing-function: v-bind(steps);
  animation-iteration-count: v-bind(loop);
}

@keyframes sprite-play {
  100% {
    background-position: v-bind(endBackgroundPosition);
  }
}
</style>