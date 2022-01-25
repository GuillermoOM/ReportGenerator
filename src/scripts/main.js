/////////////////////////////////////////////////////////////////////////////////////////////
//PARA AGREGAR UN NUEVO WIDGET:                                                            //
// 1. crear archivos html, js, css en carpeta widgets                                      //
// 2. agregar js y css con <script> y <link> en <head>                                     //
// 3. agregar boton en sidenav con atributo modulo con nombre del archivo html del widget  //
// 4. agregar en for de funcion guardarT()                                                 //
// 5. agregar en primer else de funcion batch()                                            //
/////////////////////////////////////////////////////////////////////////////////////////////

// BUGS: al hacer batch, si se agrega una nota pero no se ha pedido autorizacion antes, no va a cargar la informacion a tiempo antes de generar el PDF,
// así que simplemente hay que agregar las credenciales y volver a correr el batch.

jsPDF = require('jspdf')
FileSaver = require("file-saver")
Dialogs = require('dialogs')
html2canvas = require('html2canvas')
convert = require('color-convert');
const dialogs = Dialogs()
apikey = null;

// SCRIPTS PRINCIPALES
$(document).ready(function () {
    $(".buta").click(function () { //Al hacer click en un boton del menu lateral
        if ($(this).attr("modulo")) { //Si es el boton de Cambiar Logo
            var file = "widgets/" + $(this).attr("modulo") + '.html'; //Si es boton de widget, busca el widget con el nombre indicado en atributo modulo
            if ($(".content").find("#focused").length && $(this).attr("modulo")) {
                var div = document.createElement("div");
                $(div).css({ "position": "relative" });
                $(div).attr("id", $(this).attr("modulo") + ($(".content").find("#focused").find(".layout").children().length + 1));
                $(div).load(file);
                $("#focused").find(".layout").append(div);
            }
            else {
                dialogs.alert("Elige una pagina!");
            }
        }
    });
});

function nuevo() { //Nuevo documento
    if ($(".content").children().length) {
        dialogs.confirm("Estas seguro que quieres borrar todo?", ok => {
            if (ok) {
                $(".content").children().remove();
            }
        })
    }
}

function abrirT() { //Abrir template (borra todo el contenido actual)
    if ($(".content").children().length) {
        dialogs.confirm("Estas seguro que quieres borrar todo?", ok => {
            if (ok) {
                $(".content").children().remove();
                cargarT();
            }
        })
    } else {
        cargarT();
    }
}

function abrirR() { //Abrir Reporte (borra todo el contenido actual)
    if ($(".content").children().length) {
        dialogs.confirm("Estas seguro que quieres borrar todo?", ok => {
            if (ok) {
                $(".content").children().remove();
                cargarR();
            }
        })
    } else {
        cargarR();
    }
}

function cargarR() { // Carga un reporte completo
    $("#cargahtml").on("change", function (input) {
        if (input.currentTarget.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#cont").append(e.target.result);
            };
            reader.readAsText(input.currentTarget.files[0]);
        }
        $("#cargahtml").off("change");
        input.currentTarget.value = "";
    });
    $("#cargahtml").click();
}

function cargarT() { // Carga un template html
    $("#cargahtml").on("change", function (input) {
        if (input.currentTarget.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#cont").append(e.target.result);
                //aparecen los botones en el editor, a partir del template
                $(".content").find(".upload-btn-wrapper img").attr('src', " ").css({ display: "none" });
                $(".content").find(".ima").css({ display: "block" });
                $(".content").find(".mapa img").attr('src', " ").css({ display: "none" });
                $(".content").find(".buta").css({ display: "block" });
                $(".content").find(".logo img").attr('src', " ");
            };
            reader.readAsText(input.currentTarget.files[0]);
        }
        $("#cargahtml").off("change");
        input.currentTarget.value = "";
    });
    $("#cargahtml").click();
}

async function guardarR() { //Guarda el Reporte completo
    if ($(".content").find(".pagina").length) {
        //desaparece botones y aparece las imagenes para preparar el template para batch
        var html = await $(".content").html();
        var blob = new Blob([html], { type: "text/html" });
        await saveAs(blob, "reporte.html");
    }
    else {
        dialogs.alert("No hay nada que guardar!");
    }
}

