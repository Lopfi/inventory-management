//id, name, description, location, image

function showItem(id) {
    $.ajax({
        url: '/itemdata?id=' + id,
        success: function(result) {
            item = JSON.parse(result);
            console.log(item);
            $('#item-heading').html(`${item.name}`);
            $('#item-image').html(`<img src="../public/img/${item.image}" alt="couldnt load image">`);
            $('#item-attributes').html(`Id: ${item.item_id}<br>Name: ${item.name}<br>Description: ${item.description}<br>Location: ${item.location_id}`);
        }
    });
}

function showLocation(id) {    
    $.ajax({
        url: '/locationdata?id=' + id,
        success: function(result) {
            location = JSON.parse(result);
            $('#thing-heading').html(`${location.name}`);
            $('#thing-image').html(`<img src="../public/img/${item.image}" alt="couldnt load image">`);
            $('#thing-attributes').html(`Id: ${location.location_id}<br>Name: ${location.name}<br>Description: ${location.description}`);
        }
    });
}

$('#locations-btn').on('click', function(evt) {
    $.ajax({
        url: '/locations?limit=10&offset=0',
        success: function(result){
            locations = JSON.parse(result);
            console.log(result);
            $('.heading').html(`Locations`);
            $('#resultcount').html(`found ${locations.length} locations`);
            $.each(locations, function (i, location) {
                $('#items').append(`<li class="location" onclick="showLocation(${location.location_id})">${location.name}
                <br>${location.location_id}</li>`);
            });
         }
    });
    return false;//Returning false prevents the event from continuing up the chain
});

$('#items-btn').on('click', function(evt) {
    $.ajax({
        url: '/items?limit=10&offset=0',
        success: function(result){
            items = JSON.parse(result);
            console.log(result);
            $('.heading').html(`Items`);
            $('#resultcount').html(`found ${items.length} items`);
            $.each(items, function (i, item) {
                $('#items').append(`<li class="item" id=${item.item_id}" onclick="showItem(${item.item_id})">${item.name}
                <br>${item.location_id}</li>`);
            });
         }
    });
    return false;//Returning false prevents the event from continuing up the chain
});