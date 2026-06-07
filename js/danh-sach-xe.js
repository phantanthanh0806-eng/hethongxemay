/**
 * js/danh-sach-xe.js
 * Quản lý logic cho trang Danh Sách Xe Máy (CRUD, Lọc, Tìm kiếm, Phân trang)
 */

// Biến toàn cục
let danhSachXe = []; // Dữ liệu gốc
let danhSachHienThi = []; // Dữ liệu đang hiển thị (sau khi lọc)
const itemPerPage = 10;
let currentPage = 1;

// Khởi tạo Modal Bootstrap
let modalXeMay;
let toastNotif;

document.addEventListener('DOMContentLoaded', function() {
  // Init Bootstrap components
  modalXeMay = new bootstrap.Modal(document.getElementById('modalXeMay'));
  toastNotif = new bootstrap.Toast(document.getElementById('liveToast'));
  
  // Load dữ liệu
  danhSachXe = getXeMay();
  
  // Xử lý query param từ URL (nếu có từ trang chủ gửi sang)
  const urlParams = new URLSearchParams(window.location.search);
  const searchKeyword = urlParams.get('search');
  const hangFilter = urlParams.get('hang');
  const loaiFilter = urlParams.get('loai');
  
  if (searchKeyword) {
    document.getElementById('searchXe').value = searchKeyword;
  }
  if (hangFilter) {
    document.getElementById('filterHang').value = hangFilter;
  }
  if (loaiFilter) {
    document.getElementById('filterLoai').value = loaiFilter;
  }

  // Áp dụng bộ lọc lần đầu và render
  applyFilters();

  // Đăng ký các Event Listeners
  setupEventListeners();
});

/**
 * Đăng ký tất cả event listeners
 */
function setupEventListeners() {
  // Lọc và Tìm kiếm
  document.getElementById('searchXe').addEventListener('input', applyFilters);
  document.getElementById('filterHang').addEventListener('change', applyFilters);
  document.getElementById('filterLoai').addEventListener('change', applyFilters);
  document.getElementById('filterGia').addEventListener('change', applyFilters);
  document.getElementById('sortGia').addEventListener('change', applyFilters);

  // Form Thêm/Sửa
  document.getElementById('btnThemXe').addEventListener('click', resetForm);
  document.getElementById('btnSaveXe').addEventListener('click', saveXeMayData);
  
  // Preview ảnh khi nhập URL
  document.getElementById('inpHinhAnh').addEventListener('input', function() {
    const img = document.getElementById('previewImg');
    img.src = this.value || 'https://via.placeholder.com/400x300?text=Preview';
  });
}

/**
 * Xử lý Lọc, Tìm kiếm, Sắp xếp
 */
function applyFilters() {
  const keyword = document.getElementById('searchXe').value.toLowerCase().trim();
  const hang = document.getElementById('filterHang').value;
  const loai = document.getElementById('filterLoai').value;
  const mucGia = document.getElementById('filterGia').value;
  const sort = document.getElementById('sortGia').value;

  // Clone mảng gốc để lọc
  let results = [...danhSachXe];

  // 1. Tìm kiếm theo tên hoặc mã
  if (keyword) {
    results = results.filter(xe => 
      xe.ten.toLowerCase().includes(keyword) || 
      xe.id.toLowerCase().includes(keyword)
    );
  }

  // 2. Lọc theo hãng
  if (hang !== 'all') {
    results = results.filter(xe => xe.hang === hang);
  }

  // 3. Lọc theo loại
  if (loai !== 'all') {
    results = results.filter(xe => xe.loai === loai);
  }

  // 4. Lọc theo khoảng giá (Giá bán)
  if (mucGia !== 'all') {
    results = results.filter(xe => {
      const gia = xe.giaBan;
      if (mucGia === 'duoi20') return gia < 20000000;
      if (mucGia === '20-50') return gia >= 20000000 && gia <= 50000000;
      if (mucGia === '50-100') return gia > 50000000 && gia <= 100000000;
      if (mucGia === 'tren100') return gia > 100000000;
      return true;
    });
  }

  // 5. Sắp xếp
  if (sort === 'asc') {
    results.sort((a, b) => a.giaBan - b.giaBan);
  } else if (sort === 'desc') {
    results.sort((a, b) => b.giaBan - a.giaBan);
  }

  danhSachHienThi = results;
  currentPage = 1; // Reset về trang 1
  renderTable();
}

/**
 * Render Bảng dữ liệu và Phân trang
 */
