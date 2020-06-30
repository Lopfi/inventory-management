$(document).ready(() => {
    console.log("hi")
    $.ajax({
        url: '/itemdata?id=' + id,
        success: function (result) {
            item = JSON.parse(result);
            $('#title').html(`<title>${item.name}</title>`)
        }
    });
});