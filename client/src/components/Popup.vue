<template lang="">
    <div class="popup" id="sure">
        <span class="helper"></span>
        <div>
            <p>Are you sure?</p>
            <button class="popup-button" id="popup-yes">Yes</button>
            <button class="popup-button" id="popup-no" >No</button>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style>
.popup{
    background:rgba(0,0,0,.4);
    cursor:pointer;
    height:100%;
    position:fixed;
    text-align:center;
    top:0;
    width:100%;
    z-index:10000;
}

.popup .helper{
    display:inline-block;
    height:100%;
    vertical-align:middle;
}

.popup > div {
    background-color: #fff;
    box-shadow: 10px 10px 60px #555;
    display: inline-block;
    height: auto;
    max-width: 120px;
    min-height: 60px;
    vertical-align: middle;
    width: 60%;
    position: relative;
    border-radius: 8px;
    padding: 15px 5%;
}

.popup-button {
    color: white;
    text-align: center;
    padding: 8px 10px;
    margin: 5px;
    text-decoration: none;
    border: 0;
    background: #2f2f2f;
}
.popup-button:hover {
    background-color: #111;
}

</style>