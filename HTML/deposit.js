$(document).ready(function() {
    let saldoActual = localStorage.getItem("saldo") || 60000;
    $('#saldoActual').text(`$${Number(saldoActual).toLocaleString()}`);

    function mostrarAlerta(mensaje, tipo) {
        const alerta = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
            </div> `;
        $('#alert-container').html(alerta).hide().fadeIn(500);
    }

    $('#depositForm').submit(function(e) {
        e.preventDefault();
        $('#alert-container').empty();

        const montoIngresado = Number($('#montoNuevo').val());

        if (montoIngresado <= 0 || isNaN(montoIngresado)) {
            mostrarAlerta("<strong>Error:</strong> Ingresa un monto válido mayor a 0.", "danger");
            return;
        }

        let saldoViejo = Number(localStorage.getItem("saldo")) || 60000;
        let nuevoSaldo = saldoViejo + montoIngresado;
        localStorage.setItem("saldo", nuevoSaldo);

        let movimientosReales = JSON.parse(localStorage.getItem("movimientos")) || [];
    
        const nuevoMovimiento = `Depósito de $${montoIngresado}`;
        movimientosReales.push(nuevoMovimiento);
        
        localStorage.setItem("movimientos", JSON.stringify(movimientosReales));
        mostrarAlerta(`<strong>¡Depósito exitoso!</strong> Has sumado $${montoIngresado.toLocaleString()}.`, "success");
        $('#saldoActual').text(`$${nuevoSaldo.toLocaleString()}`);
        $('#montoNuevo').val('');

        setTimeout(function() {
            window.location.href = "menu.html";
        }, 2000);
    });
});
