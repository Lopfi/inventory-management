<template lang="">
  <q-form action="/items">
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
        filled
        type="number"
        v-model="form.location"
        label="Location"
      /><br />
    </div>

    <q-input
      @change="filesChange($event.target.files)"
      type="file"
      multiple
      id="images"
      name="images"
      accept="image/*"
      capture="camera"
    /><br />

    <q-btn
      label="Submit"
      type="submit"
      color="grey-9"
      @click.prevent="submit()"
    />
  </q-form>
  <div class="bottom-float">
    <q-layout>
      <q-btn-group class="navbar-bottom">
        <q-btn
          color="grey-9"
          label="Back"
          icon="arrow_back"
          @click="this.$router.go(-1)"
        />
      </q-btn-group>
    </q-layout>
  </div>
</template>
<script>
import axios from "axios";

export default {
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
    submit() {
      this.formData.append("name", this.form.name);
      this.formData.append("description", this.form.description);
      this.formData.append("amount", this.form.amount);
      this.formData.append("location", this.form.location);
      axios
        .put(`/api/${this.kind}`, this.formData)
        .then((response) => alert(response.data.message));
      this.formData = new FormData();
    },
    filesChange(fileList) {
      const formData = new FormData();
      if (!fileList.length) return;
      for (var i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        formData.append("files", file);
      }
      this.formData = formData;
    },
  },
};
</script>
<style>
#add-menu {
  padding-top: 0px;
}

form {
  max-width: 500px;
  padding: 30px 20px 20px 50px;
}
</style>
