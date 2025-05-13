let carrito = [];
const listaServicios = document.getElementById('lista-servicios');
const tablaCarrito = document.getElementById('tabla-carrito');
const totalSpan = document.getElementById('total');
const nombreCliente = document.getElementById('nombre');
const telefonoCliente = document.getElementById('telefono');

function agregarAlCarrito() {
  const servicioSeleccionado = listaServicios.value;
  const precio = parseFloat(listaServicios.selectedOptions[0].getAttribute('data-precio'));

  if (!servicioSeleccionado) return;

  carrito.push({ servicio: servicioSeleccionado, precio });
  actualizarTabla();
}

function actualizarTabla() {
  tablaCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.price ?? item.precio;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${item.servicio}</td>
      <td>RD$ ${item.precio.toFixed(2)}</td>
      <td><button onclick="eliminarItem(${index})">❌</button></td>
    `;
    tablaCarrito.appendChild(fila);
  });

  totalSpan.textContent = total.toFixed(2);
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  actualizarTabla();
}

function generarFacturaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Jireh Beauty Salón Nails Bar", 20, 20);
  doc.setFontSize(12);
  doc.text(`Cliente: ${nombreCliente.value}`, 20, 30);
  doc.text(`Teléfono: ${telefonoCliente.value}`, 20, 38);
  doc.text("Detalle de Servicios", 20, 50);

  let y = 60;
  let total = 0;

  carrito.forEach((item) => {
    doc.text(`- ${item.servicio} | RD$ ${item.precio.toFixed(2)}`, 20, y);
    y += 8;
    total += item.precio;
  });

  doc.setFont("helvetica", "bold");
  doc.text(`Total: RD$ ${total.toFixed(2)}`, 20, y + 10);

  doc.save(`Factura_${nombreCliente.value}.pdf`);
}

function enviarPorWhatsapp() {
  const numero = telefonoCliente.value;
  if (!numero) {
    alert("Debes ingresar un número de teléfono.");
    return;
  }

  let mensaje = `*Jireh Beauty Salón Nails Bar*\n\nFactura para: *${nombreCliente.value}*\n`;
  mensaje += "Servicios:\n";

  let total = 0;

  carrito.forEach(item => {
    mensaje += `- ${item.servicio}: RD$ ${item.precio.toFixed(2)}\n`;
    total += item.precio;
  });

  mensaje += `\n*Total: RD$ ${total.toFixed(2)}*`;

  const link = `https://wa.me/1${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(link, '_blank');
}

function imprimirFactura() {
  window.print();
}
