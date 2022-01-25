function fec(t) {
    // Prompt de edicion de fecha
    dialogs.prompt("Ingresa la Fecha: ", texto => {
        if (texto != "" && texto != null) {
            $(t).html("Fecha: " + "<span style='font-size: 28px'>"+texto+"</span>");
        }
    })
}

function zon(t) {
    // Prompt de edicion de zona
    dialogs.prompt("Ingresa la zona: ", texto => {
        if (texto != "" && texto != null) {
            $(t).html("Zona: " + texto);
        }
    })
}

function subzon(t) {
    // Pormpt de edicion de subzona
    dialogs.prompt("Ingresa la subzona: ", texto => {
        if (texto != "" && texto != null) {
            $(t).html("Subzona: " + texto);
        }
    })
}