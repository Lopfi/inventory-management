$(document).ready(function(){
    $("select.type").change(function(){
        var selectedType = $(this).children("option:selected").val();
        $("#form").attr("action", "/del" + selectedType);
    });
});