// Trang danh sách xe: lọc, sắp xếp, phân trang và CRUD cho dữ liệu xe máy.
const BIKE_PER_PAGE = 6;
let currentBikePage = 1;
let filteredBikes = [];

const bikeSearchInput = document.getElementById('bike-search');
const brandFilterSelect = document.getElementById('brand-filter');
const priceFilterInput = document.getElementById('price-filter');
const priceMaxLabel = document.getElementById('price-max-label');
const priceSortSelect = document.getElementById('price-sort');
const resetBikeFilterButton = document.getElementById('reset-bike-filter');
const bikeTableBody = document.getElementById('bike-table-body');
const bikePagination = document.getElementById('bike-pagination');
const bikeCountElement = document.getElementById('bike-count');

const bikeModal = document.getElementById('bikeModal');
const bikeForm = document.getElementById('bike-form');
const bikeIdInput = document.getElementById('bike-id');
const bikeCodeInput = document.getElementById('bike-code');
const bikeNameInput = document.getElementById('bike-name');
const bikeBrandInput = document.getElementById('bike-brand');
const bikeTypeInput = document.getElementById('bike-type');
const bikeEngineInput = document.getElementById('bike-engine');
const bikeColorInput = document.getElementById('bike-color');
const bikePurchasePriceInput = document.getElementById('bike-purchase-price');
const bikeSalePriceInput = document.getElementById('bike-sale-price');
const bikeStockInput = document.getElementById('bike-stock');
const bikeImageInput = document.getElementById('bike-image');
const bikeDescriptionInput = document.getElementById('bike-description');
const saveBikeButton = document.getElementById('save-bike-button');

function getBikeStatus(stock) {
  return stock > 0 ? 'Còn hàng' : 'Hết hàng';
}

function renderBrandOptions() {
  const bikes = getBikes();
  const brands = [...new Set(bikes.map(bike => bike.brand))].sort();
  brandFilterSelect.innerHTML = '<option value="all">Tất cả</option>' + brands.map(brand => `<option value="${brand}">${brand}</option>`).join('');
}

function renderBikes(bikes, page = 1) {
  const start = (page - 1) * BIKE_PER_PAGE;
  const currentData = bikes.slice(start, start + BIKE_PER_PAGE);
  bikeTableBody.innerHTML = currentData.map(bike => `
    <tr>
      <td>${bike.id}</td>
      <td><img src="${bike.image}" alt="${bike.name}" /></td>
      <td>${bike.name}</td>
      <td>${bike.brand}</td>
      <td>${bike.type}</td>
      <td>${bike.color}</td>
      <td>${formatCurrency(bike.purchasePrice)}</td>
      <td>${formatCurrency(bike.salePrice)}</td>
      <td>${bike.stock}</td>
      <td>${getBikeStatus(bike.stock)}</td>
      <td class="table-actions">
        <button class="btn btn-sm btn-outline-primary" onclick="editBike('${bike.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteBike('${bike.id}')"><i class="fas fa-trash"></i></button>
        <a class="btn btn-sm btn-outline-success" href="chi-tiet-xe-may.html?id=${bike.id}"><i class="fas fa-eye"></i></a>
      </td>
    </tr>
  `).join('');
  renderBikePagination(bikes.length, page);
  bikeCountElement.textContent = bikes.length;
}

