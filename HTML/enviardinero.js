$(document).ready(function() {
    actualizarSaldoUI();
    
    let contactoSeleccionado = null;

    function actualizarSaldoUI() {
        let saldo = localStorage.getItem("saldo") || 60000;
        $('#displaySaldo').text(`$${Number(saldo).toLocaleString()}`);
    }

    $('#contactList').on('click', 'li', function() {

        $('#contactList li').removeClass('active bg-primary text-white');
        $(this).addClass('active bg-primary text-white');

        contactoSeleccionado = $(this).data('nombre');
        $('#btnEnviarDinero').fadeIn(300);
    });
    $('#btnEnviarDinero').on('click', function() {
        if (contactoSeleccionado) {
            realizarTransferencia(contactoSeleccionado);
        }
    });
    $('#searchContact').on('keyup', function() {
        const valorBusqueda = $(this).val().toLowerCase();
        $('#contactList li').each(function() {
            const textoContacto = $(this).text().toLowerCase();
            $(this).toggle(textoContacto.indexOf(valorBusqueda) > -1);
        });
    });
    $('#btnAgregar').on('click', function() {
        $(this).fadeOut(200, function() {
            $('#nuevoContactoForm').slideDown(400);
        });
    });

    $('#btnCancelar').on('click', function() {
        $('#nuevoContactoForm').slideUp(400, function() {
            $('#btnAgregar').fadeIn(200);
            $('#inputNombre, #inputBanco, #inputDetalle').val('').removeClass('is-invalid');
        });
    });
    $('#btnGuardar').on('click', function() {
        const nombre = $('#inputNombre').val().trim();
        const banco = $('#inputBanco').val().trim();
        const detalle = $('#inputDetalle').val().trim();
        
        $('.form-control').removeClass('is-invalid');
        let formularioValido = true;

        if (nombre === "") { $('#inputNombre').addClass('is-invalid'); formularioValido = false; }
        if (banco === "") { $('#inputBanco').addClass('is-invalid'); formularioValido = false; }
        
        const regexFormato = /^(\d{1,2}(\.\d{3}){2}-[\dkK])$/; 
        if (!regexFormato.test(detalle)) {
            $('#inputDetalle').addClass('is-invalid');
            formularioValido = false;
        }

        if (formularioValido) {
            const nuevoLi = `
                <li class="list-group-item" data-nombre="${nombre}" style="cursor: pointer;">
                    <div class="contact-info">
                        <span class="contact-name">${nombre}</span><br>
                        <span class="contact-details">RUN: ${detalle}. ${banco}</span>
                    </div>
                </li>`;
            
            $('#contactList').append(nuevoLi);
            inyectarAlerta(`Contacto <strong>${nombre}</strong> guardado.`, "info");
            $('#btnCancelar').click(); 
        }
    });

    function realizarTransferencia(nombre) {
        const montoAEnviar = prompt(`¿Cuánto quieres enviar a ${nombre}?`);
        if (montoAEnviar === null) return;
        const monto = Number(montoAEnviar);
        let saldoActual = Number(localStorage.getItem("saldo")) || 60000;

        if (isNaN(monto) || monto <= 0) {
            inyectarAlerta("Monto inválido.", "danger");
            return;
        }
        if (monto > saldoActual) {
            inyectarAlerta("Saldo insuficiente.", "danger");
            return;
        }
        if (confirm(`¿Confirmas el envío de $${monto.toLocaleString()} a ${nombre}?`)) {
            let nuevoSaldo = saldoActual - monto;
            localStorage.setItem("saldo", nuevoSaldo);
            
            let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
            movimientos.push(`Envío a ${nombre}: -$${monto.toLocaleString()}`);
            localStorage.setItem("movimientos", JSON.stringify(movimientos));

            actualizarSaldoUI();

            const msgConfirmacion = `
                <div class="alert alert-success shadow-lg" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; width: 90%; max-width: 350px;">
                    <strong>¡Éxito!</strong> Envío realizado a ${nombre}.
                </div>`;
            $('body').append(msgConfirmacion);

            setTimeout(() => { window.location.href = "menu.html"; }, 2000);
        }
    }

    function inyectarAlerta(mensaje, tipo) {
        const html = `<div class="alert alert-${tipo} alert-dismissible fade show">${mensaje}</div>`;
        $('#alert-container').html(html).hide().fadeIn(400);
    }
});