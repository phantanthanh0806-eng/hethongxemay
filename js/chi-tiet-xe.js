/**
 * js/chi-tiet-xe.js
 * Hiển thị thông tin chi tiết một xe máy
 * Thêm vào Hóa Đơn (Giỏ hàng)
 * Quản lý Đánh giá
 */

let currentXe = null;
let toastNotif;

document.addEventListener('DOMContentLoaded', function() {
  toastNotif = new bootstrap.Toast(document.getElementById('liveToast'));
  
  // Cập nhật số lượng giỏ hàng trên Navbar
  updateCartBadge();

  // Lấy ID từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const xeId = urlParams.get('id');

  if (!xeId) {
    showError();
    return;
  }

  // Lấy dữ liệu
  const danhSachXe = getXeMay();
  currentXe = danhSachXe.find(x => x.id === xeId);

  if (!currentXe) {
    showError();
    return;
  }

  // Nếu tìm thấy, render UI
  setTimeout(() => {
    document.getElementById('loadingSection').classList.add('d-none');
    document.getElementById('detailSection').classList.remove('d-none');
    renderXeDetails();
    setupEventListeners();
  }, 300); // Fake delay loading cho đẹp
});

function showError() {
  document.getElementById('loadingSection').classList.add('d-none');
  document.getElementById('errorSection').classList.remove('d-none');
}

/**
 * Hiển thị dữ liệu lên giao diện
 */
function renderXeDetails() {
  const xe = currentXe;
  
  // Breadcrumb
  document.getElementById('bcTenXe').innerText = xe.ten;

  // Basic Info
  document.getElementById('txtHangVaLoai').innerText = `${xe.hang} • ${xe.loai}`;
  document.getElementById('txtTenXe').innerText = xe.ten;
  document.getElementById('txtMaXe').innerText = xe.id;
  document.getElementById('txtGiaBan').innerText = formatCurrency(xe.giaBan);
  document.getElementById('txtMauSac').innerText = xe.mau;
  document.getElementById('txtNamSx').innerText = xe.namSx || 'Đang cập nhật';
  document.getElementById('txtDungTich').innerText = xe.dungTich || 'Đang cập nhật';
  document.getElementById('txtTonKho').innerText = xe.tonKho + ' chiếc';

  // Trạng thái badge
  const badge = document.getElementById('badgeStatus');
  badge.innerText = xe.trangThai;
  if (xe.tonKho === 0 || xe.trangThai !== 'Còn hàng') {
    badge.classList.add('out-stock');
    document.getElementById('btnAddToCart').disabled = true;
    if(xe.tonKho === 0) badge.innerText = 'Hết hàng';
  }

  // Hình ảnh
  const mainImg = document.getElementById('imgMain');
  mainImg.src = xe.hinhAnh;
  mainImg.onerror = function() { this.src = 'https://via.placeholder.com/600x400?text=No+Image'; };

  // Generate Thumbnail giả lập (Sử dụng ảnh thật nhưng clone ra vài bản cho đẹp UI)
  const thumbContainer = document.getElementById('thumbList');
  thumbContainer.innerHTML = `
    <div class="col-3">
      <img src="${xe.hinhAnh}" class="active thumb-img" onclick="changeImage(this)">
    </div>
    <div class="col-3">
      <img src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=200&q=80" class="thumb-img" onclick="changeImage(this)">
    </div>
    <div class="col-3">
      <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80" class="thumb-img" onclick="changeImage(this)">
    </div>
    <div class="col-3">
      <img src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=200&q=80" class="thumb-img" onclick="changeImage(this)">
    </div>
  `;

  // Tabs: Mô tả
  document.getElementById('txtMoTaContent').innerHTML = (xe.mota || 'Đang cập nhật mô tả...').replace(/\n/g, '<br>');

  // Tabs: Thông số kỹ thuật
  if (xe.thongSo) {
    document.getElementById('specCongSuat').innerText = xe.thongSo.congSuat || 'Đang cập nhật';
    document.getElementById('specTrongLuong').innerText = xe.thongSo.trongLuong || 'Đang cập nhật';
    document.getElementById('specKichThuoc').innerText = `${xe.thongSo.chieuDai} x ${xe.thongSo.chieuRong} x ${xe.thongSo.chieuCao}` || 'Đang cập nhật';
    document.getElementById('specBinhXang').innerText = xe.thongSo.dungTichBinh || 'Đang cập nhật';
    document.getElementById('specTieuHao').innerText = xe.thongSo.mucTieuHao || 'Đang cập nhật';
  }

  // Reviews
  renderReviews();
}

