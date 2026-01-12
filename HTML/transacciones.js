$(document).ready(function() {
    const listaFicticia = [
        { tipo: 'compra', detalle: 'Compra en línea', monto: 25000 },
        { tipo: 'deposito', detalle: 'Depósito cajero', monto: 125000 },
        { tipo: 'transferencia', detalle: 'Envío a Elena Nito', monto: 35000 },
        { tipo: 'compra', detalle: 'Suscripción Crunchyroll', monto: 5000 },
    ];

    const movimientosReales = JSON.parse(localStorage.getItem("movimientos")) || [];
    function getTipoTransaccion(tipo) {
        switch(tipo) {
            case 'compra': 
                return { texto: 'Compra', claseMonto: 'monto-negativo', simbolo: '-' };
            case 'deposito': 
                return { texto: 'Depósito', claseMonto: 'monto-positivo', simbolo: '+' };
            case 'transferencia': 
                return { texto: 'Transferencia', claseMonto: 'monto-negativo', simbolo: '-' };
            default: 
                return { texto: 'Otro', claseMonto: '', simbolo: '' };
        }
    }
    function mostrarUltimosMovimientos(filtro) {
        const $contenedor = $('#listaMovimientos');
        $contenedor.empty();

        const todosLosMovimientos = [...listaFicticia];
        
        movimientosReales.forEach(mov => {
            const montoMatch = mov.match(/\$(\d+)/);
            const montoExtraido = montoMatch ? parseInt(montoMatch[1]) : null;
            let tipo = mov.includes("Envío") || mov.includes("Transferencia") ? "transferencia" : "deposito";
            
            todosLosMovimientos.push({ tipo: tipo, detalle: mov, monto: montoExtraido });
        });
        todosLosMovimientos.forEach(mov => {
            if (filtro === 'todos' || mov.tipo === filtro) {
                const infoTipo = getTipoTransaccion(mov.tipo);
                const montoHtml = mov.monto 
                    ? `<span class="${infoTipo.claseMonto}">${infoTipo.simbolo}$${mov.monto.toLocaleString()}</span>` 
                    : `<span class="text-muted">Pendiente</span>`;
                const li = $(`
                    <li class="list-group-item movimiento-item d-flex justify-content-between align-items-center">
                        <div>
                            <div class="font-weight-bold">${infoTipo.texto}</div>
                            <small class="text-muted">${mov.detalle}</small>
                        </div>
                        ${montoHtml}
                    </li>
                `);
                $contenedor.append(li);
            }
        });
        if ($contenedor.children().length === 0) {
            $contenedor.append('<li class="list-group-item text-center text-muted">No hay movimientos de este tipo.</li>');
        }
    }
    $('#filtroTipo').on('change', function() {
        mostrarUltimosMovimientos($(this).val());
    });
    mostrarUltimosMovimientos('todos');
});