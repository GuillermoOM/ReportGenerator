function texto(t) {
  // Hacer visible ventana de editor de texto
  $(t).parent().css({'z-index':'10'});
  $(t).siblings("#entrada").css({ "display": "flex"});
  $(t).siblings("#entrada").find("#input_box")[0].value = $(t).html();
}

function acc(t) {
  // Boton aceptar en ventana
  var texto = $(t).siblings("#input_box")[0].value;
  if (texto != "" && texto != null) {
    $(t).parent().parent().siblings("#container").html(texto);
  }
  $(t).parent().parent().css({ "display": "none" });
  $(t).parent().parent().parent().css({'z-index':'1'});
}

function can(t) {
  // Boton cancelar en ventana
  $(t).parent().parent().css({ "display": "none" });
}