<template>
<div>
    <div class="results" id="results" v-if="results">
        <p id="result-count">found {{results.length}} {{kind}}</p>
        <ul id="result-list">
            <li v-for="result in results" :key="result.id">
                <item :item="result" v-if="kind === 'items'" @click="this.$router.push(`/item/${result.itemID}`)"/>
                <location :location="result" v-if="kind === 'locations'" @click="this.$router.push(`/location/${result.locationID}`)"/>
            </li>
        </ul>
        <btn v-if="kind === 'locations'" :method="this.method" :label="'Generate Labels'" :url="`http://localhost:8080/api/locations/labels?limit=${this.limit}&offset=${this.offset}`"/>
        <btn :method="this.method" :label="'Load more'" @click="limit+=10; getResults(this.kind)"/>
    </div>
    
</div>
</template>
<script>

import axios from 'axios'
import Item from '../components/Item.vue'
import Location from '../components/Location.vue'
import Btn from '../components/Btn.vue'

export default {
    components: {
        Item,
        Location,
        Btn,
    },
    data() {
        return {
            kind: null,
            limit: 10,
            offset: 0,
            results: null
        }
    },
    watch: {
        $route(val) {
            this. kind = val.params.kind;
            this.getResults();
        }
    },
    mounted() {
            this.kind = this.$route.params.kind;
        this.getResults();
    },

    methods: {
        getResults() {
            axios.get(`http://localhost:8080/api/${this.kind}?limit=${this.limit}&offset=${this.offset}`).then(response => (this.results = response.data)); 
        },
        method() {},
    },
}
</script>
<style>
    .results {
        padding-top: 45px;
        padding-left: 20px;
    }
    #result-count {
        color: #808080;
    }

    #result-list {
        padding-left: 20px;
        list-style-type: none;
        width: 500px;
    }

    #result-list #name {
        font: bold 20px/1.5 Helvetica, Verdana, sans-serif;
    }

    #result-list img {
        float: left;
        margin: 0 15px 0 0;
    }

    #result-list li #item-location {
        font: 200 12px/1.5 Georgia, Times New Roman, serif;
    }

    #result-list li {
        padding: 10px;
        overflow: auto;
    }

    #result-list li:hover {
        background: #d0d0d0;
        cursor: pointer;
    }
</style>