// Inicializar carrito desde localStorage o crear uno nuevo
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar el contador del carrito en todas las páginas
function actualizarContadorCarrito() {
    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    $('.carrito-badge').text(cantidadTotal);
}

// Función para calcular y actualizar los totales
function actualizarTotales() {
    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const impuestos = subtotal * 0.07; // 7% de impuestos
    const envio = $('input[name="deliveryOption"]:checked').attr('id') === 'storePickup' ? 0 : 
                  ($('input[name="deliveryOption"]:checked').attr('id') === 'expressDelivery' ? 8.99 : 3.99);
    const granTotal = subtotal + impuestos + envio;
    
    // Actualizar valores en la página
    $('#total-compra').text(`$${subtotal.toFixed(2)}`);
    $('#impuestos').text(`$${impuestos.toFixed(2)}`);
    $('#gran-total').text(`$${granTotal.toFixed(2)}`);
}

// Función para agregar productos al carrito desde la página de productos
$(document).ready(function() {
    // Asignar evento a todos los botones "Agregar al carrito" o "Añadir al carrito"
    $('.agregar-carrito-btn').click(function() {
        // Obtener información del producto desde la tarjeta actual
        const card = $(this).closest('.card');
        const nombre = card.find('.card-title').text();
        const precioTexto = card.find('.precio').text().replace('$', '');
        const precio = parseFloat(precioTexto);
        const imagen = card.find('img').attr('src');
        const id = $(this).data('id') || nombre.toLowerCase().replace(/\s+/g, '-');
        
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
    
    // Si estamos en la página del carrito, mostrar los productos
    if ($('#carrito-container').length > 0) {
        mostrarProductosCarrito();
        
        // Asignar eventos a los botones de opción de entrega
        $('input[name="deliveryOption"]').change(function() {
            actualizarTotales();
        });
    }
});

// Función para mostrar mensajes con tipos de alerta
function mostrarMensaje(mensaje, tipo = 'success') {
    // Crear elemento de alerta
    const alertaHTML = `
    <div class="alert alert-${tipo} mensaje-alerta" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; display: none;">
        ${mensaje}
    </div>
    `;

    // Agregar alerta al cuerpo del documento
    $('body').append(alertaHTML);

    // Mostrar y ocultar la alerta después de 3 segundos
    $('.mensaje-alerta').fadeIn().delay(3000).fadeOut(function() {
        $(this).remove();
    });
}

// Función para mostrar los productos en el carrito
function mostrarProductosCarrito() {
    const carritoContainer = $('#carrito-container');
    carritoContainer.empty();
    
    if (carrito.length === 0) {
        carritoContainer.html(`
            <div class="text-center py-5">
                <i class="bi bi-cart-x fs-1 text-muted"></i>
                <h3 class="mt-3">Tu carrito está vacío</h3>
                <p class="text-muted">Agrega productos para comenzar a comprar</p>
                <a href="CatalogoMain.html" class="btn btn-primary mt-3">
                    <i class="bi bi-shop"></i> Ir a Catálogo
                </a>
            </div>
        `);
        actualizarTotales();
        return;
    }
    
    // Crear tabla de productos
    let tablaHTML = `
    <div class="card shadow-sm">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="card-title m-0">Productos en tu Carrito</h5>
            <button id="vaciar-carrito" class="btn btn-outline-danger btn-sm">
                <i class="bi bi-trash"></i> Vaciar Carrito
            </button>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover m-0">
                    <thead class="table-light">
                        <tr>
                            <th scope="col">Producto</th>
                            <th scope="col" class="text-center">Precio</th>
                            <th scope="col" class="text-center">Cantidad</th>
                            <th scope="col" class="text-center">Total</th>
                            <th scope="col" class="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        
        tablaHTML += `
        <tr data-id="${item.id}">
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" class="me-3" style="width: 60px; height: 60px; object-fit: cover;">
                    <div>
                        <h6 class="mb-0">${item.nombre}</h6>
                        <small class="text-muted">ID: ${item.id}</small>
                    </div>
                </div>
            </td>
            <td class="text-center align-middle">$${item.precio.toFixed(2)}</td>
            <td class="align-middle">
                <div class="input-group input-group-sm justify-content-center" style="width: 120px;">
                    <button class="btn btn-outline-secondary disminuir-cantidad" type="button">
                        <i class="bi bi-dash"></i>
                    </button>
                    <input type="text" class="form-control text-center cantidad-input" value="${item.cantidad}" readonly>
                    <button class="btn btn-outline-secondary aumentar-cantidad" type="button">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
            </td>
            <td class="text-center align-middle">$${subtotal.toFixed(2)}</td>
            <td class="text-center align-middle">
                <button class="btn btn-outline-danger btn-sm eliminar-item">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });
    
    tablaHTML += `
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
    
    carritoContainer.html(tablaHTML);
    actualizarTotales();
    
    // Asignar eventos a los botones de acción
    
    // Eliminar producto
    $('.eliminar-item').click(function() {
        const fila = $(this).closest('tr');
        const id = fila.data('id');
        const nombreItem = carrito.find(item => item.id === id)?.nombre;
        
        // Eliminar del array
        carrito = carrito.filter(item => item.id !== id);
        
        // Actualizar localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizar interfaz
        actualizarContadorCarrito();
        mostrarProductosCarrito();
        
        mostrarMensaje(`${nombreItem} eliminado del carrito`, 'warning');
    });
    
    // Disminuir cantidad
    $('.disminuir-cantidad').click(function() {
        const fila = $(this).closest('tr');
        const id = fila.data('id');
        const itemIndex = carrito.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            // Disminuir cantidad
            if (carrito[itemIndex].cantidad > 1) {
                carrito[itemIndex].cantidad -= 1;
                
                // Actualizar localStorage
                localStorage.setItem('carrito', JSON.stringify(carrito));
                
                // Actualizar interfaz
                actualizarContadorCarrito();
                mostrarProductosCarrito();
            }
        }
    });
    
    // Aumentar cantidad
    $('.aumentar-cantidad').click(function() {
        const fila = $(this).closest('tr');
        const id = fila.data('id');
        const itemIndex = carrito.findIndex(item => item.id === id);
        
        if (itemIndex > -1) {
            // Aumentar cantidad
            carrito[itemIndex].cantidad += 1;
            
            // Actualizar localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
            
            // Actualizar interfaz
            actualizarContadorCarrito();
            mostrarProductosCarrito();
        }
    });
    
    // Vaciar carrito
    $('#vaciar-carrito').click(function() {
        vaciarCarrito();
    });
}

// Función para vaciar el carrito completamente
function vaciarCarrito() {
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    if ($('#carrito-container').length > 0) {
        mostrarProductosCarrito();
    }
    
    mostrarMensaje('Carrito vaciado', 'info');
}

// Procesamiento del pago
$(document).ready(function() {
    $('#proceder-pago').click(function() {
        if (carrito.length === 0) {
            mostrarMensaje('Tu carrito está vacío', 'warning');
            return;
        }
        
        // Aquí iría la lógica para procesar el pago
        mostrarMensaje('Procesando pago...', 'info');
        
        // Simular procesamiento de pago exitoso después de 2 segundos
        setTimeout(function() {
            mostrarMensaje('¡Pago completado con éxito!', 'success');
            vaciarCarrito();
            
            // Redirigir a página de confirmación o mostrar mensaje de éxito
            setTimeout(function() {
                alert('¡Gracias por tu compra! Tu pedido ha sido procesado correctamente.');
                window.location.href = 'index.html';
            }, 2000);
        }, 2000);
    });
});