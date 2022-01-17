<template lang="">
    <div id="item" v-if="item">
        <h1 id="item-heading">{{item.itemName}}</h1>
        <div id="item-image"><img :src="'http://localhost:8080/api/img/' + item.image" alt="couldn't load image" width="200" height="200"></div>
        <p id="item-attributes"><b>Id: </b>{{item.itemID}}<br>
                <b>Name: </b>{{item.itemName}}<br>
                <b>Description: </b>{{item.description}}<br>
                <b>Amount: </b>{{item.amount}}<br>
                <router-link :to="'/location/' + item.locationID" class="link"><b>Location: </b>{{item.locationID}}</router-link></p>
    </div>
    <navbarBottom />
</template>
<script>
import axios from 'axios'
import NavbarBottom from '../components/NavbarBottom.vue'

export default {
    components: {
        NavbarBottom,
    },
    data() {
        return {
            item: null,
        }
    },
    mounted() {
        axios.get(`http://localhost:8080/api/items/${this.$route.params.id}`).then((response) => {this.item = response.data[0];}); 
    },
}
</script>
<style scoped>
    #item {
        padding-top: 40px;
        padding-left: 20px;
        float: left;
        width: 50%;
    }

    #location {
            position: absolute;
        left: 400px;
    }
</style>