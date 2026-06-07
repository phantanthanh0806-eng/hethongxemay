/**
 * js/trang-chu.js
 * Logic dành riêng cho trang chủ
 */

document.addEventListener('DOMContentLoaded', function() {
  // 1. Tải dữ liệu xe máy từ LocalStorage
  const danhSachXe = getXeMay();
  
  // 2. Render section Xe Mới Nhập (Lấy 4 xe ngẫu nhiên hoặc mới nhất)
  renderXeMoiNhap(danhSachXe);
  
  // 3. Render section Xe Bán Chạy (Lấy 4 xe ngẫu nhiên hoặc dựa theo logic)
  renderXeBanChay(danhSachXe);
  
  // 4. Khởi tạo hiệu ứng Scroll Animation
  initScrollAnimation();
  
  // 5. Cập nhật số liệu thống kê
  updateDashboardStats();
  
  // 6. Xử lý tìm kiếm nhanh
  setupQuickSearch();
});

/**
 * Hiển thị danh sách xe mới nhập
 */
function renderXeMoiNhap(data) {
  const container = document.getElementById('newBikesContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Lấy 4 xe đầu tiên làm xe mới nhập (trong thực tế có thể sort theo ngày)
  const xeMoi = data.slice(0, 4);
  
  if (xeMoi.length === 0) {
    container.innerHTML = '<div class="col-12 text-center"><p>Chưa có dữ liệu xe.</p></div>';
    return;
  }
  
  xeMoi.forEach(xe => {
    const cardHTML = createProductCard(xe, 'new');
    container.innerHTML += cardHTML;
  });
}

/**
 * Hiển thị danh sách xe bán chạy
 */
function renderXeBanChay(data) {
  const container = document.getElementById('bestSellerBikesContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Lấy 4 xe tiếp theo làm xe bán chạy (trong thực tế dựa vào số lượng bán)
  // Đảo mảng để lấy ngẫu nhiên khác với xe mới
  const xeBanChay = [...data].reverse().slice(0, 4);
  
  if (xeBanChay.length === 0) {
    container.innerHTML = '<div class="col-12 text-center"><p>Chưa có dữ liệu xe.</p></div>';
    return;
  }
  
  xeBanChay.forEach(xe => {
    const cardHTML = createProductCard(xe, 'hot');
    container.innerHTML += cardHTML;
  });
}

/**
 * Tạo HTML cho một thẻ sản phẩm xe
 */
function createProductCard(xe, badgeType) {
  const badgeHTML = badgeType === 'new' 
    ? '<span class="badge-new">Mới</span>' 
    : '<span class="badge-hot">Bán chạy</span>';
    
  return `
    <div class="col-md-3 col-sm-6 mb-4">
      <div class="card product-card h-100">
        <div class="product-badges">
          ${badgeHTML}
        </div>
        <img src="${xe.hinhAnh}" class="card-img-top" alt="${xe.ten}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
        <div class="card-body d-flex flex-column">
          <p class="text-muted small mb-1">${xe.hang} • ${xe.loai}</p>
          <h5 class="card-title text-truncate" title="${xe.ten}">${xe.ten}</h5>
          <p class="product-price mt-auto mb-3">${formatCurrency(xe.giaBan)}</p>
          <div class="d-grid mt-auto">
            <a href="chi-tiet-xe-may.html?id=${xe.id}" class="btn btn-outline-primary">Xem Chi Tiết</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Cập nhật số liệu thống kê Dashboard
 */
function updateDashboardStats() {
  const danhSachXe = getXeMay();
  const danhSachPhuTung = getPhuTung();
  const danhSachHoaDon = getHoaDon();
  
  // Tổng doanh thu = tổng tiền của tất cả hóa đơn
  const tongDoanhThu = danhSachHoaDon.reduce((sum, hd) => sum + hd.thanhTien, 0);
  
  // Cập nhật DOM
  const elTongXe = document.getElementById('statTongXe');
  const elPhuTung = document.getElementById('statPhuTung');
  const elHoaDon = document.getElementById('statHoaDon');
  const elDoanhThu = document.getElementById('statDoanhThu');
  
  if (elTongXe) elTongXe.innerText = danhSachXe.length;
  if (elPhuTung) elPhuTung.innerText = danhSachPhuTung.length;
  if (elHoaDon) elHoaDon.innerText = danhSachHoaDon.length;
  
  // Animation đếm số cho doanh thu vì số lớn
  if (elDoanhThu) {
    animateValue(elDoanhThu, 0, tongDoanhThu, 2000);
  }
}

/**
 * Hiệu ứng đếm số cho thống kê
 */
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Tính toán giá trị hiện tại
    const currentVal = Math.floor(progress * (end - start) + start);
    
    // Format thành tiền VNĐ và hiển thị
    // Bỏ qua phần .00 đ, chỉ hiện số format
    obj.innerHTML = currentVal.toLocaleString('vi-VN');
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      // Đảm bảo kết quả cuối cùng đúng
      obj.innerHTML = formatCurrency(end);
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * Cài đặt hiệu ứng fade-in khi cuộn trang
 */
function initScrollAnimation() {
  const elements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: stop observing once visible
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
  
  // Kích hoạt ngay cho các phần tử đang hiển thị trên màn hình
  setTimeout(() => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 100);
}

/**
 * Xử lý chức năng tìm kiếm nhanh trên Navbar
 */
function setupQuickSearch() {
  const inputSearch = document.getElementById('quickSearch');
  const btnSearch = document.getElementById('btnQuickSearch');
  
  if (!inputSearch || !btnSearch) return;
  
  const doSearch = () => {
    const keyword = inputSearch.value.trim();
    if (keyword) {
      // Chuyển hướng sang trang danh sách xe với tham số tìm kiếm
      window.location.href = `danh-sach-xe-may.html?search=${encodeURIComponent(keyword)}`;
    }
  };
  
  btnSearch.addEventListener('click', doSearch);
  
  inputSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      doSearch();
    }
  });
}
