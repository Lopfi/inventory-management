<template lang="">
    <div>
        <div id="add-menu" class="form">
            <div class="form-heading">Fill out and submit to add something to the database</div>
            <form action="/items" id="add-form" class="form">
                <label for="name"><span class="required">Name </span></label><br />
                <input v-model="form.name" type="text" id="name" name="itemName" /><br />
                <label for="description"><span>Description </span></label><br />
                <input v-model="form.description" type="text" id="description" name="description" /><br />
                <label v-if="kind === 'item'" for="amount" class="amount-field"><span>Amount</span></label><br />
                <input v-model="form.amount" v-if="kind === 'item'" type="number" class="amount-field" id="amount" name="amount" /><br />
                <label v-if="kind === 'item'" for="locationid" class="location-field"><span>Location</span></label><br />
                <input v-model="form.location" v-if="kind === 'item'" type="text" class="location-field" id="locationid" name="locationID" /><br />
                <label for="Images"><span>Images</span></label><br />
                 <v-file-input label="File input" outlined dense capture="user" accept="image/*"></v-file-input>
                <input @change="filesChange($event.target.files)" type="file" multiple id="images" name="images" /><br /><br />
                <input type="submit" value="Add" @click.prevent="submit()" />
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    components: {},
    data() {
        return {
            kind: null,
            form: {
                name: '',
                description: '',
                amount: 1,
                location: '1',
            },
            formData: new FormData(),
        };
    },
    watch: {
        $route(val) {
            this.getResults(val.params.kind);
        },
    },
    mounted() {
        this.getResults(this.$route.params.kind);
    },

    methods: {
        getResults(kind) {
            this.kind = kind;
            //axios.get(`/api/${kind}?limit=${this.limit}&offset=${this.offset}`).then(response => (this.results = response.data));
        },
        submit() {
            this.formData.append('name', this.form.name);
            this.formData.append('description', this.form.description);
            this.formData.append('amount', this.form.amount);
            this.formData.append('location', this.form.location);
            axios.put(`/api/${this.kind}s`, this.formData).then((response) => alert(response.data.message));
            this.formData = new FormData();
        },
        filesChange(fileList) {
            const formData = new FormData();
            if (!fileList.length) return;
            for (var i = 0; i < fileList.length; i++) {
                let file = fileList[i];
                formData.append('files', file);
            }
            this.formData = formData;
        },
    },
};
</script>
<style>
#add-menu {
    padding-top: 0px;
}

form {
    max-width: 500px;
    padding: 30px 20px 20px 50px;
}
.form-heading {
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 15px;
    padding-bottom: 3px;
}
form label {
    display: block;
    margin: 0px 0px 15px 0px;
}
form label > span {
    width: 100px;
    font-weight: bold;
    float: left;
    padding-top: 8px;
    padding-right: 5px;
}

form input.input-field,
form .select-field {
    width: 48%;
}

form input {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    border: 1px solid #c2c2c2;
    box-shadow: 1px 1px 4px #ebebeb;
    -moz-box-shadow: 1px 1px 4px #ebebeb;
    -webkit-box-shadow: 1px 1px 4px #ebebeb;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    padding: 7px;
    outline: none;
}
form .input-field:focus,
form .tel-number-field:focus,
form .textarea-field:focus,
form .select-field:focus {
    border: 1px solid #0c0;
}
form .textarea-field {
    height: 100px;
    width: 55%;
}
form input[type='submit'],
form input[type='button'] {
    border: none;
    padding: 8px 15px 8px 15px;
    background: #2f2f2f;
    color: #fff;
    box-shadow: 1px 1px 4px #dadada;
    -moz-box-shadow: 1px 1px 4px #dadada;
    -webkit-box-shadow: 1px 1px 4px #dadada;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
}
form input[type='submit']:hover,
form input[type='button']:hover {
    background: #4caf50;
    color: #fff;
}
</style>
