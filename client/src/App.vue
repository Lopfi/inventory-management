<template>
  <div class="main-page">
    <div class="navbar" color="grey-9 ">
      <q-tabs
        v-model="tab"
        class="text-white"
        indicator-color="grey-10"
        active-color="light-green"
        align="justify"
      >
        <q-route-tab
          name="items"
          icon="handyman"
          label="Items"
          to="/results/items"
          exact
        />
        <q-route-tab
          name="Locations"
          icon="archive"
          label="Locations"
          to="/results/locations"
          exact
        />
      </q-tabs>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "LayoutDefault",

  components: {},

  setup() {
    return {
      tab: ref("items"),
    };
  },
  mounted() {
    this.$router.push(`/results/items`);
  },
};
</script>
<style scoped>
.navbar {
  background-color: #424242;
}
</style>
