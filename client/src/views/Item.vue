<template lang="">
    <div id="item" v-if="item">
        <h1 id="item-heading">{{ item.itemName }}</h1>
        <div id="item-image"><img :src="'/api/img/' + item.image" alt="couldn't load image" width="200" height="200" /></div>
        <p id="item-attributes">
            Id: <span id="item-id">{{ item.itemID }}</span
            ><br />
            Name: {{ item.itemName }}<br />
            Description: {{ item.description }}<br />
            Amount: {{ item.amount }}<br />
            <router-link :to="'/location/' + item.locationID" class="link">Location: {{ item.locationID }}</router-link>
        </p>
    </div>
    <navbarBottom />
</template>
<script>
import axios from 'axios';
import NavbarBottom from '../components/NavbarBottom.vue';

export default {
    components: {
        NavbarBottom,
    },
    data() {
        return {
            item: null,
        };
    },
    mounted() {
        axios.get(`/api/items/${this.$route.params.id}`).then((response) => {
            this.item = response.data[0];
        });
    },
};
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
