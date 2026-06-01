// Trang hóa đơn: xây dựng đơn hàng từ xe và phụ tùng, tính toán tự động, lưu trữ lịch sử và xuất PDF.
const invoiceIdInput = document.getElementById('invoice-id');
const invoiceDateInput = document.getElementById('invoice-date');
const customerNameInput = document.getElementById('customer-name');
const customerPhoneInput = document.getElementById('customer-phone');
const customerAddressInput = document.getElementById('customer-address');
const bikeSelect = document.getElementById('bike-select');
const partSelect = document.getElementById('part-select');
const bikeQtyInput = document.getElementById('bike-qty');
const partQtyInput = document.getElementById('part-qty');
const addBikeInvoiceButton = document.getElementById('add-bike-invoice');
const addPartInvoiceButton = document.getElementById('add-part-invoice');
const invoiceItemsBody = document.getElementById('invoice-items-body');
const saveInvoiceButton = document.getElementById('save-invoice');
const printInvoiceButton = document.getElementById('print-invoice');
const pdfInvoiceButton = document.getElementById('pdf-invoice');
const resetInvoiceButton = document.getElementById('reset-invoice');
const subtotalValue = document.getElementById('subtotal-value');
const vatValue = document.getElementById('vat-value');
const orderDiscountInput = document.getElementById('order-discount');
const shippingFeeInput = document.getElementById('shipping-fee');
const grandTotalValue = document.getElementById('grand-total-value');
const invoiceHistoryBody = document.getElementById('invoice-history-body');

let invoiceItems = [];
let currentInvoice = null;

function createInvoiceNumber() {
  const invoices = getInvoices();
  return `HD-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN');
}

function fillProductOptions() {
  const bikes = getBikes();
  const parts = getParts();
  bikeSelect.innerHTML = '<option value="">Chọn xe máy</option>' + bikes.map(bike => `<option value="${bike.id}">${bike.name} (${formatCurrency(bike.salePrice)})</option>`).join('');
  partSelect.innerHTML = '<option value="">Chọn phụ tùng</option>' + parts.map(part => `<option value="${part.id}">${part.name} (${formatCurrency(part.salePrice)})</option>`).join('');
}

function addItem(type) {
  const id = type === 'bike' ? bikeSelect.value : partSelect.value;
  const quantity = type === 'bike' ? Number(bikeQtyInput.value) : Number(partQtyInput.value);
  if (!id || quantity < 1) return showToast('Vui lòng chọn sản phẩm và số lượng hợp lệ.', 'danger');
  const products = type === 'bike' ? getBikes() : getParts();
  const product = products.find(item => item.id === id);
  if (!product) return showToast('Sản phẩm không tồn tại.', 'danger');
  const existing = invoiceItems.find(item => item.id === id && item.type === type);
  if (existing) {
    existing.quantity += quantity;
    existing.total = existing.quantity * existing.unitPrice;
  } else {
    invoiceItems.push({
      id: product.id,
      type,
      name: product.name,
      sku: product.id,
      quantity,
      unitPrice: type === 'bike' ? product.salePrice : product.salePrice,
      total: quantity * product.salePrice
    });
  }
  renderInvoiceItems();
  calculateTotals();
  showToast('Đã thêm sản phẩm vào hóa đơn.');
}

function renderInvoiceItems() {
  invoiceItemsBody.innerHTML = invoiceItems.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.sku}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.unitPrice)}</td>
      <td>${formatCurrency(item.total)}</td>
      <td class="no-print"><button class="btn btn-sm btn-outline-danger" onclick="removeInvoiceItem(${index})"><i class="fas fa-trash"></i></button></td>
    </tr>
  `).join('');
}

function removeInvoiceItem(index) {
  invoiceItems.splice(index, 1);
  renderInvoiceItems();
  calculateTotals();
}

function calculateTotals() {
  const subtotal = invoiceItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const discountPercent = Number(orderDiscountInput.value) || 0;
  const shipping = Number(shippingFeeInput.value) || 0;
  const vat = Math.round(subtotal * 0.1);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal + vat + shipping - discountAmount;
  subtotalValue.textContent = formatCurrency(subtotal);
  vatValue.textContent = formatCurrency(vat);
  grandTotalValue.textContent = formatCurrency(total);
  return { subtotal, vat, shipping, discountPercent, total };
}

