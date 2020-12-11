$(document).ready(function(){
    $(".type").change(function(){
        var selectedType = $(this).children("option:selected").val();
        $("#form").attr("action", "/add" + selectedType);
        if (selectedType = "location") $("#location").attr("disabled", true);
        else $("input").removeAttr("disabled");
    });
});