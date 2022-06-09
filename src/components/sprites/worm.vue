<template>
  <Base
    ref="base"
    :fps="fps"
    :idle="idle"
    :attack="attack"
    :flinch="flinch"
    :death="death"
  />
</template>

<script>
import Base from "./base.vue";
export default {
  name: "DragormSprite",
  components: {
    Base,
  },
  data: () => ({
    fps: 13,
    idle: {
      image: require("@/assets/sprites/worm/idle.png"),
      width: 900,
      height: 900,
      cuts: 9,
      loop: "infinite",
    },
    attack: {
      image: require("@/assets/sprites/worm/attack.png"),
      width: 900,
      height: 900,
      cuts: 16,
    },
    flinch: {
      image: require("@/assets/sprites/worm/flinch.png"),
      width: 900,
      height: 900,
      cuts: 3,
    },
    death: {
      image: require("@/assets/sprites/worm/death.png"),
      width: 900,
      height: 900,
      cuts: 7,
    },
  }),
};
</script>