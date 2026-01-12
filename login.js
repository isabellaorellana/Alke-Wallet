 $(document).ready(function() {
            $('#loginForm').submit(function(evento) {
                evento.preventDefault(); 

        var email = $('#email').val();
        var pass = $('#password').val();

        if(email === "" || pass === "") {
            alert("Por favor, completa todos los campos.");
            return;
        }
        if(email === 'admin@wallet.com' && pass === '123456') {
         window.location.href = 'HTML/menu.html';
        } else {
        alert('Datos incorrectos (Versión jQuery)');
         $('#password').val('');
        }
    });
});