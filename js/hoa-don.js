/**
 * js/hoa-don.js
 * Quản lý logic lập Hóa Đơn, tính toán giỏ hàng, Lưu và In ấn
 */

let cartData = [];
const VAT_RATE = 0.1; // 10%
let toastNotif;

document.addEventListener('DOMContentLoaded', function() {
  toastNotif = new bootstrap.Toast(document.getElementById('liveToast'));
  
  // Init
  initInvoiceForm();
  loadCartFromStorage();
  populateDropdowns();

  // Events
  document.getElementById('inpChietKhau').addEventListener('input', calculateTotal);
  document.getElementById('formKhachHang').addEventListener('input', validateForm);
  
  document.getElementById('btnAddXe').addEventListener('click', () => addProductToCart('xe'));
  document.getElementById('btnAddPT').addEventListener('click', () => addProductToCart('phutung'));
  
  document.getElementById('btnClearCart').addEventListener('click', clearAllCart);
  
  document.getElementById('btnSaveInvoice').addEventListener('click', saveInvoice);
  document.getElementById('btnPrint').addEventListener('click', printInvoice);

  // Load History khi mở modal
  document.getElementById('btnShowHistory').addEventListener('click', renderHistory);
});

/**
 * Khởi tạo Form ban đầu
 */
function initInvoiceForm() {
  // Generate ID HD
  document.getElementById('inpMaHD').value = Date.now().toString().slice(-8);
  
  // Set ngày lập là hôm nay
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('inpNgayLap').value = today;
}

/**
 * Load dữ liệu vào Dropdown (Select) để thêm nhanh
 */
function populateDropdowns() {
  // Xe Máy
  const xeMay = getXeMay().filter(x => x.tonKho > 0 && x.trangThai === 'Còn hàng');
  const selXe = document.getElementById('selectXeMay');
  xeMay.forEach(x => {
    selXe.innerHTML += `<option value="${x.id}">${x.ten} - ${formatCurrency(x.giaBan)}</option>`;
  });

  // Phụ Tùng
  const phuTung = getPhuTung().filter(p => p.tonKho > 0);
  const selPT = document.getElementById('selectPhuTung');
  phuTung.forEach(p => {
    selPT.innerHTML += `<option value="${p.id}">${p.ten} - ${formatCurrency(p.giaBan)}</option>`;
  });
}

/**
 * Tải Giỏ hàng từ LocalStorage và Render
 */
function loadCartFromStorage() {
  cartData = getCart();
  renderInvoiceTable();
  validateForm();
}

/**
 * Thêm sản phẩm từ Dropdown vào giỏ
 */
function addProductToCart(type) {
  let selectId = type === 'xe' ? 'selectXeMay' : 'selectPhuTung';
  let itemId = document.getElementById(selectId).value;
  
  if (!itemId) {
    showToast('Cảnh báo', 'Vui lòng chọn sản phẩm!', 'error');
    return;
  }

  // Lấy data sản phẩm gốc
  let itemData = null;
  if (type === 'xe') {
    itemData = getXeMay().find(x => x.id === itemId);
  } else {
    itemData = getPhuTung().find(x => x.id === itemId);
  }

  if (!itemData) return;

  // Kiểm tra giỏ hàng hiện tại
  const existIndex = cartData.findIndex(x => x.id === itemId && x.type === type);
  
  if (existIndex !== -1) {
    if (cartData[existIndex].soLuong >= itemData.tonKho) {
      showToast('Lỗi', `Tồn kho chỉ còn ${itemData.tonKho}`, 'error');
      return;
    }
    cartData[existIndex].soLuong += 1;
  } else {
    cartData.push({
      id: itemData.id,
      ten: itemData.ten,
      gia: itemData.giaBan,
      soLuong: 1,
      type: type,
      maxTonKho: itemData.tonKho // Lưu tạm để validate số lượng
    });
  }

  saveCart(cartData);
  renderInvoiceTable();
  validateForm();
  
  // Reset select
  document.getElementById(selectId).value = "";
}

/**
 * Cập nhật số lượng của một dòng
 */
window.updateQty = function(index, newQty) {
  newQty = parseInt(newQty);
  if (isNaN(newQty) || newQty <= 0) {
    newQty = 1; // Minimum 1
  }

  // Validate với tồn kho
  const item = cartData[index];
  let maxTonKho = item.maxTonKho;
  
  // Lấy tồn kho thực tế nếu chưa có maxTonKho trong cart (case load từ cart cũ)
  if (!maxTonKho) {
    if (item.type === 'xe') {
      maxTonKho = getXeMay().find(x => x.id === item.id)?.tonKho || 0;
    } else {
      maxTonKho = getPhuTung().find(x => x.id === item.id)?.tonKho || 0;
    }
  }

  if (newQty > maxTonKho) {
    showToast('Cảnh báo', `Chỉ còn ${maxTonKho} sản phẩm trong kho.`, 'error');
    newQty = maxTonKho;
  }

  cartData[index].soLuong = newQty;
  saveCart(cartData);
  renderInvoiceTable(); // Tự động tính toán lại
}

