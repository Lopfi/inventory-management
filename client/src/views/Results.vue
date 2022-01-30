<template>
    <q-layout class="results" v-if="results">
        <p id="result-count">found {{ results.length }} {{ kind }}</p>
        <div class="q-pa-md row items-start q-gutter-md">
            <q-card
                class="result"
                v-for="result in results"
                :key="result.id"
                @click="this.$router.push(`/${kind}/${result.itemID || result.locationID}`)"
            >
                <img :src="'/api/img/' + result.image" style="height: 140px; max-width: 150px" />

                <q-card-section>
                    <div class="text-h6">{{ result.itemName || result.locationName }}</div>
                    <div class="text-subtitle2">ID: {{ result.itemID || result.locationID }}</div>
                </q-card-section>
            </q-card>
        </div>
        <q-btn-group class="buttons">
            <q-btn
                v-if="kind === 'locations'"
                label="Generate Labels"
                color="grey-9"
                :href="`/api/locations/labels?limit=${this.limit}&offset=${this.offset}`"
            />
            <q-btn
                color="grey-9"
                label="Load more"
                @click="
                    limit += 10;
                    getResults(this.kind);
                "
            />
        </q-btn-group>
        <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-btn fab icon="add" color="grey-9" @click="this.$router.push(`/add/${kind}`)" />
        </q-page-sticky>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="qr_code_scanner" color="grey-9" @click="this.$router.push(`/scan`)" />
        </q-page-sticky>
    </q-layout>
</template>
<script>
import axios from 'axios';

export default {
    components: {},
    data() {
        return {
            kind: null,
            limit: 100,
            offset: 0,
            results: null,
        };
    },
    watch: {
        $route(val) {
            this.kind = val.params.kind;
            this.getResults();
        },
    },
    mounted() {
        this.kind = this.$route.params.kind;
        this.getResults();
    },

    methods: {
        getResults() {
            if (this.kind) {
                axios.get(`/api/${this.kind}?limit=${this.limit}&offset=${this.offset}`).then((response) => (this.results = response.data));
            }
        },
    },
};
</script>
<style>
.results {
    padding-top: 20px;
    padding-left: 20px;
}
#result-count {
    color: #808080;
}

.result :hover {
    cursor: pointer;
}

.buttons {
    margin: 20px;
    margin-left: 100px;
}
</style>
