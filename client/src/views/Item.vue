<template lang="">
  <div v-if="item" class="q-ma-md">
    <div class="text-h4">{{ item.itemName }}</div>
    <q-img
      :src="'/api/img/' + item.image"
      alt="couldn't load image"
      style="height: 200px; max-width: 200px"
    />
    <q-list separator>
      <q-item v-ripple>
        <q-item-section>
          <q-item-label>{{ item.itemID }}</q-item-label>
          <q-item-label caption>Id</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-ripple>
        <q-item-section>
          <q-item-label>{{ item.itemName }}</q-item-label>
          <q-item-label caption>Name</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>{{ item.description }}</q-item-label>
          <q-item-label caption>Description</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <router-link :to="'/locations/' + item.locationID" class="link"
          >Location: {{ item.locationID }}</router-link
        >
      </q-item>
    </q-list>
  </div>
  <navbarBottom />
</template>

<script>
import axios from "axios";
import NavbarBottom from "../components/NavbarBottom.vue";

export default {
  components: {
    NavbarBottom,
  },
  data() {
    return {
      item: null,
    };
  },
  mounted() {
    axios.get(`/api/items/${this.$route.params.id}`).then((response) => {
      this.item = response.data[0];
    });
  },
};
</script>
<style></style>
