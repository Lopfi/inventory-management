$(document).ready(function(){
    $("select.type").change(function(){
        var selectedType = $(this).children("option:selected").val();
        $("#form").attr("action", "/add" + selectedType);
        if (selectedType = "Location") $("#location").attr("disabled", true);
        else $("input").removeAttr("disabled");
        
    });
});

function add() {
    let data = $('#form').serialize();
    console.log(data);
}
