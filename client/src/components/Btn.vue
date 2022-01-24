<template lang="">
    <div>
        <component class="button" :is="url ? 'a' : 'span'" :href="this.url || ''" target="_blank">{{
            label
        }}</component>
    </div>
</template>
<script>
export default {
    props: {
        label: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: false,
        },
    },
};
</script>
<style scoped>
.button {
    margin: 5px;
    border: 0px;
    padding: 14px 16px;
    float: right;
    color: white;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    right: 0;
    top: 0;
    background-color: #2f2f2f;
}

.button:hover:not(.active) {
    background-color: #111;
}
</style>
