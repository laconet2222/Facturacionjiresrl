// script.js
let items = [];

function agregarItem() {
  const nombre = document.getElementById('itemNombre').value;
  const precio = parseFloat(document.getElementById('itemPrecio').value);

  if (!nombre || isNaN(precio)) return alert("Completa nombre y precio correctamente");

  items.push({ nombre, precio });
  document.getElementById('itemNombre').value = '';
  document.getElementById('itemPrecio').value = '';
  mostrarItems();
}

function mostrarItems() {
  const lista = document.getElementById('itemList');
  lista.innerHTML = '';
  let total = 0;
  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <span>${item.nombre}</span>
      <span>RD$ ${item.precio.toFixed(2)}</span>
    `;
    lista.appendChild(div);
    total += item.precio;
  });
  document.getElementById('totalFactura').textContent = `Total: RD$ ${total.toFixed(2)}`;
}

function generarFacturaPDF(cliente, telefono, items, total) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor(180, 123, 0);
  doc.text("Jireh Beauty Salón", 20, 20);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Cliente: ${cliente}`, 20, 30);
  doc.text(`Teléfono: ${telefono}`, 20, 37);

  let y = 50;
  doc.text("Detalle:", 20, y);
  y += 7;

  items.forEach(item => {
    doc.text(`${item.nombre} - RD$ ${item.precio.toFixed(2)}`, 25, y);
    y += 7;
  });

  y += 5;
  doc.setFontSize(14);
  doc.setTextColor(180, 123, 0);
  doc.text(`Total: RD$ ${total.toFixed(2)}`, 20, y);
  return doc;
}

document.getElementById('invoiceForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const cliente = document.getElementById('cliente').value;
  const telefono = document.getElementById('telefono').value;

  if (!cliente || !telefono || items.length === 0) {
    return alert("Faltan datos o productos");
  }

  const total = items.reduce((acc, val) => acc + val.precio, 0);
  const doc = generarFacturaPDF(cliente, telefono, items, total);

  doc.save(`Factura_${cliente}.pdf`);

  const textoFactura = `Hola ${cliente}, su factura en Jireh Beauty Salón:
` +
    items.map(i => `${i.nombre} - RD$ ${i.precio.toFixed(2)}`).join('\n') +
    `\nTotal: RD$ ${total.toFixed(2)}`;

  const mensaje = encodeURIComponent(textoFactura);
  window.open(`https://wa.me/1${telefono}?text=${mensaje}`, '_blank');

  const historialList = document.getElementById('historialList');
  const li = document.createElement('li');
  li.textContent = `${cliente} - RD$ ${total.toFixed(2)} - ${new Date().toLocaleString()}`;
  historialList.appendChild(li);

  // limpiar
  items = [];
  mostrarItems();
  document.getElementById('invoiceForm').reset();
});
