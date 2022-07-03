<template lang="">
  <div v-if="location" class="q-ma-md">
    <div>
      <div class="text-h4">{{ location.locationName }}</div>
      <q-img
        :src="'/api/img/' + location.image"
        alt="couldn't load image"
        style="height: 200px; max-width: 200px"
      />
      <q-list separator>
        <q-item v-ripple>
          <q-item-section>
            <q-item-label>{{ location.locationID }}</q-item-label>
            <q-item-label caption>Id</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>
            <q-item-label>{{ location.locationName }}</q-item-label>
            <q-item-label caption>Name</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>{{ location.description }}</q-item-label>
            <q-item-label caption>Description</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-if="items.length > 0" class="q-mt-xl">
      <p id="result-count">found {{ items.length }} items at this location</p>
      <div class="row items-start q-gutter-md">
        <result
          v-for="(result, index) in items"
          :result="result"
          :kind="'items'"
          :key="index"
        />
      </div>
    </div>
  </div>
  <navbarBottom />
</template>
<script>
import axios from "axios";
import Result from "../components/Result";
import NavbarBottom from "../components/NavbarBottom.vue";

export default {
  components: {
    Result,
    NavbarBottom,
  },
  data() {
    return {
      location: null,
      items: [],
    };
  },
  mounted() {
    axios
      .get(`/api/locations/${this.$route.params.id}`)
      .then((response) => (this.location = response.data[0]));
    axios
      .get(`/api/locations/${this.$route.params.id}/items`)
      .then((response) => {
        this.items = response.data;
        console.log(this.items.length);
      });
  },
};
</script>
<style></style>
