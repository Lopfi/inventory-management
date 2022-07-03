<template lang="">
  <div class="fixed-center" style="min-width: 300px">
    <q-form action="/items" @submit="onSubmit">
      <q-input
        filled
        v-model="form.name"
        label="Name"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input filled v-model="form.description" label="Description" /><br />

      <div>
        <q-input
          v-if="kind !== 'locations'"
          filled
          type="number"
          v-model="form.amount"
          label="Amount"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Please specify an amount',
            (val) => val > 0 || 'Please type a real amount',
          ]"
        />

        <q-input
          v-if="kind !== 'locations'"
          filled
          type="number"
          v-model="form.location"
          label="Location"
        /><br />
      </div>

      <q-file
        @rejected="onRejected"
        v-model="image"
        type="file"
        label="Image"
        accept=".jpg, image/*"
        capture="camera"
      /><br />

      <q-btn-group spread>
        <q-btn label="Submit" type="submit" color="grey-9" />
      </q-btn-group>
    </q-form>
    <q-btn-group class="q-mt-md" spread>
      <q-btn
        color="grey-9"
        label="Back"
        icon="arrow_back"
        @click="this.$router.go(-1)"
      />
    </q-btn-group>
  </div>
</template>
<script>
import axios from "axios";
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();

    return {
      onRejected(rejectedEntries) {
        $q.notify({
          type: "negative",
          message: `${rejectedEntries.length} file did not pass validation constraints`,
        });
      },
      notify(message) {
        $q.notify({
          type: "positive",
          message,
        });
      },
    };
  },
  components: {},
  data() {
    return {
      kind: null,
      form: {
        name: "",
        description: "",
        amount: 1,
        location: "1",
      },
      image: null,
      formData: new FormData(),
    };
  },
  watch: {
    $route(val) {
      this.kind = val.params.kind;
    },
  },
  mounted() {
    this.kind = this.$route.params.kind;
  },

  methods: {
    onSubmit() {
      this.formData = new FormData();
      this.formData.append("files", this.image);
      this.formData.append("name", this.form.name);
      this.formData.append("description", this.form.description);
      this.formData.append("amount", this.form.amount);
      this.formData.append("location", this.form.location);
      axios.put(`/api/${this.kind}`, this.formData).then((response) => {
        this.notify(response.data.message);
        this.$router.go(-1);
      });
    },
  },
};
</script>
<style></style>
