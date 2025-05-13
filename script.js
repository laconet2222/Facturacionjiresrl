
document.getElementById('invoiceForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const cliente = document.getElementById('cliente').value;
  const telefono = document.getElementById('telefono').value;
  const items = document.getElementById('items').value;
  const total = document.getElementById('total').value;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Factura Electrónica", 20, 20);
  doc.setFontSize(14);
  doc.text(`Nombre del Cliente: ${cliente}`, 20, 30);
  doc.text(`Teléfono: ${telefono}`, 20, 40);
  doc.text("Detalles de la Factura:", 20, 50);
  doc.text(items, 20, 60);
  doc.text(`Total: RD$ ${total}`, 20, 70);
  doc.text("Jireh Beauty Salón Nails Bar", 20, 80);
  doc.text("www.jirehbeautysalon.com", 20, 90);

  const pdfData = doc.output('blob');

  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdfData);
  link.download = `Factura_${cliente}_${new Date().toISOString()}.pdf`;
  link.click();

  const mensaje = `Factura enviada a ${cliente}\nDetalles: ${items}\nTotal: RD$ ${total}\nJireh Beauty Salón Nails Bar`;
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
