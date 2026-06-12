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

  // Chỉ cho lưu khi: Form valid, Tên và SĐT có dữ liệu, và Giỏ hàng có đồ
  if (formValid && ten && sdt && hasItems) {
    btnSave.disabled = false;
  } else {
    btnSave.disabled = true;
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
  
  // Tùy chọn: Tự động reset form
  setTimeout(() => {
    document.getElementById('formKhachHang').reset();
    initInvoiceForm();
    renderInvoiceTable();
  }, 1000);
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
        <div class="d-flex justify-content-center gap-1">
          <button class="btn btn-sm btn-outline-info" title="Xem sơ lược" onclick="alert('Các mặt hàng:\\n${itemNames}')">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary" title="In Hóa Đơn" onclick="printHistoryInvoice('${hd.maHD}')">
            <i class="fa-solid fa-print"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" title="Xuất PDF" onclick="exportHistoryInvoicePDF('${hd.maHD}')">
            <i class="fa-solid fa-file-pdf"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Xây dựng giao diện Hóa Đơn ảo để In hoặc Xuất PDF
 */
function buildHistoryInvoiceDOM(hd) {
  const wrapper = document.createElement('div');
  wrapper.style.width = '800px';
  wrapper.style.padding = '20px';
  wrapper.style.backgroundColor = '#fff';
  wrapper.style.color = '#000';
  wrapper.style.fontFamily = 'Arial, sans-serif';

  const d = new Date(hd.ngayLap);
  const ngayStr = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;

  let itemsHTML = '';
  hd.items.forEach((item, index) => {
    const badgeType = item.type === 'xe' ? 'Xe' : 'PT';
    itemsHTML += `
      <tr>
        <td style="text-align:center; border:1px solid #ddd; padding:8px;">${index + 1}</td>
        <td style="border:1px solid #ddd; padding:8px;">
          <strong>${item.ten}</strong> <span style="font-size:12px; color:#666;">(${badgeType})</span>
        </td>
        <td style="text-align:right; border:1px solid #ddd; padding:8px;">${formatCurrency(item.gia)}</td>
        <td style="text-align:center; border:1px solid #ddd; padding:8px;">${item.soLuong}</td>
        <td style="text-align:right; border:1px solid #ddd; padding:8px; font-weight:bold;">${formatCurrency(item.gia * item.soLuong)}</td>
      </tr>
    `;
  });

  wrapper.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #ddd; color: #000;">
      <h2 style="margin-bottom: 5px; font-weight: bold;">MOTOSYS</h2>
      <p style="margin:0; font-size: 14px;">123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
      <p style="margin:0; font-size: 14px;">Hotline: 1900 xxxx - Email: contact@motosys.vn</p>
      <h3 style="margin-top: 15px; text-transform: uppercase; font-weight: bold;">Hóa Đơn Bán Hàng</h3>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div>
        <p style="margin: 0 0 5px 0;"><strong>Khách hàng:</strong> ${hd.khachHang.ten}</p>
        <p style="margin: 0 0 5px 0;"><strong>SĐT:</strong> ${hd.khachHang.sdt}</p>
        <p style="margin: 0;"><strong>Địa chỉ:</strong> ${hd.khachHang.diaChi || '...'}</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0 0 5px 0;"><strong>Số HĐ:</strong> ${hd.maHD}</p>
        <p style="margin: 0;"><strong>Ngày lập:</strong> ${ngayStr}</p>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead style="background-color: #f8f9fa;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 50px;">STT</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Tên Sản Phẩm</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: right; width: 120px;">Đơn Giá</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 80px;">SL</th>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: right; width: 120px;">Thành Tiền</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
      <div style="width: 300px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Cộng tiền hàng:</span>
          <strong>${formatCurrency(hd.tamTinh)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Chiết khấu (%):</span>
          <strong>${hd.chietKhau || 0}%</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: red;">
          <span>Giảm giá:</span>
          <strong>- ${formatCurrency(hd.giamGia)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Thuế VAT (10%):</span>
          <strong>${formatCurrency(hd.vat)}</strong>
        </div>
        <hr style="margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 18px;">
          <span style="font-weight: bold; text-transform: uppercase;">Tổng Cộng:</span>
          <strong style="color: #0d6efd;">${formatCurrency(hd.thanhTien)}</strong>
        </div>
      </div>
    </div>

    <div style="display: flex; text-align: center; margin-top: 50px;">
      <div style="flex: 1;">
        <strong>Người mua hàng</strong>
        <p style="font-size: 12px; color: #666; margin-top: 5px;">(Ký, ghi rõ họ tên)</p>
      </div>
      <div style="flex: 1;">
        <strong>Người bán hàng</strong>
        <p style="font-size: 12px; color: #666; margin-top: 5px;">(Ký, ghi rõ họ tên)</p>
      </div>
    </div>
  `;
  return wrapper;
}

/**
 * In Hóa Đơn Cũ
 */
function printHistoryInvoice(maHD) {
  const dsHoaDon = getHoaDon();
  const hd = dsHoaDon.find(x => x.maHD === maHD);
  if(!hd) return;

  const invoiceDOM = buildHistoryInvoiceDOM(hd);
  
  // Mở cửa sổ mới ẩn để in
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  printWindow.document.write('<html><head><title>In Hóa Đơn ' + hd.maHD + '</title></head><body style="margin:0; padding:0;">');
  printWindow.document.write(invoiceDOM.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

/**
 * Xuất PDF Hóa Đơn Cũ
 */
function exportHistoryInvoicePDF(maHD) {
  if (typeof html2pdf === 'undefined') {
    alert("Thư viện tạo PDF chưa tải xong. Vui lòng tải lại trang (F5)!");
    return;
  }

  const dsHoaDon = getHoaDon();
  const hd = dsHoaDon.find(x => x.maHD === maHD);
  if(!hd) return;

  const invoiceDOM = buildHistoryInvoiceDOM(hd);
  
  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.left = '-9999px';
  wrapper.appendChild(invoiceDOM);
  document.body.appendChild(wrapper);

  const opt = {
    margin:       10,
    filename:     `HoaDon_${hd.maHD}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  showToast('Đang xử lý', 'Đang tạo file PDF, vui lòng đợi...', 'success');

  html2pdf().set(opt).from(invoiceDOM).save().then(() => {
    document.body.removeChild(wrapper);
    showToast('Thành công', 'Đã xuất file PDF hóa đơn cũ!', 'success');
  }).catch(err => {
    console.error("Lỗi xuất PDF cũ: ", err);
    document.body.removeChild(wrapper);
    showToast('Lỗi', 'Có lỗi khi xuất file PDF', 'error');
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
