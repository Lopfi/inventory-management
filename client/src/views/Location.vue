<template lang="">
    <div v-if="location">
        <div id="location">
            <h1 id="location-heading">{{location.locationName}}</h1>
            <div id="location-image"><img :src="'http://localhost:8080/api/img/' + location.image" alt="couldn't load image" width="200" height="200"></div>
            <p id="location-attributes">Id: <span id="location-id">{{location.locationID}}</span><br>
                Name: {{location.locationName}}<br>
                Description: {{location.description}}</p>
        </div>
        <div class="results" id="results" v-if="items">
            <p id="result-count">found {{items.length}} items at this location</p>
            <ul id="result-list">
                <li v-for="result in items" :key="result.id">
                    <item :item="result" @click="this.$router.push(`/item/${result.itemID}`)"/>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Item from '../components/Item'

export default {
    components: {
        Item,
    },
    data() {
        return {
            location: null,
            items: null,
        }
    },
    mounted() {
        axios.get(`http://localhost:8080/api/locations/${this.$route.params.id}`).then(response => (this.location = response.data[0])); 
        axios.get(`http://localhost:8080/api/locations/${this.$route.params.id}/items`).then(response => (this.items = response.data)); 
    },
}
</script>
<style scoped>
    #location {
        padding-top: 40px;
        padding-left: 20px;
        float: left;
        width: 50%;
    }

    .results {
        position: absolute;
        left: 400px;
    }
</style>