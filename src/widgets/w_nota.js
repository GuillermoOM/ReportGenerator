function nota(t) {
    // Ventana de notas
    $(t).parent().css({ 'z-index': '10' });
    $(t).siblings("#entrada_n").css({ "display": "flex" });
    $(t).siblings("#entrada_n").find("#box_nota")[0].value = $(t).html();
    $(t).siblings("#entrada_n").find("#lista_notas").children().remove();
    $(t).siblings("#entrada_n").find("#text_prev").html("");
    $(t).siblings("#entrada_n").find("#img_prev").attr('src', "#");
}

function busca_n(t) {
    // Busueda de nota en plataforma
    var id_estudio = $(t).siblings("#study_id")[0].value;
    $(t).siblings("#lista_notas").children().remove();
    get_auth(function (key) {
        apikey = key;
        $.ajax({
            url: "https://server.agropro.mx/api/v1/notes?studyid=" + id_estudio,
            type: "GET",
            headers: {
                "authorization": apikey
            },
            contentType: "application/json",
            success: function (result) {
                for (const nota in result) {
                    var option = document.createElement("option");
                    option.value = result[nota].id;
                    option.text = result[nota].name;
                    $(t).siblings("#lista_notas")[0].add(option);
                }
                carga_nota($(t).siblings("#lista_notas"));
            }
        });
    });
}

function carga_nota(t) {
    // Carga de nota a previews al seleccionar en menu de opciones
    var id_nota = $(t)[0].value;
    var id_estudio = $(t).siblings("#study_id")[0].value;
    $.ajax({
        url: "https://server.agropro.mx/api/v1/notes?studyid=" + id_estudio,
        type: "GET",
        headers: {
            "authorization": apikey
        },
        contentType: "application/json",
        success: function (result) {
            for (const nota in result) {
                if (result[nota].id == id_nota) {
                    $(t).siblings("#nota_result").find("#nom").html(result[nota].name);
                    $(t).siblings("#nota_result").find("#text_prev").html(result[nota].content);
                    var fecha = new Date(result[nota].createdAt);
                    $(t).siblings("#nota_result").find("#fecha_prev").html(fecha.toLocaleDateString());
                    $(t).siblings("#nota_result").find("#img_prev").attr('src', result[nota].imageUrl);
                }
            }
        },
        error: function () {
            dialogs.alert("Intentelo de nuevo!");
            apikey = null;
        }
    });
}

function aceptar_n(t) {
    // Aceptar y agregar nota a widget
    var nombre = $(t).siblings("#nota_result").find("#nom").html();
    var desc = $(t).siblings("#nota_result").find("#text_prev").html();
    var fecha = $(t).siblings("#nota_result").find("#fecha_prev").html();
    var imagen = $(t).siblings("#nota_result").find("#img_prev").attr('src');
    $(t).parent().parent().siblings("#title").html(nombre);
    $(t).parent().parent().siblings("#container").find("#descr").html(desc);
    $(t).parent().parent().siblings("#container").find("#fecha").html("Fecha: " + fecha);
    $(t).parent().parent().siblings("#container").find("#img_nota").attr('src', imagen);
    $(t).parent().parent().css({ "display": "none" });
    $(t).parent().parent().parent().css({ 'z-index': '1' });
}

function cancelar_n(t) {
    // Cancelar y cerrar ventana
    $(t).parent().parent().css({ "display": "none" });
    $(t).parent().css({ 'z-index': '1' });
}