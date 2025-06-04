// Inicializar carrito desde localStorage o crear uno nuevo
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    $('.carrito-contador').text(cantidadTotal);
}

// Función para agregar productos al carrito desde la página de productos
$(document).ready(function() {
    // Asignar evento a todos los botones 
    $('.agregar-carrito-btn').click(function() {
        // Obtener información del producto desde la tarjeta actual
        const card = $(this).closest('.card');
        const nombre = card.find('.card-title').text();
        const precioTexto = card.find('.precio').text().replace('$', '');
        const precio = parseFloat(precioTexto);
        const imagen = card.find('img').attr('src');
        
        // Crear ID único basado en el nombre del producto
        const id = nombre.toLowerCase().replace(/\s+/g, '-');
        
        // Buscar si el producto ya está en el carrito
        const itemIndex = carrito.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            // Si ya existe, incrementar cantidad
            carrito[itemIndex].cantidad += 1;
        } else {
            // Si no existe, agregarlo al carrito
            carrito.push({
                id: id,
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1
            });
        }
        
        // Guardar carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizar contador del carrito
        actualizarContadorCarrito();
        
        // Mostrar mensaje de confirmación
        mostrarMensaje(`${nombre} agregado al carrito`, 'success');
    });
    
    // Inicializar contador del carrito al cargar la página
    actualizarContadorCarrito();
});

// Función para mostrar mensajes con tipos de alerta
function mostrarMensaje(mensaje, tipo = 'success') {
    // Crear la alerta
    const alertaHTML = `
    <div class="alert alert-${tipo} mensaje-alerta" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; display: none;">
        ${mensaje}
    </div>
    `;

    // Agregar alerta al documento
    $('body').append(alertaHTML);

    // Mostrar y ocultar la alerta después de 3 segundos
    $('.mensaje-alerta').fadeIn().delay(3000).fadeOut(function() {
        $(this).remove();
    });
}