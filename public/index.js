$("#home-btn").addClass("active");
$("#add-menu, #item, .navbar-bottom, .popup").hide();

$("#type").change(function(){
    let selectedType = $(this).children("option:selected").val();
    $("#add-form").attr("action", "/add" + selectedType);
    $("#name").attr("name", selectedType + "Name")
    if (selectedType == "location") $(".location-field").hide();
    else $(".location-field").show();
});

$("#add-form").submit(function(evt) {
    evt.preventDefault();
    $.ajax({
        url: $("#add-form").attr('action'),
        type: "PUT",
        data: $("#add-form").serialize(),
        success: function (result) {
            console.log(result);
            $("#add-res").innerText = result;
        }
    });
    return false; // To avoid actual submission of the form
});


$("#items-btn").click(function (){
    if ($(this).hasClass("active")) {
        $("#item, #add-menu, .navbar-bottom").hide();
        $("#results").show();
        return false;
    }
    else {
        $("#results").show();
        $("#add-menu").hide();
        $.ajax({
            url: "/itemlist?limit=10&offset=0",
            success: function (result) {
                let items = JSON.parse(result);
                console.log(result);
                $(".active").removeClass("active");
                $("#items-btn").addClass("active");
                $("#result-count").html(`found ${items.length} items`);
                $("#result-list").empty();
                $.each(items, function (i, item) {
                    $("#result-list").append(`
                    <li id="${item.itemID}" onclick="showItem(${item.itemID})">
                        <img id="item-image" src="${item.image}">
                        <span id="item-name">${item.itemName}<br></span>
                        <span id="item-location">${item.locationName}</span>
                    </li>
                `);
                });
            }
        });
        return false;//Returning false prevents the event from continuing up the chain
    }
});

$("#locations-btn").click(function (){
    if ($(this).hasClass("active")) {
        $("#location, #add-menu, .navbar-bottom").hide();
        $("#results").show();
        return false;
    }
    else {
        $("#results").show();
        $("#add-menu, .navbar-bottom").hide();
        $.ajax({
            url: "/locationlist?limit=10&offset=0",
            success: function (result) {
                let locations = JSON.parse(result);
                console.log(result);
                $(".active").removeClass("active");
                $("#locations-btn").addClass("active");
                $("#result-count").html(`found ${locations.length} locations`);
                $("#result-list").empty();
                $.each(locations, function (i, location) {
                    $("#result-list").append(`
                    <li class="location" onclick="showLocation(${location.locationID})">
                    ${location.locationName}<br>
                    ID: ${location.locationID}<br>
                    Items: ${location.amount}
                    </li>`);
                });
            }
        });
        return false;//Returning false prevents the event from continuing up the chain
    }
});

$("#add-btn").click(function (){
    if ($(this).hasClass("active")) return false;
    else {
        $(".active").removeClass("active");
        $(this).addClass("active");
        $(".results").hide();
        $("#add-menu").show();
    }
});

$("#delete-btn").click(function (){
    $("#sure").show();
    $(".popup-no").click(function () {
        $("#sure").hide();
        return false;
    });
    $(".popup-yes").click(function () {
        $.ajax({
            url: "/delitem",
            type: "DELETE",
            dataType: text,
            success: function (result) {
                console.log(result);
            }
        });
        return false;
    });
});

function showItem(itemID) {
    $.ajax({
        url: "/itemdata?itemID=" + itemID,
        success: function(result) {
            let item = JSON.parse(result);
            console.log(item);
            $("#results").hide();
            $("#item, .navbar-bottom").show();
            $("#item-heading").html(`${item.itemName}`);
            $("#item-image").html(`<img src="../public/img/${item.image}" alt="couldn't load image">`);
            $("#item-attributes").html(`
                Id: ${item.itemID}<br>
                Name: ${item.itemName}<br>
                Description: ${item.description}<br>
                Amount: ${item.count}<br>
                Location: ${item.locationID}`);
        }
    });

}

function showLocation(locationID) {
    $.ajax({
        url: "/locationdata?locationID=" + locationID,
        success: function(result) {
            let location = JSON.parse(result);
            $("#thing-heading").html(`${location.locationName}`);
            $("#thing-image").html(`<img src="../public/img/${item.image}" alt="couldn't load image">`);
            $("#thing-attributes").html(`Id: ${location.locationID}<br>Name: ${location.name}<br>Description: ${location.description}`);
        }
    });
}
