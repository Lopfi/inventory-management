//id, name, description, location, image

$.ajax({
    url: '/items?limit=10&offset=0',
    success: function(result){
        items = JSON.parse(result);
        console.log(result);
        $('#resultcount').html(`found ${items.length} results`);
        $.each(items, function (i, item) {
            $('#items').append(`<li class="item" id=${item.itemid}" onclick="showItem(${item.itemid})">${item.name}
            <br>${item.locationid}</li>`);
        });
     }
});

function showItem(id) {
    $.ajax({
        url: '/itemdata?id=' + id,
        success: function(result) {
            item = JSON.parse(result);
            $('#item-heading').html(`${item.name}`);
            $('#item-image').html(`<img src="../public/img/${item.image}" alt="couldnt load image">`);
            $('#item-attributes').html(`Id: ${item.itemid}<br>Name: ${item.name}<br>Description: ${item.description}<br>Location: ${item.locationid}`);
        }
    });
}