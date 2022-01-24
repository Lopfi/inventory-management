<template lang="">
    <div class="camera">
        <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
    </div>
    <btn v-if="decoded != null" :label="'test'" @click="getResults(this.kind)" />
</template>
<script>
import { StreamBarcodeReader } from 'vue-barcode-reader';
import Btn from '../components/Btn.vue';

export default {
    components: {
        StreamBarcodeReader,
        Btn,
    },
    data() {
        return {
            kind: null,
            decoded: null,
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

btn {
    position: relative;
}
</style>
