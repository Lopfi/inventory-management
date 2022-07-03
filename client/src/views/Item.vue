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
