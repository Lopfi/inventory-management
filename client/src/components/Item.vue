<template lang="">
    <div>
        <img :src="'http://localhost:8080/api/img/' + item.image" alt="couldn't load image" width="100" height="100">
        <span id="name">{{item.itemName}}<br></span>
        ID: {{item.itemID}}<br>
        <span id="location">{{item.locationName}}</span>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
}
</script>
<style lang="">
    
</style>