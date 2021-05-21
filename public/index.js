$("#home-btn").addClass("active");
$("#add-menu, #item, .navbar-bottom, .popup").hide();

const addForm = $("#add-form");

addForm.submit(function(evt) {
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

function deleteThing() {
    $("#sure").show();
    $("#popup-no").click(function() {
        $("#sure").hide();
        return false;
    });
    $("#popup-yes").click(function() {
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

function showLocations() {
    $("#results").show();
    $("#add-menu, .navbar-bottom, #item, #location").hide();
    $.ajax({
        url: "/locationlist",
        type: "GET",
        dataType: "json",
        data: {limit: 10, offset:0},
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
};

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

function showItems() {
    $("#item, #location, #add-menu, .navbar-bottom, .popup").hide();
    $("#results").show();
    $.ajax({
        url: "/itemlist",
        type: "GET",
        dataType: "json",
        data: {limit: 10, offset:0},
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
        $("#back-btn").attr("onclick", "showItems()");
        $("#item-heading").html(`${result.itemName}`);
        $("#item-image").html(generateImage(result.image));
        $("#item-attributes").html(`
                Id: <span id="item-id">${result.itemID}</span><br>
                Name: ${result.itemName}<br>
                Description: ${result.description}<br>
                Amount: ${result.count}<br>
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
        data: {itemID: locationID},
    })
        .done(function(result) {
        $("#results, #item, #location").hide();
        $("#location, .navbar-bottom").show();
        $("#back-btn").attr("onclick", "showLocations()");
        $("#location-heading").html(`${result.locationName}`);
        $("#location-image").html(generateImage(result.image));
        $("#location-attributes").html(`
            Id: ${result.locationID}<br>
            Name: ${result.name}<br>
            Description: ${result.description}`);
        })
        .fail(function(result){
            alert(result.message);
        });
}

function generateImage(path) {
    return `<img src="./images/${path}" alt="couldn't load image" width="auto" height="100">`;
}
