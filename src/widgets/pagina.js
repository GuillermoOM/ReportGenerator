function load_map(input) {
    // Funcion de carga de imagen de mapa
    if (input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(input).siblings('img')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        
        var b = $(input).siblings("button");
        var i = $(input).siblings("img");
        $(b).css({ display: "none" });
        $(i).css({ display: "block" });
    }
}

function foc(t) {
    // Funcion para hacer focus a la pagina (pagina activa donde se agregan los widgets)
    var f = $(t).parent().parent().find(".pagina");
    $(f).attr({ "id": "unfocused" });
    $(t).attr({ "id": "focused" });
}