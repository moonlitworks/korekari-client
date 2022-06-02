<template>
  <Base
    ref="base"
    :idle="idle"
    :attack="attack"
    :flinch="flinch"
    :death="death"
  />
</template>

<script>
import Base from "./base.vue";
export default {
  name: "Worm",
  components: {
    Base,
  },
  data: () => ({
    idle: {
      image: require("@/assets/sprites/worm/idle.png"),
      width: 900,
      height: 900,
      cuts: 9,
      duration: "0.8s",
      loop: "infinite",
      fillMode: "forwards",
      direction: "normal",
    },
    attack: {
      image: require("@/assets/sprites/worm/attack.png"),
      width: 900,
      height: 900,
      cuts: 16,
      duration: "0.8s",
      loop: "1",
      fillMode: "forwards",
      direction: "normal",
    },
    flinch: {
      image: require("@/assets/sprites/worm/flinch.png"),
      width: 900,
      height: 900,
      cuts: 3,
      duration: "0.3s",
      loop: "1",
      fillMode: "forwards",
      direction: "normal",
    },
    death: {
      image: require("@/assets/sprites/worm/death.png"),
      width: 900,
      height: 900,
      cuts: 7,
      duration: "0.8s",
      loop: "1",
      fillMode: "forwards",
      direction: "normal",
    },
  }),
};
</script>