<template lang="">
    <div class="bottom-float">
        <q-layout>
            <q-btn-group class="navbar-bottom">
                <q-btn color="grey-9" label="Back" icon="arrow_back" @click="this.$router.go(-1)" />
                <q-btn color="grey-9" label="Delete" icon="delete" @click="this.delete()" />
                <q-btn color="grey-9" label="Edit" icon="edit" @click="edit()" />
            </q-btn-group>
        </q-layout>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    props: {},
    methods: {
        delete() {
            axios.delete(`/api/${this.$route.name.toLowerCase()}s/${this.$route.params.id}`).then((response) => {
                alert(response.data.message);
                this.$router.go(-1);
            });
        },
        edit() {},
    },
};
</script>
<style>
.navbar-bottom {
    margin-left: 10%;
}
</style>
