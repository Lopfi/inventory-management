<template lang="">
  <div v-if="location" class="q-ma-md">
    <detail :data="location" />

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
import Detail from "../components/Detail.vue";

export default {
  components: {
    Result,
    NavbarBottom,
    Detail,
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
