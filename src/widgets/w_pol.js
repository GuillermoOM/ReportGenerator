function tam(t) {
    // Prompt para ingresar datos
    dialogs.prompt("Ingresa el tamaño del poligono: ", texto => {
        if (texto != "" && texto != null) {
            $(t).html(texto + " ha");
        }
    })
}

function coo(t) {
    // Prompt para ingresar datos
    dialogs.prompt("Ingresa las coordenadas: ", texto => {
        if (texto != "" && texto != null) {
            $(t).html("Coordenadas: " + texto);
        }
    })
}