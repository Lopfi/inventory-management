<template lang="">
    <div class="camera">
        <StreamBarcodeReader 
            @decode="onDecode" 
            @loaded="onLoaded"
        ></StreamBarcodeReader>
    </div>
</template>
<script>
import { StreamBarcodeReader } from "vue-barcode-reader";

export default {
    components: {
        StreamBarcodeReader
    },
    methods: {
        onDecode (result) {
        console.log(result)
    }
}
}
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