/**
 * Xóa một sản phẩm
 */
window.removeItem = function(index) {
  cartData.splice(index, 1);
  saveCart(cartData);
  renderInvoiceTable();
  validateForm();
}

/**
 * Xóa toàn bộ giỏ hàng
 */
function clearAllCart() {
  if (cartData.length === 0) return;
  if (confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong hóa đơn này?")) {
    cartData = [];
    clearCart(); // LocalStorage clear
    renderInvoiceTable();
    validateForm();
  }
}

/**
 * Render Bảng chi tiết hóa đơn
 */
function renderInvoiceTable() {
  const tbody = document.getElementById('tbodyInvoice');
  tbody.innerHTML = '';

  if (cartData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-muted">Chưa có sản phẩm nào. Hãy thêm sản phẩm ở cột bên trái.</td></tr>';
    calculateTotal();
    return;
  }

  cartData.forEach((item, index) => {
    const thanhTien = item.gia * item.soLuong;
    const badgeType = item.type === 'xe' ? '<span class="badge bg-dark ms-2">Xe</span>' : '<span class="badge bg-secondary ms-2">PT</span>';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-center">${index + 1}</td>
      <td>
        <div class="fw-bold">${item.ten} ${badgeType}</div>
        <small class="text-muted d-print-none">Mã: ${item.id}</small>
      </td>
      <td class="text-end">${formatCurrency(item.gia)}</td>
      <td class="text-center">
        <!-- Input hiện khi edit (d-print-none) -->
        <input type="number" class="form-control form-control-sm qty-input d-print-none" 
               value="${item.soLuong}" min="1" onchange="updateQty(${index}, this.value)">
        <!-- Text hiện khi in (d-none d-print-block) -->
        <span class="d-none d-print-inline">${item.soLuong}</span>
      </td>
      <td class="text-end fw-bold">${formatCurrency(thanhTien)}</td>
      <td class="text-center d-print-none">
        <button class="btn-remove-item" title="Xóa" onclick="removeItem(${index})">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  calculateTotal();
}

/**
 * Tính toán Tạm tính, Chiết khấu, VAT, Thành tiền
 */
function calculateTotal() {
  let tamTinh = 0;
  cartData.forEach(item => {
    tamTinh += (item.gia * item.soLuong);
  });

  // Lấy chiết khấu
  let discountPercent = parseFloat(document.getElementById('inpChietKhau').value) || 0;
  if (discountPercent > 100) discountPercent = 100;
  if (discountPercent < 0) discountPercent = 0;
  
  // Tính tiền
  const giamGia = tamTinh * (discountPercent / 100);
  const sauGiamGia = tamTinh - giamGia;
  const vat = sauGiamGia * VAT_RATE;
  const thanhTien = sauGiamGia + vat;

  // Render DOM
  document.getElementById('txtTamTinh').innerText = formatCurrency(tamTinh);
  document.getElementById('txtGiamGia').innerText = '- ' + formatCurrency(giamGia);
  document.getElementById('txtVAT').innerText = formatCurrency(vat);
  document.getElementById('txtThanhTien').innerText = formatCurrency(thanhTien);
  
  // Render cho bản in
  document.getElementById('printChietKhau').innerText = discountPercent + '%';
  
  // Return values for Saving
  return { tamTinh, giamGia, vat, thanhTien };
}

/**
 * Kiểm tra Form hợp lệ để Enable/Disable nút Lưu/In
 */
function validateForm() {
  const ten = document.getElementById('inpTenKH').value.trim();
  const sdt = document.getElementById('inpSDT').value.trim();
  const formValid = document.getElementById('formKhachHang').checkValidity();
  
  const hasItems = cartData.length > 0;
  const btnSave = document.getElementById('btnSaveInvoice');
  const btnPrint = document.getElementById('btnPrint');

  // Chỉ cho lưu/in khi: Form valid, Tên và SĐT có dữ liệu, và Giỏ hàng có đồ
  if (formValid && ten && sdt && hasItems) {
    btnSave.disabled = false;
    btnPrint.disabled = false;
  } else {
    btnSave.disabled = true;
    btnPrint.disabled = true;
  }
}

/**
 * Lưu Hóa Đơn và Trừ Tồn Kho
 */
function saveInvoice() {
  // 1. Tạo object Hóa Đơn
  const totals = calculateTotal();
  const maHD = "HD" + document.getElementById('inpMaHD').value;
  
  const invoiceData = {
    maHD: maHD,
    ngayLap: document.getElementById('inpNgayLap').value,
    khachHang: {
      ten: document.getElementById('inpTenKH').value.trim(),
      sdt: document.getElementById('inpSDT').value.trim(),
      diaChi: document.getElementById('inpDiaChi').value.trim()
    },
    items: [...cartData], // Clone array
    tamTinh: totals.tamTinh,
    chietKhau: document.getElementById('inpChietKhau').value,
    giamGia: totals.giamGia,
    vat: totals.vat,
    thanhTien: totals.thanhTien
  };

  // 2. Lưu vào mảng Lịch sử Hóa Đơn
  const dsHoaDon = getHoaDon();
  dsHoaDon.unshift(invoiceData);
  saveHoaDon(dsHoaDon);

  // 3. TRỪ TỒN KHO TƯƠNG ỨNG
  const danhSachXe = getXeMay();
  const danhSachPT = getPhuTung();

  cartData.forEach(item => {
    if (item.type === 'xe') {
      const idx = danhSachXe.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        danhSachXe[idx].tonKho -= item.soLuong;
        // Nếu kho = 0 thì update trạng thái (tùy logic nghiệp vụ, ở đây tạm thời giữ nguyên để admin tự update)
      }
    } else if (item.type === 'phutung') {
      const idx = danhSachPT.findIndex(x => x.id === item.id);
      if (idx !== -1) {
        danhSachPT[idx].tonKho -= item.soLuong;
      }
    }
  });

  // Cập nhật lại kho
  saveXeMay(danhSachXe);
  savePhuTung(danhSachPT);

  // 4. Xóa giỏ hàng hiện tại (Clear Cart)
  cartData = [];
  clearCart();
  
  showToast('Thành công', `Đã lưu hóa đơn ${maHD} và trừ tồn kho!`, 'success');
  
  // Disable buttons until new data
  document.getElementById('btnSaveInvoice').disabled = true;
  document.getElementById('btnPrint').disabled = true;
  
  // Tùy chọn: Tự động reset form
  setTimeout(() => {
    document.getElementById('formKhachHang').reset();
    initInvoiceForm();
    renderInvoiceTable();
  }, 1000);
}

/**
 * Xử lý chức năng In (Print)
 */
function printInvoice() {
  // Sync data từ form sang UI của bản in
  document.getElementById('printTenKH').innerText = document.getElementById('inpTenKH').value || '...';
  document.getElementById('printSDT').innerText = document.getElementById('inpSDT').value || '...';
  document.getElementById('printDiaChi').innerText = document.getElementById('inpDiaChi').value || '...';
  
  document.getElementById('printMaHD').innerText = "HD" + document.getElementById('inpMaHD').value;
  
  const ngay = document.getElementById('inpNgayLap').value;
  const d = new Date(ngay);
  document.getElementById('printNgayLap').innerText = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;

  // Kích hoạt dialog in của trình duyệt
  window.print();
}

/**
 * Hiển thị Lịch sử Hóa Đơn trong Modal
 */
function renderHistory() {
  const dsHoaDon = getHoaDon();
  const tbody = document.getElementById('tbodyHistory');
  tbody.innerHTML = '';

  if (dsHoaDon.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-3">Chưa có hóa đơn nào được lưu.</td></tr>';
    return;
  }

  dsHoaDon.forEach(hd => {
    const itemNames = hd.items.map(i => i.ten).join(', ');
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="fw-bold text-primary">${hd.maHD}</td>
      <td>${formatDate(hd.ngayLap)}</td>
      <td>
        <div class="fw-bold">${hd.khachHang.ten}</div>
      </td>
      <td>${hd.khachHang.sdt}</td>
      <td class="text-end fw-bold text-danger">${formatCurrency(hd.thanhTien)}</td>
      <td>
        <button class="btn btn-sm btn-outline-info" title="Xem sơ lược" onclick="alert('Các mặt hàng:\\n${itemNames}')">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function showToast(title, message, type) {
  const header = document.getElementById('toastHeader');
  document.getElementById('toastTitle').innerText = title;
  document.getElementById('toastMessage').innerText = message;
  
  header.className = 'toast-header text-white';
  if (type === 'success') {
    header.classList.add('bg-success');
    header.innerHTML = `<i class="fa-solid fa-circle-check me-2"></i><strong class="me-auto" id="toastTitle">${title}</strong><button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>`;
  } else {
    header.classList.add('bg-danger');
    header.innerHTML = `<i class="fa-solid fa-circle-xmark me-2"></i><strong class="me-auto" id="toastTitle">${title}</strong><button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>`;
  }

  toastNotif.show();
}
