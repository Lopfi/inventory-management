<template lang="">
    <div class="camera">
        <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
        <q-btn color="grey-9" position="fixed-center" @click="this.$router.push(this.decoded)">Open Scanned Code</q-btn>
    </div>
</template>
<script>
import { StreamBarcodeReader } from 'vue-barcode-reader';

export default {
    components: {
        StreamBarcodeReader,
    },
    data() {
        return {
            kind: null,
            decoded: "",
        };
    },
    methods: {
        onDecode(result) {
            console.log(result);
            this.decoded = result;
        },
        onLoaded() {
            console.log('load');
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
