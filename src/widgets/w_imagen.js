function load_img(input) {
    // Carga de imagen en widget
    if (input.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(input.srcElement).siblings('#imagen')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.target.files[0]);
        var b = $(input.srcElement).siblings('#up');
        var i = $(input.srcElement).siblings('#imagen');
        $(b).css({ display: "none" });
        $(i).css({ display: "block" });
        $(input.srcElement).parent().css({ width: "98%", height: "100%" });
    }
    input.target.value = '';
}