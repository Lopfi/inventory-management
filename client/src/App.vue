<template>
<div>
  <navbar></navbar>
  <router-view/>
</div>
</template>

<script>
  import Navbar from "./components/Navbar.vue"

  export default {
    components: {
      Navbar,
    },
  };
</script>

<style>
* {margin: 0; padding: 0; font-family: Sans-serif;}

body{
    background: white;
}

.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 18px;
    display: inline;
    list-style-type: none;
    margin: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow: hidden;
    background-color: #2f2f2f;
    margin-bottom: 10px;
}

.navbar input[type=text] {
  float: right;
  padding: 2.5px;
  border: none;
  margin-top: 0px;
  margin-right: 16px;
}

.navbar-element {
    padding: 0px;
    margin: 0px;
    border: 0px;
    float: left;
}

.navbar-element .link {
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    cursor: pointer;
}

.navbar-element .link:hover:not(.active) {
    background-color: #111;
}

.dropdown {
    margin-top: 10px;
    min-width: 5rem;
    display: none;
    list-style-type: none;
    position: fixed;
}

.navbar-element:hover > .dropdown,
.navbar-element:focus-within > .dropdown,
.dropdown:hover,
.dropdown:focus {
    display: block;
}

.dropdown-element {
    padding-top: 20px;
    padding-bottom: 20px;
    background: #2f2f2f;
}

.dropdown-element:hover {
    background-color: #111;
}

.active {
    background-color: #4CAF50;
}

</style>