async function guardarT() { //Guarda el Template existente en html y json
    if ($(".content").children().length) {
        dialogs.confirm("Se borraran todos los datos, quieres continuar?", async ok => {
            if (ok) {
                //desaparece botones y aparece las imagenes para preparar el template para batch
                await $(".content").find(".upload-btn-wrapper img").attr('src', " ").css({ display: "block" });
                await $(".content").find(".ima").css({ display: "none" });
                await $(".content").find(".mapa img").attr('src', " ").css({ display: "block" });
                await $(".content").find(".buta").css({ display: "none" });
                await $(".content").find(".logo img").attr('src', " ");

                var json = {};

                var p = 1;
                json["reporte1"] = {};
                for (const pag of $(".content").find(".pagina")) {
                    json["reporte1"]["pagina" + p] = {};
                    json["reporte1"]["pagina" + p].logo = "Direccion a imagen";
                    json["reporte1"]["pagina" + p].mapa = "Direccion a imagen";
                    for (const wid of $(pag).find(".layout").children()) {
                        // AJUSTAR SEGUN WIDGETS
                        // GUARDAR TITULO EN UNA LLAVE Y CONTENIDO EN UNA LISTA
                        //
                        if ($(wid).children(".w_imagen").length) {
                            json["reporte1"]["pagina" + p][$(wid).attr("id")] = { "Titulo": $(wid).find("#title").html(), "contenido": ["Direccion a imagen"] };
                        }
                        if ($(wid).children(".w_texto").length) {
                            json["reporte1"]["pagina" + p][$(wid).attr("id")] = { "Titulo": $(wid).find("#title").html(), "contenido": ["Texto del contenedor"] };
                        }
                        if ($(wid).children(".w_pol").length) {
                            json["reporte1"]["pagina" + p][$(wid).attr("id")] = { "Titulo": $(wid).find("#title").html(), "contenido": ["area", "Coordenadas"] };
                        }
                        if ($(wid).children(".w_lista").length) {
                            json["reporte1"]["pagina" + p][$(wid).attr("id")] = { "Titulo": $(wid).find("#title").html(), "contenido": [] };;
                            for (const li of $(wid).find("li")) {
                                json["reporte1"]["pagina" + p][$(wid).attr("id")]["contenido"].push($(li).html());
                                $(li).remove();
                            }
                            $(wid).find("hr").remove();
                            $(wid).children().css({ "height": $(wid).find("#container").height() + 40 });
                        }
                        if ($(wid).children(".w_nota").length) {
                            json["reporte1"]["pagina" + p][$(wid).attr("id")] = { "Titulo": $(wid).find("#title").html(), "contenido": ["ID_estudio", "ID_nota"] };
                        }
                        if ($(wid).children(".w_cambio").length) {
                            json["reporte1"]["pagina" + p][$(wid).attr("id")] = { "Titulo": $(wid).find("#title").html(), "contenido": ["reemplazar por 'positivo' o 'negativo'", "longitud inicial", "longitud final"] };
                        }
                        if ($(wid).children(".w_info").length) {
                            json["reporte1"]["pagina" + p][$(wid).attr("id")] = { "Titulo": $(wid).find("#title").html(), "contenido": ["Fecha", "Zona", "Subzona"] };
                        }
                    }
                    p++;
                }

                var html = await $(".content").html();
                var blob = new Blob([html], { type: "text/html" });
                var blob2 = new Blob([JSON.stringify(json)], { type: "text/json" });
                await saveAs(blob, "template.html");
                await saveAs(blob2, "template.json");

                //vuelven a aparecer los botones en el editor
                await $(".content").find(".upload-btn-wrapper img").attr('src', " ").css({ display: "none" });
                await $(".content").find(".ima").css({ display: "block" });
                await $(".content").find(".mapa img").attr('src', " ").css({ display: "none" });
                await $(".content").find(".buta").css({ display: "block" });
                await $(".content").find(".logo img").attr('src', " ");


            }
        })
    }
    else {
        dialogs.alert("No hay nada que guardar!");
    }
}

