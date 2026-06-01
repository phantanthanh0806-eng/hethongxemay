// Trang phụ tùng: lọc, sắp xếp, phân trang và CRUD cho dữ liệu phụ tùng.
const PART_PER_PAGE = 8;
let currentPartPage = 1;
let filteredParts = [];

const partSearchInput = document.getElementById('part-search');
const partTypeFilter = document.getElementById('part-type-filter');
const partPriceFilter = document.getElementById('part-price-filter');
const partPriceLabel = document.getElementById('part-price-label');
const partSortSelect = document.getElementById('part-sort');
const resetPartFilterButton = document.getElementById('reset-part-filter');
const partTableBody = document.getElementById('part-table-body');
const partPagination = document.getElementById('part-pagination');
const partCountElement = document.getElementById('part-count');

const partModal = document.getElementById('partModal');
const partForm = document.getElementById('part-form');
const partIdInput = document.getElementById('part-id');
const partCodeInput = document.getElementById('part-code');
const partNameInput = document.getElementById('part-name');
const partTypeInput = document.getElementById('part-type');
const partSupplierInput = document.getElementById('part-supplier');
const partPurchasePriceInput = document.getElementById('part-purchase-price');
const partSalePriceInput = document.getElementById('part-sale-price');
const partStockInput = document.getElementById('part-stock');
const partImageInput = document.getElementById('part-image');
const partDescriptionInput = document.getElementById('part-description');
const savePartButton = document.getElementById('save-part-button');

function fillPartTypeOptions() {
  const parts = getParts();
  const types = [...new Set(parts.map(part => part.type))].sort();
  partTypeFilter.innerHTML = '<option value="all">Tất cả</option>' + types.map(type => `<option value="${type}">${type}</option>`).join('');
}

function renderParts(parts, page = 1) {
  const start = (page - 1) * PART_PER_PAGE;
  const segment = parts.slice(start, start + PART_PER_PAGE);
  partTableBody.innerHTML = segment.map(part => `
    <tr>
      <td>${part.id}</td>
      <td><img src="${part.image}" alt="${part.name}" /></td>
      <td>${part.name}</td>
      <td><span class="badge badge-type">${part.type}</span></td>
      <td>${formatCurrency(part.purchasePrice)}</td>
      <td>${formatCurrency(part.salePrice)}</td>
      <td>${part.stock}</td>
      <td>${part.supplier}</td>
      <td class="action-buttons">
        <button class="btn btn-sm btn-outline-primary" onclick="editPart('${part.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deletePart('${part.id}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
  renderPartPagination(parts.length, page);
  partCountElement.textContent = `${parts.length} phụ tùng`;
}

function renderPartPagination(total, page) {
  const pages = Math.ceil(total / PART_PER_PAGE);
  if (pages <= 1) {
    partPagination.innerHTML = '';
    return;
  }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<li class="page-item ${i === page ? 'active' : ''}"><button class="page-link" onclick="changePartPage(${i})">${i}</button></li>`;
  }
  partPagination.innerHTML = `
    <li class="page-item ${page === 1 ? 'disabled' : ''}"><button class="page-link" onclick="changePartPage(${page - 1})">«</button></li>
    ${html}
    <li class="page-item ${page === pages ? 'disabled' : ''}"><button class="page-link" onclick="changePartPage(${page + 1})">»</button></li>
  `;
}

function changePartPage(page) {
  const pages = Math.ceil(filteredParts.length / PART_PER_PAGE);
  if (page < 1 || page > pages) return;
  currentPartPage = page;
  renderParts(filteredParts, currentPartPage);
}

function applyPartFilter() {
  const parts = getParts();
  const keyword = partSearchInput.value.trim().toLowerCase();
  const selectedType = partTypeFilter.value;
  const maxPrice = Number(partPriceFilter.value);
  filteredParts = parts.filter(part => {
    const matchesText = part.name.toLowerCase().includes(keyword) || part.type.toLowerCase().includes(keyword) || part.supplier.toLowerCase().includes(keyword);
    const matchesType = selectedType === 'all' || part.type === selectedType;
    const matchesPrice = part.salePrice <= maxPrice;
    return matchesText && matchesType && matchesPrice;
  });
  if (partSortSelect.value === 'asc') {
    filteredParts.sort((a, b) => a.salePrice - b.salePrice);
  } else if (partSortSelect.value === 'desc') {
    filteredParts.sort((a, b) => b.salePrice - a.salePrice);
  }
  currentPartPage = 1;
  renderParts(filteredParts, currentPartPage);
}

