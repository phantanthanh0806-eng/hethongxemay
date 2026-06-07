/**
 * js/phu-tung.js
 * Logic cho trang Quản lý Phụ Tùng
 */

let danhSachPT = []; 
let danhSachHienThiPT = []; 
const itemPerPagePT = 10;
let currentPagePT = 1;

let modalPhuTung;
let toastNotif;

document.addEventListener('DOMContentLoaded', function() {
  modalPhuTung = new bootstrap.Modal(document.getElementById('modalPhuTung'));
  toastNotif = new bootstrap.Toast(document.getElementById('liveToast'));
  
  // Update số lượng giỏ hàng
  updateCartBadge();

  // Load Data
  danhSachPT = getPhuTung();
  applyFiltersPT();

  // Events Lọc
  document.getElementById('searchPT').addEventListener('input', applyFiltersPT);
  document.getElementById('filterLoaiPT').addEventListener('change', applyFiltersPT);
  document.getElementById('filterGiaPT').addEventListener('change', applyFiltersPT);
  document.getElementById('sortGiaPT').addEventListener('change', applyFiltersPT);

  // Events Form
  document.getElementById('btnThemPT').addEventListener('click', resetFormPT);
  document.getElementById('btnSavePT').addEventListener('click', savePhuTungData);
  
  document.getElementById('inpHinhAnhPT').addEventListener('input', function() {
    const img = document.getElementById('previewImgPT');
    img.src = this.value || 'https://via.placeholder.com/200x200?text=Preview';
  });
});

/**
 * Cập nhật số lượng giỏ hàng trên Navbar
 */
function updateCartBadge() {
  const cart = getCart();
  const badge = document.getElementById('cartCount');
  if (badge) {
    const total = cart.reduce((sum, item) => sum + item.soLuong, 0);
    badge.innerText = total;
  }
}

/**
 * Lọc và hiển thị
 */
function applyFiltersPT() {
  const keyword = document.getElementById('searchPT').value.toLowerCase().trim();
  const loai = document.getElementById('filterLoaiPT').value;
  const mucGia = document.getElementById('filterGiaPT').value;
  const sort = document.getElementById('sortGiaPT').value;

  let results = [...danhSachPT];

  // Tìm kiếm
  if (keyword) {
    results = results.filter(pt => 
      pt.ten.toLowerCase().includes(keyword) || 
      pt.id.toLowerCase().includes(keyword)
    );
  }

  // Loại
  if (loai !== 'all') {
    results = results.filter(pt => pt.loai === loai);
  }

  // Giá bán
  if (mucGia !== 'all') {
    results = results.filter(pt => {
      const gia = pt.giaBan;
      if (mucGia === 'duoi100') return gia < 100000;
      if (mucGia === '100-300') return gia >= 100000 && gia <= 300000;
      if (mucGia === '300-500') return gia > 300000 && gia <= 500000;
      if (mucGia === 'tren500') return gia > 500000;
      return true;
    });
  }

  // Sắp xếp
  if (sort === 'asc') {
    results.sort((a, b) => a.giaBan - b.giaBan);
  } else if (sort === 'desc') {
    results.sort((a, b) => b.giaBan - a.giaBan);
  }

  danhSachHienThiPT = results;
  currentPagePT = 1; 
  renderTablePT();
}

/**
 * Vẽ Bảng
 */