async function exportarPDF() { //Exporta todo el contenido actual en un PDF
    if ($(".content").find(".pagina").length) {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

        // Desaparece botones de widgets y cambia el diseño de la pagina para ajsutarse al PDF
        await $("#prog").css({ "display": "flex" });
        await $("body").css({ "overflow": "hidden" });
        await $(".content").find(".dragger").css({ "display": "none" });
        await $(".content").find(".color").css({ "display": "none" });
        await $(".content").find(".trash").css({ "display": "none" });
        await $(".content").find(".menos").css({ "display": "none" });
        await $(".content").find(".mas").css({ "display": "none" });

        await $(".content").find("#title").css({ "width": "100%" });

        var f = $(".content").find(".pagina");
        await $(f).attr({ "id": "unfocused" });
        await $(f).css({ "border-radius": "0px" });
        await $(f).find(".container").css({ "border-radius": "0px 0px 6px 6px" });
        // Creacion de PDF

        var doc = new jsPDF({
            orientation: 'l',
            unit: 'px',
            format: 'a3',
            putOnlyUsedFonts: true
        });

        var hei = 632;

        for (const element of Array.from(f)) {
            await html2canvas(element, {
                scale: 5,
                useCORS: true
            }).then(function (canvas) {
                var img = canvas.toDataURL("image/jpeg");
                doc.addImage(img, "JPEG", 0, 0, hei * Math.sqrt(2), hei);
                doc.addPage("a3", "l");
                delete canvas;
                delete img;
            });
        }

        await doc.deletePage(f.length + 1);
        await doc.save();
        delete doc;

        //Vuelven a aparecer los botones
        await $(f).find(".layout").children("div").children().css({ "border-style": "none" });
        await $(".content").find(".dragger").css({ "display": "block" });
        await $(".content").find(".color").css({ "display": "block" });
        await $(".content").find(".trash").css({ "display": "block" });
        await $(".content").find(".menos").css({ "display": "block" });
        await $(".content").find(".mas").css({ "display": "block" });
        await $(f).css({
            "border-radius": "6px 6px 6px 6px",
            "margin-bottom": "20px"
        });
        await $("#prog").css({ "display": "none" });
        await $("body").css({ "overflow": "scroll" });
        await $(f).find(".container").css({ "border-radius": "20px 0px 30px 6px" });

        await $(".content").find("#title").css({ "width": "80%" });
    }
    else {
        dialogs.alert("No hay nada que exportar!");
    }
}

