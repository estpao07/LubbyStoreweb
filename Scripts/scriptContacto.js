$(document).ready(function() {
    // Validaciones
    $('#contactForm').submit(function(e) {
        e.preventDefault(); 
        
        // resetear los indicadores anteriores
        $('.is-invalid').removeClass('is-invalid');
        $('#errorMessage').addClass('d-none');
        $('#successMessage').addClass('d-none');
        
        let hasErrors = false;
        let errorMessages = [];
        
        // Validar Nombre
        const nombre = $('#nombre').val().trim();
        if (nombre === '') {
            $('#nombre').addClass('is-invalid');
            hasErrors = true;
            errorMessages.push('El nombre completo es requerido');
        }
        
        // Validar gmail
        const email = $('#email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' || !emailRegex.test(email)) {
            $('#email').addClass('is-invalid');
            hasErrors = true;
            errorMessages.push('Por favor ingrese un correo electrónico válido');
        }
        
        // validar telefono a 8 digitos
        const telefono = $('#telefono').val().trim();
        const phoneRegex = /^\d{8,}$/;
        if (telefono === '' || !phoneRegex.test(telefono)) {
            $('#telefono').addClass('is-invalid');
            hasErrors = true;
            errorMessages.push('El número de teléfono debe tener al menos 8 dígitos');
        }
        
        // validar asunto
        const asunto = $('#asunto').val().trim();
        if (asunto === '') {
            $('#asunto').addClass('is-invalid');
            hasErrors = true;
            errorMessages.push('El asunto es requerido');
        }
        
        // Validar mensaje
        const mensaje = $('#mensaje').val().trim();
        if (mensaje === '') {
            $('#mensaje').addClass('is-invalid');
            hasErrors = true;
            errorMessages.push('El mensaje es requerido');
        }
        
        // Si hay errores muestre los errores
        if (hasErrors) {
            $('#errorText').text(errorMessages.join(', '));
            $('#errorMessage').removeClass('d-none');
            return false;
        }
        
        // Si no hay errores 
        $('#successMessage').removeClass('d-none');
        $('#contactForm')[0].reset();
        
        // muestre el mensaje de formulario enviado
        alert('¡Formulario enviado con éxito! Gracias por contactarnos.');
        
        return false; 
    });
});