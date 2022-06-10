<template>
  <SpriteBase :idle="idle" :attack="attack" :flinch="flinch" :death="death" />
</template>

<script>
import SpriteBase from "./sprite-base.vue";
export default {
  name: "DragormSprite",
  components: {
    SpriteBase,
  },
  data: () => ({
    idle: {
      image: require("@/assets/sprites/worm/idle.png"),
      width: 900,
      height: 900,
      cuts: 9,
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
      cuts: 8,
    },
  }),
};
</script>