async function batch() { //lectura de json y generación de PDFs
    if ($(".content").find(".pagina").length) {
        $("#cargajson").on("change", async function (input) {
            if (input.currentTarget.files[0]) {
                var reader = new FileReader();
                reader.onload = async function (e) {
                    $(".content").find(".upload-btn-wrapper img").attr('src', " ").css({ display: "block" });
                    $(".content").find(".ima").css({ display: "none" });
                    $(".content").find(".mapa img").attr('src', " ").css({ display: "block" });
                    $(".content").find(".buta").css({ display: "none" });
                    $(".content").find(".logo img").attr('src', " ");
                    var json = JSON.parse(e.target.result);
                    for (const rep in json) {
                        for (const jp in json[rep]) {
                            for (const item in json[rep][jp]) {
                                elemento = $(".content").find("#" + jp).find("#" + item)
                                if ($(elemento).prop("tagName") == "IMG") { //es logo o mapa?
                                    $(elemento).attr("src", json[rep][jp][item]);
                                }
                                else {
                                    // AJUSTAR SEGUN WIDGETS
                                    // DEBE TOMAR INFORMACION DE ARRAY "CONTENIDO"
                                    //
                                    if ($(elemento).children()[0].classList[0] == "w_imagen") { //es widget de imagen?
                                        $(elemento).find("#title").html(json[rep][jp][item]["Titulo"]);
                                        $(elemento).find("#container").find("img").attr("src", json[rep][jp][item]["contenido"][0]);
                                    }
                                    if ($(elemento).children()[0].classList[0] == "w_texto") { //es widget de texto
                                        $(elemento).find("#title").html(json[rep][jp][item]["Titulo"]);
                                        $(elemento).find("#container").html(json[rep][jp][item]["contenido"][0]);
                                    }
                                    if ($(elemento).children()[0].classList[0] == "w_pol") { //es widget de texto
                                        $(elemento).find("#title").html(json[rep][jp][item]["Titulo"]);
                                        $(elemento).find("#t_pol").html(json[rep][jp][item]["contenido"][0] + " ha");
                                        $(elemento).find("#coord").html("Coordenadas: " + json[rep][jp][item]["contenido"][1]);
                                    }
                                    if ($(elemento).children()[0].classList[0] == "w_lista") { //es widget de texto
                                        $(elemento).find("#title").html(json[rep][jp][item]["Titulo"]);
                                        var c = 0;
                                        var lista = document.createElement("div");
                                        json[rep][jp][item]["contenido"].forEach(element => {
                                            var li = document.createElement("li");
                                            if (c > 0) {
                                                $(lista).append("<hr>");
                                            }
                                            $(li).html(element);
                                            $(lista).append(li);
                                            c++;
                                        });
                                        $(elemento).find("ul").html($(lista).html());
                                        $(elemento).children().css({ "height": $(elemento).find("#container").height() + 40 });
                                    }
                                    if ($(elemento).children()[0].classList[0] == "w_nota") { //widget mixto
                                        $(elemento).find("#title").html(json[rep][jp][item]["Titulo"]);
                                        await get_auth(function (key) {
                                            apikey = key;
                                            $.ajax({
                                                url: "https://server.agropro.mx/api/v1/notes?studyid=" + json[rep][jp][item]["contenido"][0],
                                                type: "GET",
                                                headers: {
                                                    "authorization": apikey
                                                },
                                                contentType: "application/json",
                                                success: function (result) {
                                                    for (const nota in result) {
                                                        if (result[nota].id == json[rep][jp][item]["contenido"][1]) {
                                                            $(elemento).find("#title").html(result[nota].name);
                                                            $(elemento).find("#container").find("#descr").html(result[nota].content);
                                                            var fecha = new Date(result[nota].createdAt);
                                                            $(elemento).find("#container").find("#fecha").html(fecha.toLocaleDateString());
                                                            $(elemento).find("#container").find("#img_nota").attr('src', result[nota].imageUrl);
                                                        }
                                                    }
                                                },
                                                error: function () {
                                                    dialogs.alert("Intentelo de nuevo!");
                                                    apikey = null;
                                                }
                                            });
                                        });
                                    }
                                    if ($(elemento).children()[0].classList[0] == "w_cambio") { //es widget de texto
                                        $(elemento).find("#title").html(json[rep][jp][item]["Titulo"]);
                                        if (json[rep][jp][item]["contenido"][0] == "positivo") {
                                            $($(elemento).find("svg").children()[0]).attr("fill", "green");
                                            $(elemento).find("svg").attr("direccion", "green");
                                            $(elemento).find("#t_block").css({ "color": "green" });
                                        }
                                        if (json[rep][jp][item]["contenido"][0] == "negativo") {
                                            $($(elemento).find("svg").children()[0]).attr("fill", "red");
                                            $(elemento).find("svg").attr("direccion", "red");
                                            $(elemento).find("#t_block").css({ "color": "red" });
                                        }
                                        $(elemento).find("#l_ini").html(json[rep][jp][item]["contenido"][1]);
                                        $(elemento).find("#l_fin").html(json[rep][jp][item]["contenido"][2]);
                                        ajuste($(elemento).find("#long"), parseFloat(json[rep][jp][item]["contenido"][1]), parseFloat(json[rep][jp][item]["contenido"][2]));
                                    }
                                    if ($(elemento).children()[0].classList[0] == "w_info") { //es widget de texto
                                        $(elemento).find("#title").html(json[rep][jp][item]["Titulo"]);
                                        $(elemento).find("#fecha").html("Fecha: " + json[rep][jp][item]["contenido"][0]);
                                        $(elemento).find("#zona").html("Zona: " + json[rep][jp][item]["contenido"][1]);
                                        $(elemento).find("#subzona").html("Subzona: " + json[rep][jp][item]["contenido"][2]);
                                    }
                                }
                            }
                        }
                        await exportarPDF();
                    }
                };
                reader.readAsText(input.currentTarget.files[0]);
            }
            $("#cargajson").off("change");
            input.currentTarget.value = "";
        });
        $("#cargajson").click();
    }
    else {
        dialogs.alert("Abre un template primero!");
    }
}

