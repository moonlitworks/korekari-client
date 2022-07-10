<template>
  <div id="inventory-container">
    <transition>
      <div v-if="!!newItem" id="loot">
        <div id="new">
          <div>Equip Item?</div>
          <Timer
            ref="newItemTimer"
            :width="120"
            :duration="10"
            :fromColor="'orangered'"
            :toColor="'snow'"
            @timeout="declineNew"
          />
          <div class="name">{{ newItem.name }}</div>
          <div class="description">{{ newItem.description }}</div>
          <div class="strength">({{ newItem.strength }})</div>
          <div id="actions">
            <button @click.left.prevent="acceptNew">Accept [Z]</button>
            <button @click.left.prevent="declineNew">Decline [X]</button>
          </div>
        </div>
      </div>
    </transition>
    <div id="inventory">
      <div id="armor-container">
        <div v-if="armor" id="armor">
          <div class="name">{{ armor.name }}</div>
          <div class="description">{{ armor.description }}</div>
          <div class="strength">({{ armor.strength }})</div>
        </div>
      </div>
      <div id="weapon-container">
        <div v-if="weapon" id="weapon">
          <div class="name">{{ weapon.name }}</div>
          <div class="description">{{ weapon.description }}</div>
          <div class="strength">({{ weapon.strength }})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, defineExpose, ref } from "vue";
import emitter from "@/services/emitter";
import Timer from "../../template/shrinking-timer.vue";

defineComponent({
  name: "InventorySection",
  components: {
    Timer,
  },
});

defineProps({
  weapon: {
    name: String,
    description: String,
    strength: Number,
  },
  armor: {
    name: String,
    description: String,
    strength: Number,
  },
});

const newItem = ref(undefined);

function setNewItem(item) {
  this.newItem = item;
  this.$refs["newItemTimer"]?.resetTimer();
}

function unsetNewItem() {
  this.newItem = undefined;
}

function acceptNew() {
  if (newItem.value) {
    emitter.emit("item:accept", newItem.value);
  }
}

function declineNew() {
  if (newItem.value) {
    emitter.emit("item:reject", newItem.value);
  }
}

defineExpose({
  setNewItem,
  unsetNewItem,
});
</script>

<style scoped>
#loot {
  position: absolute;
  left: 150px;
  bottom: 130px;
  display: flex;
  width: 100%;
}

#loot > #new,
#loot > #current {
  text-align: center;
  margin: 5px;
  width: 150px;
  height: 150px;
  border-radius: 5px;
  border: 1px solid black;
}

#loot > #new > #actions > button {
  position: relative;
  z-index: 25;
  margin: 1px;
  padding: 1px;
}

#inventory {
  position: absolute;
  left: 150px;
  bottom: 15px;
  display: flex;
  width: 300px;
}

#armor-container,
#weapon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 105px;
  height: 100px;
  margin: 5px;
  background-color: rgba(224, 224, 224, 0.171);
  border: 1px solid black;
}

.name {
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
}

.description {
  font-size: 13px;
  text-align: center;
}

.strength {
  color: mediumslateblue;
  font-size: 12px;
  font-weight: 900;
  text-align: center;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>