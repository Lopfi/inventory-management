$("#home-btn").addClass("active");
$("#add-menu, #item, .navbar-bottom, .popup").hide();

$("#type").change(function(){
    let selectedType = $(this).children("option:selected").val();
    $("#add-form").attr("action", "/add" + selectedType);
    $("#name").attr("name", selectedType + "Name")
    if (selectedType == "location") {
        $(".location-field").hide();
        $(".amount-field").hide();
    }
    else {
        $(".location-field").show();
        $(".amount-field").show();
    }
});

$("#add-form").submit(function(evt) {
    evt.preventDefault();
    $.ajax({
        url: $("#add-form").attr('action'),
        type: "PUT",
        data: $("#add-form").serialize(),
    })
        .done(function (result){
            alert(result.message);
            showAddMenu();
        })
    return false; // To avoid actual submission of the form
});

$("#delete-btn").click(function() {
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
});

function showLocations() {
    $("#results").show();
    $("#add-menu, .navbar-bottom").hide();
    $.ajax({
        url: "/locationlist",
        type: "GET",
        dataType: "json",
        data: {limit: 10, offset:0},
    })
        .done(function(result) {
            console.log(result);
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

function showAddMenu() {
    $(".active").removeClass("active");
    $(this).addClass("active");
    $(".results").hide();
    $("#add-menu").show();
    $("#add-popup").hide();
}

function showItems() {
    console.log("show items");
    $("#item, #add-menu, .navbar-bottom, .popup").hide();
    $("#results").show();
    $.ajax({
        url: "/itemlist",
        type: "GET",
        dataType: "json",
        data: {limit: 10, offset:0},
    })
        .done(function(result) {
            console.log(result);
            $(".active").removeClass("active");
            $("#items-btn").addClass("active");
            $("#result-count").html(`found ${result.length} items`);
            $("#result-list").empty();
            $.each(result, function (i, item) {
                $("#result-list").append(`
                    <li id="${item.itemID}" onclick="showItem(${item.itemID})">
                        <img id="item-image" src="${item.image}">
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
        console.log(result);
        $("#results").hide();
        $("#item, .navbar-bottom").show();
        $("#item-heading").html(`${result.itemName}`);
        $("#item-image").html(`<img src="../public/img/${result.image}" alt="couldn't load image">`);
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
        $("#thing-heading").html(`${result.locationName}`);
        $("#thing-image").html(`<img src="../public/img/${result.image}" alt="couldn't load image">`);
        $("#thing-attributes").html(`Id: ${result.locationID}<br>Name: ${result.name}<br>Description: ${result.description}`);
        })
        .fail(function(result){
            alert(result.message);
        });
}
