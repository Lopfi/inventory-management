<template lang="">
    <div class="bottom-float">
        <ul class="navbar-bottom">
            <li class="navbar-element"><router-link to="" @click="this.$router.go(-1)" class="link">Back</router-link></li>
            <li class="navbar-element"><router-link to="" @click="this.delete()" class="link">Delete</router-link></li>
            <li class="navbar-element"><router-link to="" @click="edit()" class="link">Edit</router-link></li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    props: {
        edit: {
            type: Function,
            required: true,
        },
    },
    methods: {
        delete() {
            axios.delete(`http://localhost:3000/api/${this.$route.name.toLowerCase()}s/${this.$route.params.id}`).then((response) => {
                alert(response.data.message);
                this.$router.go(-1);
            });
        },
    },
};
</script>
<style>
.navbar-bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    display: inline;
    list-style-type: none;
    margin: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow: hidden;
    background-color: #2f2f2f;
}
</style>
