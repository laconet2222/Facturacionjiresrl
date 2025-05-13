let itemsFactura = [];

function agregarItem() {
  const nombre = document.getElementById("itemNombre").value;
  const precio = parseFloat(document.getElementById("itemPrecio").value);

  if (nombre && !isNaN(precio)) {
    itemsFactura.push({ nombre, precio });
    document.getElementById("itemNombre").value = "";
    document.getElementById("itemPrecio").value = "";
    actualizarLista();
  }
}

function actualizarLista() {
  const lista = document.getElementById("itemList");
  const totalEl = document.getElementById("totalFactura");
  lista.innerHTML = "";

  let total = 0;
  itemsFactura.forEach(item => {
    total += item.precio;
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<span>${item.nombre}</span><span>RD$ ${item.precio.toFixed(2)}</span>`;
    lista.appendChild(div);
  });

  totalEl.innerText = `Total: RD$ ${total.toFixed(2)}`;
}

document.getElementById('invoiceForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const cliente = document.getElementById('cliente').value;
  const telefono = document.getElementById('telefono').value;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFillColor(180, 123, 0);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("Jireh Beauty Salón Nails Bar", 10, 14);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Cliente: ${cliente}`, 10, 30);
  doc.text(`Teléfono: ${telefono}`, 10, 38);

  doc.setFontSize(13);
  doc.text("Servicios / Productos:", 10, 50);
  let y = 58;
  let total = 0;
  itemsFactura.forEach(item => {
    doc.text(`- ${item.nombre} - RD$ ${item.precio.toFixed(2)}`, 12, y);
    y += 8;
    total += item.precio;
  });

  doc.setFontSize(14);
  doc.setTextColor(180, 123, 0);
  doc.text(`Total: RD$ ${total.toFixed(2)}`, 10, y + 10);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Gracias por preferirnos - www.jirehbeautysalon.com", 10, 280);

  const pdfData = doc.output('blob');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdfData);
  link.download = `Factura_${cliente}.pdf`;
  link.click();

  const mensaje = `Factura de Jireh Beauty Salón para ${cliente}\\nTotal: RD$ ${total.toFixed(2)}\\n¡Gracias por preferirnos!`;
  const whatsappURL = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, '_blank');

  const factura = {
    cliente,
    telefono,
    items: itemsFactura,
    total,
    fecha: new Date().toLocaleString()
  };

  let historial = JSON.parse(localStorage.getItem('historial')) || [];
  historial.push(factura);
  localStorage.setItem('historial', JSON.stringify(historial));

  mostrarHistorial();
  itemsFactura = [];
  document.getElementById('invoiceForm').reset();
  actualizarLista();
});

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem('historial')) || [];
  const historialList = document.getElementById('historialList');
  historialList.innerHTML = '';

  historial.forEach(factura => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${factura.cliente}</strong> - RD$${factura.total.toFixed(2)}
      <br><em>${factura.fecha}</em>
    `;
    historialList.appendChild(li);
  });
}

mostrarHistorial();