/**
 * Hiệu ứng chuyển ảnh lớn khi bấm ảnh nhỏ
 */
window.changeImage = function(element) {
  // Thay đổi ảnh chính
  document.getElementById('imgMain').src = element.src;
  
  // Xóa class active ở tất cả thumb
  document.querySelectorAll('.thumb-img').forEach(img => img.classList.remove('active'));
  // Thêm class active cho ảnh được chọn
  element.classList.add('active');
}

/**
 * Hiển thị danh sách Đánh giá
 */
function renderReviews() {
  const reviews = currentXe.danhGia || [];
  const container = document.getElementById('reviewsList');
  
  // Update Header count
  document.getElementById('txtTotalReviews').innerText = `(${reviews.length} đánh giá)`;
  document.getElementById('tabReviewCount').innerText = reviews.length;

  // Tính trung bình sao
  let avgStar = 0;
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, rev) => acc + rev.sao, 0);
    avgStar = Math.round(sum / reviews.length);
  }

  // Hiển thị sao trung bình
  const ratingContainer = document.getElementById('txtRatingAvg');
  ratingContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= avgStar) {
      ratingContainer.innerHTML += '<i class="fa-solid fa-star text-warning"></i>';
    } else {
      ratingContainer.innerHTML += '<i class="fa-regular fa-star text-warning"></i>';
    }
  }

  // Render list
  if (reviews.length === 0) {
    container.innerHTML = '<p class="text-muted fst-italic">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>';
    return;
  }

  container.innerHTML = '';
  reviews.forEach(rev => {
    // Tạo sao cho từng review
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += i <= rev.sao 
        ? '<i class="fa-solid fa-star text-warning"></i>' 
        : '<i class="fa-regular fa-star text-warning"></i>';
    }

    // Lấy chữ cái đầu của tên làm avatar
    const firstLetter = rev.ten.charAt(0).toUpperCase();

    container.innerHTML += `
      <div class="review-item d-flex">
        <div class="avatar-circle me-3 flex-shrink-0">${firstLetter}</div>
        <div>
          <h6 class="mb-1 fw-bold">${rev.ten}</h6>
          <div class="mb-2" style="font-size: 0.85rem;">
            ${starsHtml}
            <span class="text-muted ms-2">${rev.ngay ? formatDate(rev.ngay) : ''}</span>
          </div>
          <p class="mb-0 text-muted">${rev.nhanXet}</p>
        </div>
      </div>
    `;
  });
}

/**
 * Đăng ký các sự kiện tương tác
 */
function setupEventListeners() {
  // Nút Quay lại
  document.getElementById('btnBack').addEventListener('click', () => {
    window.history.back();
  });

  // Nút Thêm vào Hóa Đơn
  document.getElementById('btnAddToCart').addEventListener('click', addToCart);

  // Xử lý Star Rating Input
  const stars = document.querySelectorAll('#starInput i');
  const inpRating = document.getElementById('inpRatingStar');

  stars.forEach(star => {
    // Hover effect
    star.addEventListener('mouseover', function() {
      const val = parseInt(this.getAttribute('data-val'));
      highlightStars(stars, val);
    });

    // Mouseout effect (quay lại giá trị đã chọn)
    star.addEventListener('mouseout', function() {
      const currentVal = parseInt(inpRating.value);
      highlightStars(stars, currentVal);
    });

    // Click effect
    star.addEventListener('click', function() {
      const val = parseInt(this.getAttribute('data-val'));
      inpRating.value = val;
      highlightStars(stars, val);
    });
  });

  // Submit form đánh giá
  document.getElementById('formReview').addEventListener('submit', function(e) {
    e.preventDefault();
    submitReview();
  });
}

function highlightStars(starsList, value) {
  starsList.forEach(s => {
    const sVal = parseInt(s.getAttribute('data-val'));
    if (sVal <= value) {
      s.classList.remove('fa-regular');
      s.classList.add('fa-solid');
    } else {
      s.classList.remove('fa-solid');
      s.classList.add('fa-regular');
    }
  });
}