function resetPartFilter() {
  partSearchInput.value = '';
  partTypeFilter.value = 'all';
  partPriceFilter.value = 1000000;
  partPriceLabel.textContent = '1.000.000 đ';
  partSortSelect.value = 'default';
  applyPartFilter();
}

function openPartModal() {
  partIdInput.value = '';
  partCodeInput.value = '';
  partNameInput.value = '';
  partTypeInput.value = 'Lốp xe';
  partSupplierInput.value = '';
  partPurchasePriceInput.value = 0;
  partSalePriceInput.value = 0;
  partStockInput.value = 0;
  partImageInput.value = 'https://via.placeholder.com/300x220/0d6efd/ffffff?text=Phu+tung';
  partDescriptionInput.value = '';
}

function editPart(id) {
  const parts = getParts();
  const part = parts.find(item => item.id === id);
  if (!part) return showToast('Không tìm thấy phụ tùng.', 'danger');
  partIdInput.value = part.id;
  partCodeInput.value = part.id;
  partNameInput.value = part.name;
  partTypeInput.value = part.type;
  partSupplierInput.value = part.supplier;
  partPurchasePriceInput.value = part.purchasePrice;
  partSalePriceInput.value = part.salePrice;
  partStockInput.value = part.stock;
  partImageInput.value = part.image;
  partDescriptionInput.value = part.description;
  const modal = new bootstrap.Modal(partModal);
  modal.show();
}

function savePart() {
  const parts = getParts();
  const id = partIdInput.value;
  const partData = {
    id: id || generateId('PT', parts),
    name: partNameInput.value.trim(),
    type: partTypeInput.value,
    supplier: partSupplierInput.value.trim(),
    purchasePrice: Number(partPurchasePriceInput.value),
    salePrice: Number(partSalePriceInput.value),
    stock: Number(partStockInput.value),
    image: partImageInput.value || 'https://via.placeholder.com/300x220/0d6efd/ffffff?text=Phu+tung',
    description: partDescriptionInput.value.trim()
  };
  if (!partData.name) return showToast('Tên phụ tùng không được để trống.', 'danger');
  if (id) {
    const index = parts.findIndex(item => item.id === id);
    if (index >= 0) parts[index] = partData;
  } else {
    parts.unshift(partData);
  }
  saveParts(parts);
  fillPartTypeOptions();
  applyPartFilter();
  const modalInstance = bootstrap.Modal.getInstance(partModal);
  if (modalInstance) modalInstance.hide();
  showToast('Lưu phụ tùng thành công.', 'success');
}

function deletePart(id) {
  if (!confirm('Bạn có chắc muốn xóa phụ tùng này không?')) return;
  const parts = getParts().filter(item => item.id !== id);
  saveParts(parts);
  fillPartTypeOptions();
  applyPartFilter();
  showToast('Phụ tùng đã được xóa.', 'success');
}

window.changePartPage = changePartPage;
window.editPart = editPart;
window.deletePart = deletePart;

savePartButton.addEventListener('click', savePart);
partPriceFilter.addEventListener('input', () => {
  partPriceLabel.textContent = formatCurrency(Number(partPriceFilter.value)).replace(' ₫', '');
  applyPartFilter();
});
partSearchInput.addEventListener('input', applyPartFilter);
partTypeFilter.addEventListener('change', applyPartFilter);
partSortSelect.addEventListener('change', applyPartFilter);
resetPartFilterButton.addEventListener('click', resetPartFilter);

document.addEventListener('DOMContentLoaded', () => {
  fillPartTypeOptions();
  resetPartFilter();
  openPartModal();
});
