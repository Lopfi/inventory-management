<template lang="">
  <q-btn-group class="fixed-bottom q-ma-md" spread>
    <q-btn
      color="grey-9"
      label="Back"
      icon="arrow_back"
      @click="this.$router.go(-1)"
    />
    <q-btn color="grey-9" label="Delete" icon="delete" @click="this.delete()" />
    <q-btn color="grey-9" label="Edit" icon="edit" @click="edit()" />
  </q-btn-group>
</template>
<script>
import axios from "axios";

export default {
  props: {},
  methods: {
    delete() {
      axios
        .delete(
          `/api/${this.$route.name.toLowerCase()}s/${this.$route.params.id}`
        )
        .then((response) => {
          alert(response.data.message);
          this.$router.go(-1);
        });
    },
    edit() {},
  },
};
</script>
<style></style>
