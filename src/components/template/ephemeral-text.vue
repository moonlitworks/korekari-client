<template>
  <div id="ephemeral-text-container">
    <EphemeralTextUnit
      class="unit"
      ref="unit"
      v-for="text in textList"
      :key="text.id"
      :duration="duration"
      :endXPosition="endXPosition"
      :endYPosition="endYPosition"
      :id="text.id"
      :text="text.text"
      :color="text.color ?? 'black'"
      @end="removeTextById"
    />
  </div>
</template>

<script setup>
import { defineComponent, defineProps, defineExpose, ref } from "vue";
import { uuid } from "vue-uuid";
import EphemeralTextUnit from "./ephemeral-text-unit.vue";

defineComponent({
  name: "EphemeralText",
  components: {
    EphemeralTextUnit,
  },
});

defineProps({
  duration: Number,
  endXPosition: String,
  endYPosition: String,
  textTransformer: undefined,
  colorTransformer: undefined,
});

const unit = ref();
const textList = ref([]);

function addText(value, color) {
  this.textList.push({
    id: uuid.v4(),
    text: this.textTransformer?.(value) ?? value,
    color: this.colorTransformer?.(value) ?? color,
  });
}

function removeTextById(id) {
  textList.value = textList.value.filter((x) => x.id !== id);
}

defineExpose({
  addText,
  removeTextById,
});
</script>

<style scoped>
#ephemeral-text-container {
  position: relative;
}

.unit {
  position: absolute;
}
</style>