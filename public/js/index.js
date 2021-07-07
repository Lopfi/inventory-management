$("#home-btn").addClass("active");
$("#add-menu, #item, .navbar-bottom, .popup").hide();

const addForm = $("#add-form");

const limit = 100;

let itemOffset = 0;
let locationOffset = 0;

addForm.on("submit", function(evt) {
    evt.preventDefault();

    const files = document.getElementById("images");

    let formData = addForm.serializeArray();
    const data = new FormData();

    for(let i =0; i < formData.length; i++) {
        data.append(formData[i].name, formData[i].value);
    }
    for(let i =0; i < files.files.length; i++) {
        data.append("files", files.files[i]);
    }

    console.log();

    $.ajax({
        url: `http://localhost${addForm.attr("action")}`,
        type: "PUT",
        data: data,
        processData: false,
        contentType: false
    })
        .done(function (result){
            alert(result.message);
            showAddMenu(addForm.attr("action") === "/additem");
        })
    return false; // To avoid actual submission of the form
});

function deleteItem() {
    $("#sure").show();
    $("#popup-no").on("click", function() {
        $("#sure").hide();
        return false;
    });
    $("#popup-yes").on("click", function() {
        $.ajax({
            url: "/delitem",
            type: "DELETE",
            dataType: "json",
            data: {itemID: $("#item-id").text()},
        })
            .done(function(result) {
                alert(result.message);
                showItems();
            })
            .fail(function(result) {
                alert(result.message);
                showItems();
            });
    });
}

function deleteLocation() {
    $("#sure").show();
    $("#popup-no").on("click", function() {
        $("#sure").hide();
        return false;
    });
    $("#popup-yes").on("click", function() {
        $.ajax({
            url: "/dellocation",
            type: "DELETE",
            dataType: "json",
            data: {locationID: $("#location-id").text()},
        })
            .done(function(result) {
                alert(result.message);
                showItems();
            })
            .fail(function(result) {
                alert(result.message);
                showLocations();
            });
    });
}

function showLocations() {
    $("#add-menu, .navbar-bottom, #item, #location").hide();
    $("#results").show();
    $.ajax({
        url: "/locationlist",
        type: "GET",
        dataType: "json",
        data: {limit: limit, offset: 0},
    })
        .done(function(result) {
            $(".active").removeClass("active");
            $("#locations-btn").addClass("active");
            $("#result-count").html(`found ${result.length} locations`);
            $("#result-list").empty();
            $.each(result, function(i, location) {
                $("#result-list").append(`
                    <li class="location" onclick="showLocation(${location.locationID})">
                    ${location.locationName}<br>
                    ID: ${location.locationID}<br>
                    Items: ${location.amount}
                    </li>`);
            })
        })
        .fail(function(result) {
            alert(result.message)
        });
    return false;//Returning false prevents the event from continuing up the chain
}

function showItems() {
    $("#item, #location, #add-menu, .navbar-bottom, .popup").hide();
    $("#results").show();
    $.ajax({
        url: "/itemlist",
        type: "GET",
        dataType: "json",
        data: {limit: limit, offset: 0},
    })
        .done(function(result) {
            $(".active").removeClass("active");
            $("#items-btn").addClass("active");
            $("#result-count").html(`found ${result.length} items`);
            $("#result-list").empty();
            $.each(result, function (i, item) {
                $("#result-list").append(`
                    <li id="${item.itemID}" onclick="showItem(${item.itemID})">
                        ${generateImage(item.image)}
                        <span id="item-name">${item.itemName}<br></span>
                        <span id="item-location">${item.locationName}</span>
                    </li>
                `);
            })
        })
        .fail(function(result){
            alert(result.message);
        });
    return false;//Returning false prevents the event from continuing up the chain
}

function showAddMenu(type) {
    if (type){
        $(".location-field, .amount-field").show();
        addForm.attr("action", "/additem");
        $("#name").attr("name", "itemName")
    }
    else {
        $(".location-field, .amount-field").hide();
        addForm.attr("action", "/addlocation");
        $("#name").attr("name", "locationName")
    }
    $(".active").removeClass("active");
    $("#add-btn").addClass("active");
    $(".results, #item, #location").hide();
    $("#add-menu").show();
    $("#add-popup").hide();
}

function showItem(itemID) {
    $.ajax({
        url: "/itemdata",
        type: "GET",
        dataType: "json",
        data: {itemID: itemID},
    })
        .done(function(result) {
        $("#results").hide();
        $("#item, .navbar-bottom").show();
        $("#delete-btn").attr("onclick", "deleteItem()");
        $("#back-btn").attr("onclick", "showItems()");
        $("#item-heading").html(`${result.itemName}`);
        $("#item-image").html(generateImage(result.image));
        $("#item-attributes").html(`
                Id: <span id="item-id">${result.itemID}</span><br>
                Name: ${result.itemName}<br>
                Description: ${result.description}<br>
                Amount: ${result.amount}<br>
                Location: ${result.locationID}`);
        })
        .fail(function(result){
            alert(result.message);
        });
}

function showLocation(locationID) {
    $.ajax({
        url: "/locationdata",
        type: "GET",
        dataType: "json",
        data: {locationID: locationID},
    })
        .done(function(result) {
        $("#results, #item, #location").hide();
        $("#location, .navbar-bottom").show();
            $("#delete-btn").attr("onclick", "deleteLocation()");
        $("#back-btn").attr("onclick", "showLocations()");
        $("#location-heading").html(`${result.locationName}`);
        $("#location-image").html(generateImage(result.image));
        $("#location-attributes").html(`
            Id: <span id="location-id">${result.locationID}</span><br>
            Name: ${result.locationName}<br>
            Description: ${result.description}`);
        })
        .fail(function(result){
            console.log(result);
            alert(result.message);
        });
}

function editThing() {
    $.ajax({
        url: "/delitem",
        type: "DELETE",
        dataType: "json",
        data: {itemID: $("#item-id").text()},
    })
        .done(function(result) {
            alert(result.message);
            showItems();
        })
        .fail(function(result) {
            alert(result.message);
            showItems();
        });
}

function generateImage(path) {
    return `<img src="./images/${path}" alt="couldn't load image" width="auto" height="100">`;
}
