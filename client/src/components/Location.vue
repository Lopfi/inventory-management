<template lang="">
    <div>
        <img :src="'/api/img/' + location.image" alt="couldn't load image" width="100" height="100" />
        <span id="name">{{ location.locationName }}<br /></span>
        ID: {{ location.locationID }}<br />
        Items: {{ location.amount }}
    </div>
</template>
<script>
export default {
    props: {
        location: {
            type: Object,
            required: true,
        },
    },
};
</script>
<style lang=""></style>
