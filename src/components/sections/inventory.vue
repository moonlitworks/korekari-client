<template>
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
</template>

<script>
export default {
  name: "Inventory",
  props: {
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
  },
};
</script>

<style>
#inventory {
  width: 210px;
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
</style>