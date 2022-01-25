function cambio_t(t) {
    // Cambio de color de flecha
    var s = $(t).find("svg");
    if ($(s).attr("direccion") == "green") {
        $($(s).children()[0]).attr("fill", "red");
        $(s).parent().css({ "color": "red" });
        $(s).attr("direccion", "red");
        return null;
    }
    if ($(s).attr("direccion") == "red") {
        $($(s).children()[0]).attr("fill", "green");
        $(s).parent().css({ "color": "green" });
        $(s).attr("direccion", "green");
        return null;
    }
}

function ajuste(t, ini, fin){
    // Ajuste de direccion de flecha segun diferencia de velores
    if (ini > fin) {
        $(t).siblings("#t_block").find("#porc").html(Math.abs((fin * 100) / ini - 100).toFixed(2) + "%");
        $($(t).siblings("#t_block").find("svg").children()[0]).attr("d", "M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z");
        $($(t).siblings("#t_block").find("svg").children()[1]).attr("d", "M0 0h24v24H0z");
        $($(t).siblings("#t_block").find("svg").children()[1]).attr("fill", "none");
    }
    if (ini < fin) {
        $(t).siblings("#t_block").find("#porc").html(((fin * 100) / ini - 100).toFixed(2) + "%");
        $($(t).siblings("#t_block").find("svg").children()[0]).attr("d", "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z");
        $($(t).siblings("#t_block").find("svg").children()[1]).attr("d", "M0 0h24v24H0z");
        $($(t).siblings("#t_block").find("svg").children()[1]).attr("fill", "none");
    }
    if (ini == fin) {
        $(t).siblings("#t_block").find("#porc").html("0.00%");
        $($(t).siblings("#t_block").find("svg").children()[0]).attr("d", "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z");
        $($(t).siblings("#t_block").find("svg").children()[1]).attr("d", "M0 0h24v24H0z");
        $($(t).siblings("#t_block").find("svg").children()[1]).attr("fill", "none");
    }
}

function cambio_l(t) {
    // Ingreso de datos
    dialogs.prompt("Ingresa la longitud inicial: ", ini => {
        if (ini != "" && ini != null) {
            $(t).find("#l_ini").html(ini);
            dialogs.prompt("Ingresa la longitud final: ", fin => {
                if (fin != "" && fin != null) {
                    $(t).find("#l_fin").html(fin);
                    ajuste(t, parseFloat(ini), parseFloat(fin));
                }
            })
        }
    })
}