function renderTablePT() {
  const tbody = document.getElementById('tbodyPhuTung');
  tbody.innerHTML = '';

  if (danhSachHienThiPT.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4">Không tìm thấy phụ tùng phù hợp.</td></tr>';
    updatePaginationInfoPT(0, 0, 0);
    renderPaginationPT(0);
    return;
  }

  const totalItems = danhSachHienThiPT.length;
  const totalPages = Math.ceil(totalItems / itemPerPagePT);
  const startIndex = (currentPagePT - 1) * itemPerPagePT;
  const endIndex = Math.min(startIndex + itemPerPagePT, totalItems);
  const currentItems = danhSachHienThiPT.slice(startIndex, endIndex);

  currentItems.forEach(pt => {
    const stockClass = pt.tonKho < 10 ? 'stock-warning' : 'stock-ok';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="fw-bold">${pt.id}</td>
      <td><img src="${pt.hinhAnh}" class="img-thumbnail-table" alt="${pt.ten}" onerror="this.src='https://placehold.co/100x75?text=No+Img'"></td>
      <td>
        <div class="fw-bold text-truncate" style="max-width: 250px;" title="${pt.ten}">${pt.ten}</div>
      </td>
      <td>${pt.loai}</td>
      <td>${pt.nhaCungCap}</td>
      <td class="fw-bold text-danger">${formatCurrency(pt.giaBan)}</td>
      <td class="text-center ${stockClass}">${pt.tonKho}</td>
      <td class="text-center action-btns">
        <button class="btn btn-add-cart" title="Thêm vào Hóa đơn" onclick="addToCartPT('${pt.id}')"><i class="fa-solid fa-cart-plus"></i></button>
        <button class="btn btn-edit" title="Sửa" onclick="editPT('${pt.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-delete" title="Xóa" onclick="deletePT('${pt.id}')"><i class="fa-solid fa-trash-can"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updatePaginationInfoPT(startIndex + 1, endIndex, totalItems);
  renderPaginationPT(totalPages);
}

/**
 * Phân trang
 */
function updatePaginationInfoPT(start, end, total) {
  const infoEl = document.getElementById('infoPagination');
  infoEl.innerText = total === 0 ? 'Không có dữ liệu' : `Hiển thị ${start} - ${end} trong tổng số ${total}`;
}

function renderPaginationPT(totalPages) {
  const container = document.getElementById('paginationContainer');
  container.innerHTML = '';
  if (totalPages <= 1) return;

  const prevDisabled = currentPagePT === 1 ? 'disabled' : '';
  container.innerHTML += `
    <li class="page-item ${prevDisabled}">
      <a class="page-link" href="#" onclick="changePagePT(${currentPagePT - 1}); return false;">&laquo;</a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    const activeClass = currentPagePT === i ? 'active' : '';
    container.innerHTML += `
      <li class="page-item ${activeClass}">
        <a class="page-link" href="#" onclick="changePagePT(${i}); return false;">${i}</a>
      </li>
    `;
  }

  const nextDisabled = currentPagePT === totalPages ? 'disabled' : '';
  container.innerHTML += `
    <li class="page-item ${nextDisabled}">
      <a class="page-link" href="#" onclick="changePagePT(${currentPagePT + 1}); return false;">&raquo;</a>
    </li>
  `;
}

function changePagePT(page) {
  const totalPages = Math.ceil(danhSachHienThiPT.length / itemPerPagePT);
  if (page >= 1 && page <= totalPages) {
    currentPagePT = page;
    renderTablePT();
  }
}

/**
 * Form Actions (Thêm/Sửa/Xóa)
 */
function resetFormPT() {
  document.getElementById('formPhuTung').reset();
  document.getElementById('formActionPT').value = 'add';
  document.getElementById('modalPTLabel').innerText = 'Thêm Phụ Tùng Mới';
  document.getElementById('inpMaPT').value = generateId('PT');
  document.getElementById('inpMaPT').readOnly = true;
  document.getElementById('previewImgPT').src = 'https://via.placeholder.com/200x200?text=Preview';
}

function editPT(id) {
  const pt = danhSachPT.find(x => x.id === id);
  if (!pt) return;

  document.getElementById('formActionPT').value = 'edit';
  document.getElementById('modalPTLabel').innerText = 'Chỉnh Sửa Phụ Tùng';

  document.getElementById('inpMaPT').value = pt.id;
  document.getElementById('inpMaPT').readOnly = true;
  
  document.getElementById('inpTenPT').value = pt.ten;
  document.getElementById('inpLoaiPT').value = pt.loai;
  document.getElementById('inpNhaCungCap').value = pt.nhaCungCap;
  
  document.getElementById('inpGiaNhapPT').value = pt.giaNhap;
  document.getElementById('inpGiaBanPT').value = pt.giaBan;
  document.getElementById('inpTonKhoPT').value = pt.tonKho;
  
  document.getElementById('inpHinhAnhPT').value = pt.hinhAnh;
  document.getElementById('previewImgPT').src = pt.hinhAnh || 'https://via.placeholder.com/200x200?text=Preview';
  
  document.getElementById('inpMoTaPT').value = pt.moTa || '';

  modalPhuTung.show();
}

function deletePT(id) {
  if (confirm(`Bạn có chắc muốn xóa phụ tùng ${id}?`)) {
    danhSachPT = danhSachPT.filter(x => x.id !== id);
    savePhuTung(danhSachPT);
    applyFiltersPT();
    showToast('Xóa thành công', `Đã xóa phụ tùng ${id}`, 'success');
  }
}

function savePhuTungData() {
  const form = document.getElementById('formPhuTung');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const action = document.getElementById('formActionPT').value;
  const id = document.getElementById('inpMaPT').value;
  
  const ptData = {
    id: id,
    ten: document.getElementById('inpTenPT').value,
    loai: document.getElementById('inpLoaiPT').value,
    nhaCungCap: document.getElementById('inpNhaCungCap').value,
    giaNhap: parseInt(document.getElementById('inpGiaNhapPT').value),
    giaBan: parseInt(document.getElementById('inpGiaBanPT').value),
    tonKho: parseInt(document.getElementById('inpTonKhoPT').value),
    hinhAnh: document.getElementById('inpHinhAnhPT').value,
    moTa: document.getElementById('inpMoTaPT').value
  };

  if (action === 'add') {
    danhSachPT.unshift(ptData);
    showToast('Thêm thành công', `Đã thêm: ${ptData.ten}`, 'success');
  } else {
    const index = danhSachPT.findIndex(x => x.id === id);
    if (index !== -1) {
      danhSachPT[index] = ptData;
      showToast('Cập nhật thành công', `Đã cập nhật: ${id}`, 'success');
    }
  }

  savePhuTung(danhSachPT);
  modalPhuTung.hide();
  applyFiltersPT();
}

/**
 * Thêm phụ tùng vào Giỏ Hàng (Hóa đơn) nhanh từ bảng
 */
window.addToCartPT = function(id) {
  const pt = danhSachPT.find(x => x.id === id);
  if (!pt) return;
  
  if (pt.tonKho <= 0) {
    showToast('Thất bại', 'Sản phẩm đã hết hàng', 'error');
    return;
  }

  const cart = getCart();
  const existIndex = cart.findIndex(item => item.id === pt.id && item.type === 'phutung');
  
  if (existIndex !== -1) {
    if (cart[existIndex].soLuong >= pt.tonKho) {
      showToast('Thất bại', `Tồn kho chỉ còn ${pt.tonKho}`, 'error');
      return;
    }
    cart[existIndex].soLuong += 1;
  } else {
    cart.push({
      id: pt.id,
      ten: pt.ten,
      gia: pt.giaBan,
      hinhAnh: pt.hinhAnh,
      soLuong: 1,
      type: 'phutung'
    });
  }

  saveCart(cart);
  updateCartBadge();
  showToast('Thành công', `Đã thêm ${pt.ten} vào Hóa đơn`, 'success');
}

function showToast(title, message, type) {
  const header = document.getElementById('toastHeader');
  document.getElementById('toastTitle').innerText = title;
  document.getElementById('toastMessage').innerText = message;
  
  header.className = 'toast-header text-white';
  if (type === 'success') {
    header.classList.add('bg-success');
    header.innerHTML = `<i class="fa-solid fa-circle-check me-2"></i><strong class="me-auto" id="toastTitle">${title}</strong><button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>`;
  } else {
    header.classList.add('bg-danger');
    header.innerHTML = `<i class="fa-solid fa-circle-xmark me-2"></i><strong class="me-auto" id="toastTitle">${title}</strong><button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>`;
  }

  toastNotif.show();
}
