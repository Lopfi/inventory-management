<template lang="">
    <div class="bottom-float">
        <ul class="navbar-bottom">
            <li class="navbar-element"><router-link to="" @click="this.$router.go(1)" class="link">Back</router-link></li>
            <li class="navbar-element"><router-link to="" class="link">Delete</router-link></li>
            <li class="navbar-element"><router-link to="" class="link">Edit</router-link></li>
        </ul>
    </div>
</template>
<script>
export default {
        props: {
        delete: {
            type: Function,
            required: true,
        },
        edit: {
            type: Function,
            required: true,
        },
    },
}
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