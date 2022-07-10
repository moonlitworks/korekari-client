<template>
  <SpriteBase :idle="idle" :attack="attack" :flinch="flinch" :death="death" />
</template>

<script setup>
import { defineComponent, reactive } from "vue";
import SpriteBase from "./sprite-base.vue";

defineComponent({
  name: "DragormSprite",
  inheritAttrs: false,
  components: {
    SpriteBase,
  },
});

const idle = reactive({
  image: require("@/assets/sprites/worm/idle.png"),
  width: 900,
  height: 900,
  cuts: 9,
});

const attack = reactive({
  image: require("@/assets/sprites/worm/attack.png"),
  width: 900,
  height: 900,
  cuts: 16,
});

const flinch = reactive({
  image: require("@/assets/sprites/worm/flinch.png"),
  width: 900,
  height: 900,
  cuts: 3,
});

const death = reactive({
  image: require("@/assets/sprites/worm/death.png"),
  width: 900,
  height: 900,
  cuts: 8,
});
</script>