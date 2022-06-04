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

<script>
import { uuid } from "vue-uuid";
import EphemeralTextUnit from "./ephemeral-text-unit.vue";
export default {
  name: "EphemeralText",
  components: {
    EphemeralTextUnit,
  },
  props: {
    duration: Number,
    endXPosition: String,
    endYPosition: String,
    textTransformer: undefined,
    colorTransformer: undefined,
  },
  data: () => ({
    textList: [],
  }),
  computed: {
    texts() {
      return this.$refs["unit"];
    },
  },
  methods: {
    addText(value, color) {
      this.textList.push({
        id: uuid.v4(),
        text: this.textTransformer?.(value) ?? value,
        color: this.colorTransformer?.(value) ?? color,
      });
    },
    removeTextById(id) {
      this.textList = this.textList.filter((x) => x.id !== id);
    },
  },
};
</script>

<style scoped>
#ephemeral-text-container {
  position: relative;
}

.unit {
  position: absolute;
}
</style>