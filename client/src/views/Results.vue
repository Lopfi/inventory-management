<template>
  <q-layout class="q-ma-sm" v-if="results">
    <p id="result-count">found {{ results.length }} {{ kind }}</p>

    <q-infinite-scroll
      @load="onLoad"
      :offset="250"
      class="q-pa-md row q-gutter-md"
      style="margin: 0; padding: 0"
    >
      <result
        v-for="(result, index) in results"
        :result="result"
        :kind="kind"
        :key="index"
      />
    </q-infinite-scroll>

    <q-btn-group class="q-ma-md">
      <q-btn
        v-if="kind === 'locations'"
        label="Generate Labels"
        color="grey-9"
        :href="`/api/locations/labels`"
      />
    </q-btn-group>

    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="grey-9"
        @click="this.$router.push(`/add/${kind}`)"
      />
    </q-page-sticky>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="qr_code_scanner"
        color="grey-9"
        @click="this.$router.push(`/scan`)"
      />
    </q-page-sticky>
  </q-layout>
</template>
<script>
import axios from "axios";

import Result from "../components/Result.vue";

export default {
  components: {
    Result,
  },
  data() {
    return {
      kind: null,
      limit: 10,
      offset: 0,
      results: [],
    };
  },
  watch: {
    $route(val) {
      if (this.kind != val.params.kind) {
        this.kind = val.params.kind;
        this.results = [];
        this.offset = 0;
        this.onLoad(0, () => {
          console.log("watch", this.kind, this.results.length, this.offset);
        });
      }
    },
  },
  mounted() {
    this.kind = this.$route.params.kind;
    console.log("mounted", this.kind, this.results.length, this.offset);
  },
  methods: {
    onLoad(index, done) {
      this.kind = this.$route.params.kind;
      console.log("loading", this.kind, this.results.length, this.offset);
      if (this.kind) {
        // && this.results.length == this.offset
        axios
          .get(`/api/${this.kind}?limit=${this.limit}&offset=${this.offset}`)
          .then((response) => {
            this.results = this.results.concat(response.data);
            this.offset += this.limit;
            done();
          });
      }
    },
  },
};
</script>
<style>
#result-count {
  color: #808080;
}
</style>
