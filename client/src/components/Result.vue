<template lang="">
  <q-card
    class="cursor-pointer"
    @click="this.$router.push(`/${kind}/${result.itemID || result.locationID}`)"
    style="width: 150px; overflow: hidden"
  >
    <q-img
      :src="'/api/img/' + result.image"
      spinner-color="white"
      style="height: 150px; width: 150px"
    />

    <q-card-section>
      <div class="text-h6">
        {{ result.itemName || result.locationName }}
      </div>
      <div class="text-subtitle2">
        ID: {{ result.itemID || result.locationID }}
      </div>
      <div class="text-subtitle2" v-if="result.itemID">
        {{ result.locationName }}
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  props: {
    result: {
      type: Object,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang=""></style>
