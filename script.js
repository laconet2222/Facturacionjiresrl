document.getElementById('invoiceForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const cliente = document.getElementById('cliente').value;
  const telefono = document.getElementById('telefono').value;
  const items = document.getElementById('items').value;
  const total = document.getElementById('total').value;

  // Crear el mensaje para WhatsApp
  const mensaje = `Hola ${cliente}, gracias por visitarnos. Tu factura:\n${items}\nTotal: RD$${total}`;
  const link = `https://api.whatsapp.com/send?phone=1${telefono}&text=${encodeURIComponent(mensaje)}`;

  // Abrir WhatsApp con el mensaje
  window.open(link, '_blank');

  // Guardar la factura en el historial
  const factura = {
    cliente,
    telefono,
    items,
    total,
    mensaje,
    fecha: new Date().toLocaleString()
  };

  // Obtener historial de facturas (si existe)
  let historial = JSON.parse(localStorage.getItem('historial')) || [];
  historial.push(factura);
  localStorage.setItem('historial', JSON.stringify(historial));

  // Mostrar el historial en la página
  mostrarHistorial();

  // Resetear el formulario
  document.getElementById('invoiceForm').reset();
});

// Función para mostrar el historial de facturas
function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem('historial')) || [];
  const historialList = document.getElementById('historialList');
  historialList.innerHTML = '';

  historial.forEach(factura => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${factura.cliente}</strong> - RD$${factura.total} 
      <br><em>${factura.fecha}</em> 
      <br><small>Detalles: ${factura.items}</small>
    `;
    historialList.appendChild(li);
  });
}

// Mostrar historial al cargar la página
mostrarHistorial();