function renderTable() {
  const tbody = document.getElementById('tbodyXeMay');
  tbody.innerHTML = '';

  if (danhSachHienThi.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="text-center py-4">Không tìm thấy xe máy nào phù hợp.</td></tr>';
    updatePaginationInfo(0, 0, 0);
    renderPagination(0);
    return;
  }

  // Tính toán phân trang
  const totalItems = danhSachHienThi.length;
  const totalPages = Math.ceil(totalItems / itemPerPage);
  
  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = Math.min(startIndex + itemPerPage, totalItems);
  
  const currentItems = danhSachHienThi.slice(startIndex, endIndex);

  // Render Rows
  currentItems.forEach(xe => {
    // Xác định class CSS cho Trạng thái
    let statusClass = 'badge-instock';
    let statusText = xe.trangThai;
    
    if (xe.trangThai === 'Ngừng kinh doanh') {
      statusClass = 'badge-stop';
    } else if (xe.tonKho === 0 || xe.trangThai === 'Hết hàng') {
      statusClass = 'badge-outstock';
      statusText = 'Hết hàng';
    } else if (xe.tonKho <= 3) {
      statusClass = 'badge-lowstock';
      statusText = 'Sắp hết';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="fw-bold">${xe.id}</td>
      <td><img src="${xe.hinhAnh}" class="img-thumbnail-table" alt="${xe.ten}" onerror="this.src='https://placehold.co/100x75?text=No+Img'"></td>
      <td>
        <div class="fw-bold text-truncate" style="max-width: 200px;" title="${xe.ten}">${xe.ten}</div>
      </td>
      <td>${xe.hang}</td>
      <td>${xe.loai}</td>
      <td>${xe.mau}</td>
      <td class="fw-bold text-danger">${formatCurrency(xe.giaBan)}</td>
      <td class="text-center">${xe.tonKho}</td>
      <td><span class="badge-status ${statusClass}">${statusText}</span></td>
      <td class="text-center action-btns">
        <a href="chi-tiet-xe-may.html?id=${xe.id}" class="btn btn-view" title="Xem chi tiết"><i class="fa-solid fa-eye"></i></a>
        <button class="btn btn-edit" title="Sửa" onclick="editXe('${xe.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-delete" title="Xóa" onclick="deleteXe('${xe.id}')"><i class="fa-solid fa-trash-can"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updatePaginationInfo(startIndex + 1, endIndex, totalItems);
  renderPagination(totalPages);
}

/**
 * Cập nhật thông tin phân trang (Hiển thị 1 - 10 trong 20)
 */
function updatePaginationInfo(start, end, total) {
  const infoEl = document.getElementById('infoPagination');
  if (total === 0) {
    infoEl.innerText = 'Không có dữ liệu';
  } else {
    infoEl.innerText = `Hiển thị ${start} - ${end} trong tổng số ${total} xe`;
  }
}

/**
 * Vẽ thanh phân trang
 */
function renderPagination(totalPages) {
  const container = document.getElementById('paginationContainer');
  container.innerHTML = '';

  if (totalPages <= 1) return;

  // Nút Prev
  const prevDisabled = currentPage === 1 ? 'disabled' : '';
  container.innerHTML += `
    <li class="page-item ${prevDisabled}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;

  // Các trang
  for (let i = 1; i <= totalPages; i++) {
    const activeClass = currentPage === i ? 'active' : '';
    container.innerHTML += `
      <li class="page-item ${activeClass}">
        <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
      </li>
    `;
  }

  // Nút Next
  const nextDisabled = currentPage === totalPages ? 'disabled' : '';
  container.innerHTML += `
    <li class="page-item ${nextDisabled}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;
}

function changePage(page) {
  const totalPages = Math.ceil(danhSachHienThi.length / itemPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderTable();
  }
}

/**
 * Reset form modal khi bấm Thêm mới
 */
function resetForm() {
  document.getElementById('formXeMay').reset();
  document.getElementById('formAction').value = 'add';
  document.getElementById('modalXeMayLabel').innerText = 'Thêm Xe Mới';
  
  // Auto generate ID
  document.getElementById('inpMaXe').value = generateId('XM');
  document.getElementById('inpMaXe').readOnly = true;
  document.getElementById('previewImg').src = 'https://via.placeholder.com/400x300?text=Preview';
}

/**
 * Load dữ liệu xe lên form để sửa
 */
function editXe(id) {
  const xe = danhSachXe.find(x => x.id === id);
  if (!xe) return;

  document.getElementById('formAction').value = 'edit';
  document.getElementById('modalXeMayLabel').innerText = 'Chỉnh Sửa Thông Tin Xe';

  document.getElementById('inpMaXe').value = xe.id;
  document.getElementById('inpMaXe').readOnly = true;
  
  document.getElementById('inpTenXe').value = xe.ten;
  document.getElementById('inpHangXe').value = xe.hang;
  document.getElementById('inpLoaiXe').value = xe.loai;
  document.getElementById('inpNamSx').value = xe.namSx;
  document.getElementById('inpDungTich').value = xe.dungTich;
  document.getElementById('inpMauSac').value = xe.mau;
  
  document.getElementById('inpGiaNhap').value = xe.giaNhap;
  document.getElementById('inpGiaBan').value = xe.giaBan;
  document.getElementById('inpTonKho').value = xe.tonKho;
  document.getElementById('inpTrangThai').value = xe.trangThai;
  
  document.getElementById('inpHinhAnh').value = xe.hinhAnh;
  document.getElementById('previewImg').src = xe.hinhAnh || 'https://via.placeholder.com/400x300?text=Preview';
  
  document.getElementById('inpMoTa').value = xe.mota || '';

  modalXeMay.show();
}

/**
 * Xóa xe
 */
function deleteXe(id) {
  if (confirm(`Bạn có chắc chắn muốn xóa xe mã ${id} không? Hành động này không thể hoàn tác!`)) {
    // Xóa trong mảng gốc
    danhSachXe = danhSachXe.filter(x => x.id !== id);
    
    // Lưu LocalStorage
    saveXeMay(danhSachXe);
    
    // Render lại
    applyFilters();
    
    // Show toast
    showToast('Xóa thành công', `Đã xóa xe mã ${id}.`, 'success');
  }
}

/**
 * Lưu thông tin xe (Thêm mới hoặc Sửa)
 */
function saveXeMayData() {
  // Validate basic
  const form = document.getElementById('formXeMay');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const action = document.getElementById('formAction').value;
  const id = document.getElementById('inpMaXe').value;
  
  const xeData = {
    id: id,
    ten: document.getElementById('inpTenXe').value,
    hang: document.getElementById('inpHangXe').value,
    loai: document.getElementById('inpLoaiXe').value,
    namSx: parseInt(document.getElementById('inpNamSx').value),
    dungTich: document.getElementById('inpDungTich').value,
    mau: document.getElementById('inpMauSac').value,
    giaNhap: parseInt(document.getElementById('inpGiaNhap').value),
    giaBan: parseInt(document.getElementById('inpGiaBan').value),
    tonKho: parseInt(document.getElementById('inpTonKho').value),
    trangThai: document.getElementById('inpTrangThai').value,
    hinhAnh: document.getElementById('inpHinhAnh').value,
    mota: document.getElementById('inpMoTa').value
  };

  if (action === 'add') {
    // Mặc định cho xe mới thêm
    xeData.thongSo = {
      congSuat: "Đang cập nhật", trongLuong: "Đang cập nhật",
      chieuDai: "Đang cập nhật", chieuRong: "Đang cập nhật", chieuCao: "Đang cập nhật",
      dungTichBinh: "Đang cập nhật", mucTieuHao: "Đang cập nhật"
    };
    xeData.danhGia = [];
    
    // Thêm vào mảng (đầu mảng)
    danhSachXe.unshift(xeData);
    showToast('Thêm thành công', `Đã thêm xe mới: ${xeData.ten}`, 'success');
  } else {
    // Update
    const index = danhSachXe.findIndex(x => x.id === id);
    if (index !== -1) {
      // Giữ lại thongSo và danhGia cũ
      xeData.thongSo = danhSachXe[index].thongSo;
      xeData.danhGia = danhSachXe[index].danhGia;
      danhSachXe[index] = xeData;
      showToast('Cập nhật thành công', `Đã cập nhật xe mã ${id}`, 'success');
    }
  }

  // Lưu LocalStorage
  saveXeMay(danhSachXe);
  
  // Đóng modal và render lại
  modalXeMay.hide();
  applyFilters();
}

/**
 * Hiển thị thông báo Toast
 */
function showToast(title, message, type) {
  const toastEl = document.getElementById('liveToast');
  const header = document.getElementById('toastHeader');
  
  document.getElementById('toastTitle').innerText = title;
  document.getElementById('toastMessage').innerText = message;
  
  // Reset color
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