function saveInvoice() {
  if (!customerNameInput.value.trim()) return showToast('Vui lòng nhập họ tên khách hàng.', 'danger');
  if (!customerPhoneInput.value.trim()) return showToast('Vui lòng nhập số điện thoại.', 'danger');
  if (invoiceItems.length === 0) return showToast('Hóa đơn phải có ít nhất 1 sản phẩm.', 'danger');
  const invoices = getInvoices();
  const totals = calculateTotals();
  const invoice = {
    id: invoiceIdInput.value || createInvoiceNumber(),
    date: invoiceDateInput.value || new Date().toISOString().split('T')[0],
    customerName: customerNameInput.value.trim(),
    customerPhone: customerPhoneInput.value.trim(),
    customerAddress: customerAddressInput.value.trim(),
    items: invoiceItems,
    subtotal: totals.subtotal,
    vat: totals.vat,
    shipping: totals.shipping,
    discount: totals.discountPercent,
    total: totals.total
  };
  invoices.unshift(invoice);
  saveInvoices(invoices);
  saveDraftInvoice({});
  renderInvoiceHistory();
  showToast('Lưu hóa đơn thành công.', 'success');
}

function renderInvoiceHistory() {
  const invoices = getInvoices();
  invoiceHistoryBody.innerHTML = invoices.map((invoice, idx) => `
    <tr>
      <td>${formatDate(invoice.date)}</td>
      <td>${invoice.id}</td>
      <td>${invoice.customerName}</td>
      <td>${formatCurrency(invoice.total)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="loadInvoice(${idx})"><i class="fas fa-eye"></i></button>
      </td>
    </tr>
  `).join('');
}

function loadInvoice(index) {
  const invoices = getInvoices();
  const invoice = invoices[index];
  if (!invoice) return;
  invoiceIdInput.value = invoice.id;
  invoiceDateInput.value = invoice.date;
  customerNameInput.value = invoice.customerName;
  customerPhoneInput.value = invoice.customerPhone;
  customerAddressInput.value = invoice.customerAddress;
  invoiceItems = invoice.items.map(item => ({ ...item }));
  renderInvoiceItems();
  orderDiscountInput.value = invoice.discount || 0;
  shippingFeeInput.value = invoice.shipping || 0;
  calculateTotals();
  showToast('Đã tải lại hóa đơn từ lịch sử.', 'info');
}

function resetInvoice() {
  invoiceItems = [];
  invoiceIdInput.value = createInvoiceNumber();
  invoiceDateInput.value = new Date().toISOString().split('T')[0];
  customerNameInput.value = '';
  customerPhoneInput.value = '';
  customerAddressInput.value = '';
  bikeSelect.value = '';
  partSelect.value = '';
  bikeQtyInput.value = 1;
  partQtyInput.value = 1;
  orderDiscountInput.value = 0;
  shippingFeeInput.value = 0;
  renderInvoiceItems();
  calculateTotals();
  saveDraftInvoice({});
}

function exportToPdf() {
  const element = document.querySelector('.invoice-panel');
  if (!element || !window.html2pdf) {
    return showToast('Không thể xuất PDF lúc này.', 'danger');
  }
  html2pdf().from(element).set({
    margin: 0.4,
    filename: `${invoiceIdInput.value || 'invoice'}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).save();
}

function addBikeToInvoice(event) {
  event.preventDefault();
  addItem('bike');
}

function addPartToInvoice(event) {
  event.preventDefault();
  addItem('part');
}

function initInvoicePage() {
  invoiceIdInput.value = createInvoiceNumber();
  invoiceDateInput.value = new Date().toISOString().split('T')[0];
  fillProductOptions();
  const bikeId = new URLSearchParams(window.location.search).get('bikeId');
  if (bikeId) {
    bikeSelect.value = bikeId;
    addItem('bike');
  }
  const draft = getDraftInvoice();
  if (draft && draft.items && draft.items.length) {
    invoiceItems = draft.items;
    invoiceIdInput.value = draft.id || invoiceIdInput.value;
    renderInvoiceItems();
  }
  calculateTotals();
  renderInvoiceHistory();
}

window.removeInvoiceItem = removeInvoiceItem;
window.loadInvoice = loadInvoice;

addBikeInvoiceButton.addEventListener('click', addBikeToInvoice);
addPartInvoiceButton.addEventListener('click', addPartToInvoice);
saveInvoiceButton.addEventListener('click', saveInvoice);
printInvoiceButton.addEventListener('click', () => window.print());
pdfInvoiceButton.addEventListener('click', exportToPdf);
resetInvoiceButton.addEventListener('click', resetInvoice);
orderDiscountInput.addEventListener('input', calculateTotals);
shippingFeeInput.addEventListener('input', calculateTotals);

document.addEventListener('DOMContentLoaded', initInvoicePage);
