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
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();

    return {
      notify(message) {
        $q.notify({
          type: "positive",
          message,
        });
      },
      delete() {
        $q.dialog({
          title: "Delete",
          message: `Are you sure you want to delete this ${this.$route.name.toLowerCase()}?`,
          cancel: true,
          persistent: true,
        })
          .onOk(() => {
            axios
              .delete(
                `/api/${this.$route.name.toLowerCase()}s/${
                  this.$route.params.id
                }`
              )
              .then((response) => {
                $q.notify({
                  type: "positive",
                  message: response.data.message,
                });
                this.$router.go(-1);
              });
          })
          .onCancel(() => {});
      },
    };
  },
  props: {
    edit: {
      type: Function,
      required: true,
    },
  },
};
</script>
<style></style>
