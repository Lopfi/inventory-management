<template lang="">
  <div class="camera">
    <StreamBarcodeReader @decode="onDecode"></StreamBarcodeReader>
  </div>
</template>
<script>
import { StreamBarcodeReader } from "vue-barcode-reader";

export default {
  components: {
    StreamBarcodeReader,
  },
  data() {
    return {};
  },
  methods: {
    onDecode(result) {
      this.$router.push(result);
    },
  },
};
</script>
<style>
.camera {
  /* Center vertically and horizontally */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