/**
 * Xử lý Lưu Đánh Giá
 */
function submitReview() {
  const rating = parseInt(document.getElementById('inpRatingStar').value);
  if (rating === 0) {
    alert("Vui lòng chọn số sao đánh giá!");
    return;
  }

  const name = document.getElementById('inpReviewName').value.trim();
  const text = document.getElementById('inpReviewText').value.trim();

  // Tạo object review
  const newReview = {
    ten: name,
    sao: rating,
    nhanXet: text,
    ngay: new Date().toISOString().split('T')[0] // Lấy ngày YYYY-MM-DD
  };

  // Cập nhật vào đối tượng hiện tại
  if (!currentXe.danhGia) {
    currentXe.danhGia = [];
  }
  currentXe.danhGia.unshift(newReview); // Thêm lên đầu

  // Cập nhật lại danh sách gốc vào LocalStorage
  const danhSachXe = getXeMay();
  const index = danhSachXe.findIndex(x => x.id === currentXe.id);
  if (index !== -1) {
    danhSachXe[index] = currentXe;
    saveXeMay(danhSachXe);
  }

  // Render lại UI
  renderReviews();

  // Reset form
  document.getElementById('formReview').reset();
  document.getElementById('inpRatingStar').value = 0;
  highlightStars(document.querySelectorAll('#starInput i'), 0);

  showToast('Thành công', 'Cảm ơn bạn đã đánh giá sản phẩm!', 'success');
}

/**
 * Xử lý Thêm vào Hóa Đơn (Giỏ hàng)
 */
function addToCart() {
  const cart = getCart();
  
  // Kiểm tra xem xe đã có trong cart chưa
  const existIndex = cart.findIndex(item => item.id === currentXe.id && item.type === 'xe');
  
  if (existIndex !== -1) {
    // Đã có, tăng số lượng
    // Kiểm tra tồn kho trước
    if (cart[existIndex].soLuong >= currentXe.tonKho) {
      showToast('Thất bại', `Số lượng tồn kho chỉ còn ${currentXe.tonKho} chiếc!`, 'error');
      return;
    }
    cart[existIndex].soLuong += 1;
  } else {
    // Chưa có, thêm mới
    cart.push({
      id: currentXe.id,
      ten: currentXe.ten,
      gia: currentXe.giaBan,
      hinhAnh: currentXe.hinhAnh,
      soLuong: 1,
      type: 'xe' // Đánh dấu là xe máy (phân biệt với phụ tùng)
    });
  }

  saveCart(cart);
  updateCartBadge();
  
  showToast('Thành công', 'Đã thêm xe vào danh sách Hóa Đơn', 'success');
  
  // Hiệu ứng nút bấm
  const btn = document.getElementById('btnAddToCart');
  const oldHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Đã thêm';
  btn.classList.replace('btn-primary', 'btn-success');
  
  setTimeout(() => {
    btn.innerHTML = oldHtml;
    btn.classList.replace('btn-success', 'btn-primary');
  }, 2000);
}

/**
 * Cập nhật số lượng hiển thị trên icon giỏ hàng Navbar
 */
function updateCartBadge() {
  const cart = getCart();
  const badge = document.getElementById('cartCount');
  if (badge) {
    // Tính tổng số lượng
    const total = cart.reduce((sum, item) => sum + item.soLuong, 0);
    badge.innerText = total;
  }
}

/**
 * Hiển thị thông báo Toast
 */
function showToast(title, message, type) {
  const header = document.getElementById('toastHeader');
  document.getElementById('toastTitle').innerText = title;
  document.getElementById('toastMessage').innerText = message;
  
  header.className = 'toast-header text-white';
  if (type === 'success') {
    header.classList.add('bg-success');
    header.innerHTML = `<i class="fa-solid fa-circle-check me-2"></i><strong class="me-auto" id="toastTitle">${title}</strong><button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>`;
  } else if (type === 'error') {
    header.classList.add('bg-danger');
    header.innerHTML = `<i class="fa-solid fa-circle-xmark me-2"></i><strong class="me-auto" id="toastTitle">${title}</strong><button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>`;
  }

  toastNotif.show();
}
