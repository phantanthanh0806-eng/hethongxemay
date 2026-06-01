// Trang chi tiết xe: đọc tham số id trên URL và hiển thị thông tin chi tiết, hình ảnh và đánh giá.
function getQueryParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const detailName = document.getElementById('detail-name');
const detailBrand = document.getElementById('detail-brand');
const detailType = document.getElementById('detail-type');
const detailPrice = document.getElementById('detail-price');
const detailDescription = document.getElementById('detail-description');
const detailColor = document.getElementById('detail-color');
const detailYear = document.getElementById('detail-year');
const detailEngine = document.getElementById('detail-engine');
const detailStock = document.getElementById('detail-stock');
const detailMainImage = document.getElementById('detail-main-image');
const detailThumbs = document.getElementById('detail-thumbs');
const detailReviews = document.getElementById('detail-reviews');
const buyNowButton = document.getElementById('buy-now-button');
const addInvoiceButton = document.getElementById('add-invoice-button');

let currentBike = null;

function renderBikeDetail() {
  const bikeId = getQueryParameter('id');
  if (!bikeId) {
    detailName.textContent = 'Xe chưa được chọn';
    detailDescription.textContent = 'Vui lòng quay lại danh sách để chọn xe.';
    buyNowButton.disabled = true;
    addInvoiceButton.disabled = true;
    return;
  }
  const bike = getBikes().find(item => item.id === bikeId);
  if (!bike) {
    detailName.textContent = 'Xe không tồn tại';
    detailDescription.textContent = 'Mẫu xe bạn chọn không còn trong hệ thống.';
    buyNowButton.disabled = true;
    addInvoiceButton.disabled = true;
    return;
  }
  currentBike = bike;
  detailMainImage.src = bike.image;
  detailName.textContent = bike.name;
  detailBrand.textContent = bike.brand;
  detailType.textContent = bike.type;
  detailPrice.textContent = formatCurrency(bike.salePrice);
  detailDescription.textContent = bike.description;
  detailColor.textContent = bike.color;
  detailYear.textContent = bike.year;
  detailEngine.textContent = bike.engine;
  detailStock.textContent = bike.stock;
  detailBrand.className = 'badge bg-primary me-2';
  detailType.className = 'badge bg-secondary';
  detailThumbs.innerHTML = bike.gallery.map((src, index) => `
    <img src="${src}" alt="${bike.name} ${index + 1}" class="${index === 0 ? 'active' : ''}" onclick="updateMainImage('${src}', this)" />
  `).join('');
  renderReviews(bike.reviews);
}

function updateMainImage(src, thumb) {
  detailMainImage.src = src;
  detailThumbs.querySelectorAll('img').forEach(img => img.classList.remove('active'));
  thumb.classList.add('active');
}

function renderReviews(reviews) {
  if (!reviews || !reviews.length) {
    detailReviews.innerHTML = '<p class="text-muted">Chưa có đánh giá.</p>';
    return;
  }
  detailReviews.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>${review.name}</strong>
        <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
      </div>
      <p class="mb-0">${review.comment}</p>
    </div>
  `).join('');
}

function addToDraft() {
  if (!currentBike) return;
  const draft = getDraftInvoice();
  const items = draft.items || [];
  const existed = items.find(item => item.id === currentBike.id && item.type === 'bike');
  if (existed) {
    existed.quantity += 1;
  } else {
    items.push({
      id: currentBike.id,
      type: 'bike',
      name: currentBike.name,
      sku: currentBike.id,
      unitPrice: currentBike.salePrice,
      quantity: 1,
      total: currentBike.salePrice
    });
  }
  draft.items = items;
  draft.id = draft.id || `HD-${new Date().getFullYear()}-${String(getInvoices().length + 1).padStart(3, '0')}`;
  saveDraftInvoice(draft);
  showToast('Đã thêm xe vào hóa đơn tạm.', 'success');
}

function buyNow() {
  if (!currentBike) return;
  window.location.href = `hoa-don.html?bikeId=${currentBike.id}`;
}

window.updateMainImage = updateMainImage;
buyNowButton.addEventListener('click', buyNow);
addInvoiceButton.addEventListener('click', addToDraft);

document.addEventListener('DOMContentLoaded', renderBikeDetail);