// WIDGETS (funciones universales)

function cambio(t) { // Cambio de titulo
    dialogs.prompt("Introduzca el titulo de la carta: ", $(t).html(), ok => {
        if (ok != "" && ok != null) {
            t.innerHTML = ok;
        }
    });

}

function ccolor(t) { // Cambio de color de barra de titulo de un widget
    $(t).parent().parent().css({ "background-color": $(t).val() });
    if (convert.hex.hsl($(t).val())[2] >= 48) {
        $(t).parent().siblings("#title").css({ "color": "black" });
    }
    if (convert.hex.hsl($(t).val())[2] < 48) {
        $(t).parent().siblings("#title").css({ "color": "white" });
    }
}

function fcolor(t) { // Cambio de color de fondo del logo
    if ($(".content").find(".pagina").length) {
        $("#color_fondo").on("change", function (input) {
            $(".content").find(".logo").css({ "background-color": input.target.value });
        });
        $("#color_fondo").click();
    }
    else {
        dialogs.alert("No hay paginas!");
    }
}

function Padd() { //Agregar pagina al reporte
    var div = document.createElement("div");
    $(div).load("widgets/pagina.html", function (response, status, xhr) {
        var src = $(".content").find(".logo img").attr("src"); // Asigna el logo si existe uno
        $(div).find(".logo img").attr('src', src);
        var color = $(".content").find(".logo").css("background-color");
        $(div).find(".logo").css({"background-color": color});
        $(div).attr("id", "pagina" + ($(".content").find(".pagina").length + 1));
        $(".content").append(div);
        var last = $(".content").children().last();
        var f = $(".content").find(".pagina");
        $(f).attr({ "id": "unfocused" });
        $(last.children(".pagina")).attr({ "id": "focused" }); // Enfoca la pagina nueva
        var p = 1;
        for (const pag of $(f)) {
            $(pag).find(".num_pag").html("Pág " + p + " | " + $(f).length);
            p++;
        }
    });
}

function Prem() { //Remover pagina seleccionada
    if ($(".content").find("#focused").length) {
        $(".content").find("#focused").parent().remove();
        var f = $(".content").find(".pagina");
        var p = 1;
        for (const pag of $(f)) {
            $(pag).find(".num_pag").html("Pág " + p + " | " + $(f).length);
            p++;
        }
    } else {
        dialogs.alert("Elige una pagina!");
    }
}

function cargaimg() {
    if ($(".content").find(".pagina").length) {
        $("#cargaimg").on("change", function (input) { //Carga de logo
            if (input.currentTarget.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(".content").find(".logo").children("img").attr('src', e.target.result);
                    $("#cargaimg").off("change");
                };
                reader.readAsDataURL(input.currentTarget.files[0]);
            }
            input.currentTarget.value = "";
        });
        $("#cargaimg").click();
    }
    else {
        dialogs.alert("No hay paginas!");
    }
}

function get_auth(callback) {
    var user;
    var passw;
    if (apikey == null) {
        dialogs.prompt("Usuario:", "", u => {
            user = u;
            dialogs.prompt("Contraseña:", "", p => {
                passw = p;
                var credenciales = { "email": user, "password": passw };
                $.post("https://server.agropro.mx/api/v1/users/auth", credenciales, function (data) {
                    callback(data);
                });
            });
        });
    }
    else {
        callback(apikey);
    }
}