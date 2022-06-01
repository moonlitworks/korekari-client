<template>
  <div id="sprite"></div>
</template>

<script>
export default {
  name: "Sprite",
  props: {
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
  computed: {
    backgroundImage() {
      return `url(${this.image})`;
    },
    steps() {
      return `steps(${this.cuts})`;
    },
    spriteWidth() {
      return `${this.width}px`;
    },
    spriteHeight() {
      return `${this.height}px`;
    },
    endBackgroundPosition() {
      return `${-this.width * this.cuts}px`;
    },
  },
};
</script>

<style scoped>
#sprite {
  background-image: v-bind(backgroundImage);
  width: v-bind(spriteWidth);
  height: v-bind(spriteHeight);
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