function renderBikePagination(total, page) {
  const pages = Math.ceil(total / BIKE_PER_PAGE);
  if (pages <= 1) {
    bikePagination.innerHTML = '';
    return;
  }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<li class="page-item ${i === page ? 'active' : ''}"><button class="page-link" onclick="changeBikePage(${i})">${i}</button></li>`;
  }
  bikePagination.innerHTML = `
    <li class="page-item ${page === 1 ? 'disabled' : ''}"><button class="page-link" onclick="changeBikePage(${page - 1})">«</button></li>
    ${html}
    <li class="page-item ${page === pages ? 'disabled' : ''}"><button class="page-link" onclick="changeBikePage(${page + 1})">»</button></li>
  `;
}

function changeBikePage(page) {
  const totalPages = Math.ceil(filteredBikes.length / BIKE_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  currentBikePage = page;
  renderBikes(filteredBikes, currentBikePage);
}

function applyBikeFilter() {
  const bikes = getBikes();
  const keyword = bikeSearchInput.value.trim().toLowerCase();
  const selectedBrand = brandFilterSelect.value;
  const maxPrice = Number(priceFilterInput.value);
  filteredBikes = bikes.filter(bike => {
    const matchesText = bike.name.toLowerCase().includes(keyword) || bike.brand.toLowerCase().includes(keyword) || bike.type.toLowerCase().includes(keyword) || bike.color.toLowerCase().includes(keyword);
    const matchesBrand = selectedBrand === 'all' || bike.brand === selectedBrand;
    const matchesPrice = bike.salePrice <= maxPrice;
    return matchesText && matchesBrand && matchesPrice;
  });
  if (priceSortSelect.value === 'asc') {
    filteredBikes.sort((a, b) => a.salePrice - b.salePrice);
  } else if (priceSortSelect.value === 'desc') {
    filteredBikes.sort((a, b) => b.salePrice - a.salePrice);
  }
  currentBikePage = 1;
  renderBikes(filteredBikes, currentBikePage);
}

function resetBikeFilters() {
  bikeSearchInput.value = '';
  brandFilterSelect.value = 'all';
  priceFilterInput.value = 80000000;
  priceMaxLabel.textContent = '80.000.000';
  priceSortSelect.value = 'default';
  applyBikeFilter();
}

function openBikeModal() {
  bikeIdInput.value = '';
  bikeCodeInput.value = '';
  bikeNameInput.value = '';
  bikeBrandInput.value = 'Honda';
  bikeTypeInput.value = 'Underbone';
  bikeEngineInput.value = '110cc';
  bikeColorInput.value = '';
  bikePurchasePriceInput.value = 0;
  bikeSalePriceInput.value = 0;
  bikeStockInput.value = 0;
  bikeImageInput.value = 'https://via.placeholder.com/640x420/0d6efd/ffffff?text=Xe+may';
  bikeDescriptionInput.value = '';
}

function editBike(id) {
  const bikes = getBikes();
  const bike = bikes.find(item => item.id === id);
  if (!bike) return showToast('Không tìm thấy xe để sửa.', 'danger');
  bikeIdInput.value = bike.id;
  bikeCodeInput.value = bike.id;
  bikeNameInput.value = bike.name;
  bikeBrandInput.value = bike.brand;
  bikeTypeInput.value = bike.type;
  bikeEngineInput.value = bike.engine;
  bikeColorInput.value = bike.color;
  bikePurchasePriceInput.value = bike.purchasePrice;
  bikeSalePriceInput.value = bike.salePrice;
  bikeStockInput.value = bike.stock;
  bikeImageInput.value = bike.image;
  bikeDescriptionInput.value = bike.description;
  const modal = new bootstrap.Modal(bikeModal);
  modal.show();
}

function saveBike() {
  const bikes = getBikes();
  const id = bikeIdInput.value;
  const bikeData = {
    id: id || generateId('XE', bikes),
    name: bikeNameInput.value.trim(),
    brand: bikeBrandInput.value,
    type: bikeTypeInput.value.trim(),
    engine: bikeEngineInput.value.trim(),
    color: bikeColorInput.value.trim(),
    purchasePrice: Number(bikePurchasePriceInput.value),
    salePrice: Number(bikeSalePriceInput.value),
    stock: Number(bikeStockInput.value),
    image: bikeImageInput.value || 'https://via.placeholder.com/640x420/0d6efd/ffffff?text=Xe+may',
    description: bikeDescriptionInput.value.trim(),
    year: new Date().getFullYear(),
    specs: {
      power: 'N/A',
      weight: 'N/A',
      length: 'N/A',
      width: 'N/A',
      height: 'N/A',
      tank: 'N/A',
      consumption: 'N/A'
    },
    reviews: []
  };
  if (!bikeData.name) {
    return showToast('Tên xe không được để trống.', 'danger');
  }
  if (id) {
    const index = bikes.findIndex(item => item.id === id);
    if (index >= 0) {
      bikes[index] = bikeData;
    }
  } else {
    bikes.unshift(bikeData);
  }
  saveBikes(bikes);
  applyBikeFilter();
  renderBrandOptions();
  const modalInstance = bootstrap.Modal.getInstance(bikeModal);
  if (modalInstance) modalInstance.hide();
  showToast('Lưu thông tin xe thành công.');
}

function deleteBike(id) {
  if (!confirm('Bạn có chắc muốn xóa xe này không?')) return;
  const bikes = getBikes().filter(item => item.id !== id);
  saveBikes(bikes);
  applyBikeFilter();
  renderBrandOptions();
  showToast('Xe đã được xóa.', 'success');
}

window.changeBikePage = changeBikePage;
window.editBike = editBike;
window.deleteBike = deleteBike;

saveBikeButton.addEventListener('click', saveBike);
priceFilterInput.addEventListener('input', () => {
  priceMaxLabel.textContent = formatCurrency(Number(priceFilterInput.value)).replace(' ₫', '');
  applyBikeFilter();
});
bikeSearchInput.addEventListener('input', applyBikeFilter);
brandFilterSelect.addEventListener('change', applyBikeFilter);
priceSortSelect.addEventListener('change', applyBikeFilter);
resetBikeFilterButton.addEventListener('click', resetBikeFilters);

function initBikePage() {
  renderBrandOptions();
  resetBikeFilters();
  openBikeModal();
}

document.addEventListener('DOMContentLoaded', initBikePage);
