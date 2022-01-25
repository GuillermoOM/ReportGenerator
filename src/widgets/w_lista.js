function borra_it(t) {
    // Borrar item de lista
    $(t).siblings("#container").children().children().last().remove();
    $(t).siblings("#container").children().children().last().remove();
    $(t).parent().css({ "height": $(t).siblings("#container").height() + 40 });
}

function nuevo_it(t) {
    // Crear item de lista
    dialogs.prompt("Ingresa el texto a agregar", texto => {
        var li = document.createElement("li");
        $(li).attr("onmousedown", "cambiol(this)");
        // Ver si hay mas de un item para crear linea
        if ($(t).siblings("#container").children("ul").children().length > 0) {
            $(t).siblings("#container").children("ul").append("<hr>");
            $(li).html(texto);
        } else {
            $(li).html(texto);
        }
        $(t).siblings("#container").children("ul").append(li);
        $(t).parent().css({ "height": $(t).siblings("#container").height() + 40 });
    })
}

function cambiol(t) {
    // Edicion de item de lista
    dialogs.prompt("Ingresa el texto de la tupla: ", $(t).html(), texto => {
        if (texto != "" && texto != null) {
            t.innerHTML = texto;
        }
    })
}