<template lang="">
  <div class="text-h4">{{ data.itemName || data.locationName }}</div>
  <q-img
    :src="'/api/img/' + data.image"
    alt="couldn't load image"
    style="height: 200px; max-width: 200px"
  />
  <q-list separator>
    <q-item v-ripple>
      <q-item-section>
        <q-item-label>{{ data.itemID || data.locationID }}</q-item-label>
        <q-item-label caption>Id</q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-ripple>
      <q-item-section>
        <q-item-label>{{ data.itemName || data.locationName }}</q-item-label>
        <q-item-label caption>Name</q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-ripple>
      <q-item-section>
        <q-item-label>{{ data.description }}</q-item-label>
        <q-item-label caption>Description</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      v-if="data.itemName"
      v-ripple
      clickable
      @click="this.$router.push('/locations/' + data.locationID)"
    >
      <q-item-section>
        <q-item-label>{{ data.locationID }}</q-item-label>
        <q-item-label caption>Loacation</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
  },
};
</script>
<style></style>
