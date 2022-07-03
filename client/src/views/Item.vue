<template lang="">
  <div v-if="item" class="q-ma-md">
    <detail :data="item" />
  </div>

  <navbarBottom />
</template>

<script>
import axios from "axios";
import NavbarBottom from "../components/NavbarBottom.vue";
import Detail from "../components/Detail.vue";
//  <div
//    class="absolute-center"
//    style="max-width: 500px; min-width: 300px; min-height: 600px"
//  >
export default {
  components: {
    NavbarBottom,
    Detail,
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
