function setPage(page) {
    $(".site-page").each(function(i,e) {
        let x = $(e);
        x.removeClass("show");
    });
    $("#" + page).addClass("show");

    $(".navbar-button").each(function(i,e) {
        let x = $(e);
        x.removeClass("active-navbar-button");
    });

    $("#" + page + "-button").addClass("active-navbar-button");
}

$(document).ready(() => {
    setPage("items-page");
});

function scan() {
    ret
}