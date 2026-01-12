$(document).ready(function() {
    let saldo = localStorage.getItem("saldo");
    if (saldo === null) {
        saldo = 60000;
        localStorage.setItem("saldo", saldo);
    }
    $("#monto").text(`$${Number(saldo).toLocaleString()}`);

    function redireccionarConMensaje(destino, nombrePagina) {
        $("#mensaje-redireccion").text(`Redirigiendo a ${nombrePagina}...`).hide().fadeIn(300);
        
        setTimeout(function() {
            window.location.href = destino;
        }, 800);
    }

    $('#depositar').on('click', function() {
        redireccionarConMensaje("deposit.html", "Depósitos");
    });
    $('#enviarDinero').on('click', function() {
        redireccionarConMensaje("enviardinero.html", "Enviar Dinero");
    });
    $('#ultimosMovimientos').on('click', function() {
        redireccionarConMensaje("transacciones.html", "Últimos Movimientos");
    });
});