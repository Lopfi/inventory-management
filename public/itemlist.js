//id, name, description, location, image

$.ajax({
    url: '/items?limit=10&offset=0',
    success: function(result){
        items = JSON.parse(result);
        console.log(result);
        $('#results').html(`found ${items.length} results`);
        $.each(items, function (i, item) {
            $('#items').append(`<li class="item" id=${item.itemid}" onclick="showItem(${item.itemid})">${item.name}
            <br>${item.locationid}</li>`);
        });
     }
});

function showItem(id) {
    window.location.replace("/item");
    $.ajax({
        url: '/itemdata?id=' + id,
        success: function (result) {
            item = JSON.parse(result);
            $('#title').html(`<title>${item.name}</title>`)
        }
    });
}