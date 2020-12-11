
$('#items-btn').click(function (){
    $.ajax({
        url: '/itemlist?limit=10&offset=0',
        success: function(result){
            let items = JSON.parse(result);
            console.log(result);
            $('.active').removeClass("active");
            $('#items-btn').addClass("active");
            $('#result-count').html(`found ${items.length} items`);
            $.each(items, function (i, item) {
                $('#items').append(`
                    <li class="item" id=${item.itemID}" onclick="showItem(${item.itemID})">
                        <span class="item-name">${item.itemName}<br></span>
                        <span class="item-location">${item.locationName}</span>
                    </li>
                `);
            });
        }
    });
    return false;//Returning false prevents the event from continuing up the chain
});

$('#locations-btn').click(function (){
    $.ajax({
        url: '/locationlist?limit=10&offset=0',
        success: function(result){
            locations = JSON.parse(result);
            console.log(result);
            $('#result-count').html(`found ${locations.length} locations`);
            $.each(locations, function (i, location) {
                $('#items').append(`<li class="location" onclick="showLocation(${location.locationID})">${location.locationName}
                <br>${location.locationID}</li>`);
            });
        }
    });
    return false;//Returning false prevents the event from continuing up the chain
});

function showItem(itemID) {
    $.ajax({
        url: '/itemdata?itemID=' + itemID,
        success: function(result) {
            item = JSON.parse(result);
            console.log(item);
            $('.results').addClass("invisible");
            $('#item-heading').html(`${item.itemName}`);
            $('#item-image').html(`<img src="../public/img/${item.image}" alt="couldnt load image">`);
            $('#item-attributes').html(`Id: ${item.itemID}<br>Name: ${item.itemName}<br>Description: ${item.description}<br>Location: ${item.locationID}`);
        }
    });
}

function showLocation(locationID) {
    $.ajax({
        url: '/locationdata?locationID=' + locationID,
        success: function(result) {
            location = JSON.parse(result);
            $('#thing-heading').html(`${location.locationName}`);
            $('#thing-image').html(`<img src="../public/img/${item.image}" alt="couldnt load image">`);
            $('#thing-attributes').html(`Id: ${location.locationID}<br>Name: ${location.name}<br>Description: ${location.description}`);
        }
    });
}
