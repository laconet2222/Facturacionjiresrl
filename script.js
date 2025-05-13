document.getElementById('invoiceForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const cliente = document.getElementById('cliente').value;
  const telefono = document.getElementById('telefono').value;
  const items = document.getElementById('items').value;
  const total = document.getElementById('total').value;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Encabezado con estilo
  doc.setFillColor(0, 123, 255);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("Jireh Beauty Salón Nails Bar", 10, 14);

  // Información del cliente
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Cliente: ${cliente}`, 10, 30);
  doc.text(`Teléfono: ${telefono}`, 10, 38);

  // Detalles del servicio
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.rect(10, 45, 190, 40);
  const lines = doc.splitTextToSize(items, 180);
  doc.setFontSize(12);
  doc.text("Servicios / Productos:", 12, 50);
  doc.text(lines, 12, 58);

  // Total
  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text(`Total: RD$ ${total}`, 10, 95);

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Gracias por preferirnos - www.jirehbeautysalon.com", 10, 280);

  // Descargar PDF
  const pdfData = doc.output('blob');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdfData);
  link.download = `Factura_${cliente}_${new Date().toISOString()}.pdf`;
  link.click();

  // Enviar por WhatsApp
  const mensaje = `Factura enviada a ${cliente}\\nTotal: RD$ ${total}\\nServicios: ${items}\\nJireh Beauty Salón Nails Bar`;
  const whatsappURL = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, '_blank');

  const factura = {
    cliente,
    telefono,
    items,
    total,
    mensaje: `Factura enviada a ${cliente}`,
    fecha: new Date().toLocaleString()
  };

  let historial = JSON.parse(localStorage.getItem('historial')) || [];
  historial.push(factura);
  localStorage.setItem('historial', JSON.stringify(historial));

  mostrarHistorial();
  document.getElementById('invoiceForm').reset();
});

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem('historial')) || [];
  const historialList = document.getElementById('historialList');
  historialList.innerHTML = '';

  historial.forEach(factura => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${factura.cliente}</strong> - RD$${factura.total} 
      <br><em>${factura.fecha}</em>
    `;
    historialList.appendChild(li);
  });
}
