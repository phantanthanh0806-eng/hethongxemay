/**
 * data.js - Lớp dữ liệu dùng chung cho toàn bộ hệ thống
 * Quản lý LocalStorage cho xe máy, phụ tùng, hóa đơn
 */

// =====================================================
// DỮ LIỆU MẪU XE MÁY
// =====================================================
const XE_MAY_MAU = [
  {
    id: "XM001",
    ten: "Honda Wave Alpha 110cc",
    hang: "Honda",
    loai: "Xe số",
    mau: "Đỏ đen",
    namSx: 2024,
    dungTich: "110cc",
    giaNhap: 15000000,
    giaBan: 18500000,
    tonKho: 12,
    trangThai: "Còn hàng",
    mota: "Honda Wave Alpha - mẫu xe số phổ thông được ưa chuộng nhất tại Việt Nam. Thiết kế trẻ trung, tiết kiệm nhiên liệu, phù hợp đi lại hàng ngày.",
    hinhAnh: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    thongSo: {
      congSuat: "8.38 mã lực",
      trongLuong: "96 kg",
      chieuDai: "1916 mm",
      chieuRong: "694 mm",
      chieuCao: "1074 mm",
      dungTichBinh: "3.7 lít",
      mucTieuHao: "1.8 lít/100km"
    },
    danhGia: [
      { ten: "Nguyễn Văn Minh", sao: 5, nhanXet: "Xe tốt, tiết kiệm xăng, đi rất êm. Rất hài lòng!", ngay: "2024-03-15" },
      { ten: "Trần Thị Hoa", sao: 4, nhanXet: "Thiết kế đẹp, giá hợp lý, chỉ tiếc là khoang chứa đồ nhỏ.", ngay: "2024-02-28" }
    ]
  },
  {
    id: "XM002",
    ten: "Yamaha Exciter 155 VVA",
    hang: "Yamaha",
    loai: "Xe côn tay",
    mau: "Xanh đen",
    namSx: 2024,
    dungTich: "155cc",
    giaNhap: 44000000,
    giaBan: 52500000,
    tonKho: 7,
    trangThai: "Còn hàng",
    mota: "Yamaha Exciter 155 VVA - Vua côn tay thế hệ mới với công nghệ VVA tiên tiến, thiết kế cực kỳ thể thao và năng động.",
    hinhAnh: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80",
    thongSo: {
      congSuat: "19.3 mã lực",
      trongLuong: "135 kg",
      chieuDai: "2005 mm",
      chieuRong: "725 mm",
      chieuCao: "1090 mm",
      dungTichBinh: "4.2 lít",
      mucTieuHao: "2.4 lít/100km"
    },
    danhGia: [
      { ten: "Lê Hoàng Nam", sao: 5, nhanXet: "Xe chạy rất mạnh, thiết kế cực ngầu, anh em ai cũng thích!", ngay: "2024-04-01" }
    ]
  },
  {
    id: "XM003",
    ten: "Honda SH 160i ABS",
    hang: "Honda",
    loai: "Xe tay ga",
    mau: "Trắng bạc",
    namSx: 2024,
    dungTich: "160cc",
    giaNhap: 68000000,
    giaBan: 79900000,
    tonKho: 5,
    trangThai: "Còn hàng",
    mota: "Honda SH 160i - Biểu tượng đẳng cấp của dòng xe tay ga cao cấp tại Việt Nam. Phanh ABS an toàn, thiết kế sang trọng.",
    hinhAnh: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80",
    thongSo: {
      congSuat: "15.2 mã lực",
      trongLuong: "133 kg",
      chieuDai: "1940 mm",
      chieuRong: "690 mm",
      chieuCao: "1150 mm",
      dungTichBinh: "8.0 lít",
      mucTieuHao: "2.2 lít/100km"
    },
    danhGia: [
      { ten: "Phạm Thị Lan", sao: 5, nhanXet: "Xe đẹp xuất sắc, đi phố rất sang. Hài lòng 100%!", ngay: "2024-03-20" },
      { ten: "Võ Văn Tuấn", sao: 4, nhanXet: "Chất lượng tốt nhưng giá hơi cao so với túi tiền.", ngay: "2024-02-10" }
    ]
  },
  {
    id: "XM004",
    ten: "Yamaha Grande Hybrid",
    hang: "Yamaha",
    loai: "Xe tay ga",
    mau: "Đỏ hồng",
    namSx: 2024,
    dungTich: "125cc",
    giaNhap: 36000000,
    giaBan: 43000000,
    tonKho: 9,
    trangThai: "Còn hàng",
    mota: "Yamaha Grande Hybrid - Xe tay ga thông minh dành cho phái đẹp với công nghệ Smart Motor Generator tiết kiệm nhiên liệu vượt trội.",
    hinhAnh: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
    thongSo: {
      congSuat: "9.4 mã lực",
      trongLuong: "110 kg",
      chieuDai: "1855 mm",
      chieuRong: "695 mm",
      chieuCao: "1100 mm",
      dungTichBinh: "5.0 lít",
      mucTieuHao: "1.7 lít/100km"
    },
    danhGia: [
      { ten: "Nguyễn Thị Mai", sao: 5, nhanXet: "Xe đẹp, tiết kiệm xăng cực kỳ, phụ nữ đi rất hợp!", ngay: "2024-04-05" }
    ]
  },
  {
    id: "XM005",
    ten: "Suzuki Raider R150 Fi",
    hang: "Suzuki",
    loai: "Xe côn tay",
    mau: "Vàng đen",
    namSx: 2023,
    dungTich: "150cc",
    giaNhap: 38000000,
    giaBan: 45000000,
    tonKho: 4,
    trangThai: "Còn hàng",
    mota: "Suzuki Raider R150 - Xe côn tay thể thao mạnh mẽ với thiết kế R-Series ấn tượng, phun xăng điện tử hiện đại.",
    hinhAnh: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600&q=80",
    thongSo: {
      congSuat: "17.4 mã lực",
      trongLuong: "128 kg",
      chieuDai: "2045 mm",
      chieuRong: "730 mm",
      chieuCao: "1080 mm",
      dungTichBinh: "11.0 lít",
      mucTieuHao: "2.5 lít/100km"
    },
    danhGia: []
  },
  {
    id: "XM006",
    ten: "Piaggio Liberty S 125",
    hang: "Piaggio",
    loai: "Xe tay ga",
    mau: "Xanh pastel",
    namSx: 2024,
    dungTich: "125cc",
    giaNhap: 52000000,
    giaBan: 61000000,
    tonKho: 3,
    trangThai: "Còn hàng",
    mota: "Piaggio Liberty S - Dòng xe tay ga phong cách Ý thanh lịch, sang trọng. Thiết kế retro-modern độc đáo, phù hợp phong cách đô thị.",
    hinhAnh: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80",
    thongSo: {
      congSuat: "11.0 mã lực",
      trongLuong: "116 kg",
      chieuDai: "1845 mm",
      chieuRong: "770 mm",
      chieuCao: "1115 mm",
      dungTichBinh: "8.6 lít",
      mucTieuHao: "2.5 lít/100km"
    },
    danhGia: [
      { ten: "Đặng Thị Thu", sao: 5, nhanXet: "Xe Ý đẹp quá, đi phố ai cũng ngoái nhìn!", ngay: "2024-03-28" }
    ]
  },
  {
    id: "XM007",
    ten: "SYM Attila Elizabeth",
    hang: "SYM",
    loai: "Xe tay ga",
    mau: "Đen bóng",
    namSx: 2023,
    dungTich: "125cc",
    giaNhap: 18000000,
    giaBan: 22000000,
    tonKho: 15,
    trangThai: "Còn hàng",
    mota: "SYM Attila Elizabeth - Xe tay ga nữ tính, sang trọng với mức giá phải chăng. Tiết kiệm nhiên liệu, phù hợp dùng hàng ngày.",
    hinhAnh: "https://images.unsplash.com/photo-1508357710528-af54f7618754?w=600&q=80",
    thongSo: {
      congSuat: "9.0 mã lực",
      trongLuong: "105 kg",
      chieuDai: "1770 mm",
      chieuRong: "680 mm",
      chieuCao: "1090 mm",
      dungTichBinh: "5.8 lít",
      mucTieuHao: "1.9 lít/100km"
    },
    danhGia: []
  },
  {
    id: "XM008",
    ten: "Honda Winner X 150cc",
    hang: "Honda",
    loai: "Xe côn tay",
    mau: "Cam đen",
    namSx: 2024,
    dungTich: "150cc",
    giaNhap: 40000000,
    giaBan: 47500000,
    tonKho: 6,
    trangThai: "Còn hàng",
    mota: "Honda Winner X - Xe côn tay thể thao hiện đại nhất của Honda, thiết kế cứng cáp, mạnh mẽ với công nghệ PGM-FI thông minh.",
    hinhAnh: "https://images.unsplash.com/photo-1517994112540-009c47ea476b?w=600&q=80",
    thongSo: {
      congSuat: "16.6 mã lực",
      trongLuong: "126 kg",
      chieuDai: "2022 mm",
      chieuRong: "728 mm",
      chieuCao: "1083 mm",
      dungTichBinh: "4.5 lít",
      mucTieuHao: "2.1 lít/100km"
    },
    danhGia: [
      { ten: "Trần Thanh Bình", sao: 5, nhanXet: "Xe mạnh, nhìn ngầu, chạy tour rất tốt!", ngay: "2024-04-10" }
    ]
  },
  {
    id: "XM009",
    ten: "Yamaha NVX 155 VVA",
    hang: "Yamaha",
    loai: "Xe tay ga",
    mau: "Đen mờ",
    namSx: 2024,
    dungTich: "155cc",
    giaNhap: 48000000,
    giaBan: 57000000,
    tonKho: 8,
    trangThai: "Còn hàng",
    mota: "Yamaha NVX 155 VVA - Xe tay ga thể thao mạnh mẽ với thiết kế aerodynamic đỉnh cao, phù hợp cho những ai yêu phong cách sporty.",
    hinhAnh: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&q=80",
    thongSo: {
      congSuat: "15.3 mã lực",
      trongLuong: "127 kg",
      chieuDai: "1920 mm",
      chieuRong: "710 mm",
      chieuCao: "1145 mm",
      dungTichBinh: "5.1 lít",
      mucTieuHao: "2.3 lít/100km"
    },
    danhGia: []
  },
  {
    id: "XM010",
    ten: "Honda Air Blade 125cc",
    hang: "Honda",
    loai: "Xe tay ga",
    mau: "Xám bạc",
    namSx: 2024,
    dungTich: "125cc",
    giaNhap: 29000000,
    giaBan: 35500000,
    tonKho: 10,
    trangThai: "Còn hàng",
    mota: "Honda Air Blade 125 - Xe tay ga thể thao bán chạy nhất Việt Nam với thiết kế sắc nét, khỏe khoắn và tiết kiệm nhiên liệu.",
    hinhAnh: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&q=80",
    thongSo: {
      congSuat: "10.8 mã lực",
      trongLuong: "114 kg",
      chieuDai: "1904 mm",
      chieuRong: "705 mm",
      chieuCao: "1137 mm",
      dungTichBinh: "3.7 lít",
      mucTieuHao: "1.9 lít/100km"
    },
    danhGia: [
      { ten: "Hoàng Văn Đức", sao: 4, nhanXet: "Xe đẹp, đi ổn định, mình dùng 2 năm rồi rất hài lòng.", ngay: "2024-01-20" }
    ]
  },
  {
    id: "XM011",
    ten: "Suzuki GSX-S150",
    hang: "Suzuki",
    loai: "Xe côn tay",
    mau: "Trắng xanh",
    namSx: 2023,
    dungTich: "150cc",
    giaNhap: 42000000,
    giaBan: 49800000,
    tonKho: 3,
    trangThai: "Còn hàng",
    mota: "Suzuki GSX-S150 - Xe côn tay naked-sport với phong cách GSX-R huyền thoại thu nhỏ, phù hợp cho dân chơi xe thể thao.",
    hinhAnh: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    thongSo: {
      congSuat: "18.8 mã lực",
      trongLuong: "134 kg",
      chieuDai: "2020 mm",
      chieuRong: "740 mm",
      chieuCao: "1050 mm",
      dungTichBinh: "10.5 lít",
      mucTieuHao: "2.6 lít/100km"
    },
    danhGia: []
  },
  {
    id: "XM012",
    ten: "Piaggio Vespa GTS 300",
    hang: "Piaggio",
    loai: "Xe tay ga",
    mau: "Kem vàng",
    namSx: 2024,
    dungTich: "300cc",
    giaNhap: 145000000,
    giaBan: 168000000,
    tonKho: 2,
    trangThai: "Còn hàng",
    mota: "Vespa GTS 300 - Biểu tượng xe tay ga hạng sang của Ý, với động cơ 300cc mạnh mẽ, thiết kế cổ điển bất tử và cực kỳ sang trọng.",
    hinhAnh: "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=600&q=80",
    thongSo: {
      congSuat: "23.7 mã lực",
      trongLuong: "167 kg",
      chieuDai: "1940 mm",
      chieuRong: "780 mm",
      chieuCao: "1390 mm",
      dungTichBinh: "9.0 lít",
      mucTieuHao: "3.1 lít/100km"
    },
    danhGia: [
      { ten: "Nguyễn Quốc Huy", sao: 5, nhanXet: "Đỉnh cao xe Ý, đi đâu cũng được nhìn ngắm. Xứng đáng từng đồng!", ngay: "2024-04-15" }
    ]
  }
];

// =====================================================
// DỮ LIỆU MẪU PHỤ TÙNG
// =====================================================
const PHU_TUNG_MAU = [
  {
    id: "PT001",
    ten: "Lốp xe Michelin City Pro 80/90-17",
    loai: "Lốp xe",
    giaNhap: 350000,
    giaBan: 480000,
    tonKho: 50,
    nhaCungCap: "Michelin Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    moTa: "Lốp xe cao cấp Michelin dành cho xe máy phổ thông, bám đường tốt, bền bỉ."
  },
  {
    id: "PT002",
    ten: "Dầu nhớt Honda Ultra G1 10W-30",
    loai: "Dầu nhớt",
    giaNhap: 80000,
    giaBan: 120000,
    tonKho: 200,
    nhaCungCap: "Honda Parts Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&q=80",
    moTa: "Dầu nhớt chính hãng Honda, bảo vệ động cơ tối ưu cho xe máy Honda."
  },
  {
    id: "PT003",
    ten: "Bình ắc quy Yuasa YTZ7S 12V",
    loai: "Bình ắc quy",
    giaNhap: 450000,
    giaBan: 620000,
    tonKho: 30,
    nhaCungCap: "Yuasa Battery Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=200&q=80",
    moTa: "Bình ắc quy Yuasa chính hãng, tuổi thọ cao, ổn định cho các loại xe máy."
  },
  {
    id: "PT004",
    ten: "Đèn LED pha xe máy H4 6000K",
    loai: "Đèn xe",
    giaNhap: 150000,
    giaBan: 230000,
    tonKho: 80,
    nhaCungCap: "Philips Automotive",
    hinhAnh: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&q=80",
    moTa: "Đèn LED pha H4 ánh sáng trắng 6000K, tiết kiệm điện, tuổi thọ cao gấp 3 bóng thường."
  },
  {
    id: "PT005",
    ten: "Gương chiếu hậu xe máy chống chói",
    loai: "Gương chiếu hậu",
    giaNhap: 45000,
    giaBan: 75000,
    tonKho: 100,
    nhaCungCap: "PT Auto Parts",
    hinhAnh: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=200&q=80",
    moTa: "Gương chiếu hậu chất lượng cao, chống chói ban đêm, tầm nhìn rộng 180 độ."
  },
  {
    id: "PT006",
    ten: "Má phanh đĩa Wave Alpha chính hãng",
    loai: "Phanh",
    giaNhap: 55000,
    giaBan: 90000,
    tonKho: 60,
    nhaCungCap: "Honda Parts Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=200&q=80",
    moTa: "Má phanh đĩa chính hãng Honda cho Wave Alpha, đảm bảo phanh ăn, an toàn tuyệt đối."
  },
  {
    id: "PT007",
    ten: "Nhông sên dĩa Honda Wave 420H",
    loai: "Nhông sên dĩa",
    giaNhap: 120000,
    giaBan: 185000,
    tonKho: 40,
    nhaCungCap: "DID Chain Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=200&q=80",
    moTa: "Bộ nhông sên dĩa DID cao cấp cho Honda Wave, bền bỉ, truyền lực êm ái."
  },
  {
    id: "PT008",
    ten: "Lốp xe Dunlop Scootsmart 100/80-14",
    loai: "Lốp xe",
    giaNhap: 420000,
    giaBan: 590000,
    tonKho: 35,
    nhaCungCap: "Dunlop Tires Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1508357710528-af54f7618754?w=200&q=80",
    moTa: "Lốp xe tay ga Dunlop Scootsmart, bám đường xuất sắc, êm ru khi di chuyển."
  },
  {
    id: "PT009",
    ten: "Dầu nhớt Castrol Power1 4T 10W-40",
    loai: "Dầu nhớt",
    giaNhap: 95000,
    giaBan: 145000,
    tonKho: 150,
    nhaCungCap: "Castrol Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1517994112540-009c47ea476b?w=200&q=80",
    moTa: "Dầu nhớt Castrol Power1 4T bảo vệ động cơ toàn diện, giảm ma sát, kéo dài tuổi thọ xe."
  },
  {
    id: "PT010",
    ten: "Đèn xi-nhan LED nhấp nháy Exciter",
    loai: "Đèn xe",
    giaNhap: 85000,
    giaBan: 140000,
    tonKho: 45,
    nhaCungCap: "Yamaha Parts Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=200&q=80",
    moTa: "Đèn xi-nhan LED cho Yamaha Exciter, nhấp nháy đẹp, tiết kiệm điện, dễ lắp đặt."
  },
  {
    id: "PT011",
    ten: "Bình ắc quy GS MF 12V 5Ah",
    loai: "Bình ắc quy",
    giaNhap: 280000,
    giaBan: 390000,
    tonKho: 25,
    nhaCungCap: "GS Battery Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=200&q=80",
    moTa: "Bình ắc quy GS MF không cần bảo dưỡng, phù hợp xe số, xe tay ga cỡ nhỏ."
  },
  {
    id: "PT012",
    ten: "Phanh tang trống Honda Click chính hãng",
    loai: "Phanh",
    giaNhap: 65000,
    giaBan: 105000,
    tonKho: 55,
    nhaCungCap: "Honda Parts Vietnam",
    hinhAnh: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80",
    moTa: "Má phanh tang trống chính hãng Honda dành cho Click, đảm bảo an toàn và hiệu quả phanh tối ưu."
  }
];

// =====================================================
// LOCALSTORGE HELPERS
// =====================================================

const STORAGE_KEYS = {
  XE_MAY: "hethong_xe_may",
  PHU_TUNG: "hethong_phu_tung",
  HOA_DON: "hethong_hoa_don",
  DANH_GIA: "hethong_danh_gia",
  CART: "hethong_cart"
};

/**
 * Khởi tạo dữ liệu mẫu nếu chưa có trong LocalStorage
 */
function initData() {
  const DATA_VERSION = "1.2";
  if (localStorage.getItem("data_version") !== DATA_VERSION) {
    // Force reload dữ liệu gốc để khắc phục lỗi hình ảnh
    localStorage.setItem(STORAGE_KEYS.XE_MAY, JSON.stringify(XE_MAY_MAU));
    localStorage.setItem(STORAGE_KEYS.PHU_TUNG, JSON.stringify(PHU_TUNG_MAU));
    if (!localStorage.getItem(STORAGE_KEYS.HOA_DON)) {
      localStorage.setItem(STORAGE_KEYS.HOA_DON, JSON.stringify([]));
    }
    localStorage.setItem("data_version", DATA_VERSION);
  }
}

// --- Xe máy ---
function getXeMay() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.XE_MAY)) || [];
}
function saveXeMay(data) {
  localStorage.setItem(STORAGE_KEYS.XE_MAY, JSON.stringify(data));
}
function getXeById(id) {
  return getXeMay().find(x => x.id === id);
}

// --- Phụ tùng ---
function getPhuTung() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PHU_TUNG)) || [];
}
function savePhuTung(data) {
  localStorage.setItem(STORAGE_KEYS.PHU_TUNG, JSON.stringify(data));
}

// --- Hóa đơn ---
function getHoaDon() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.HOA_DON)) || [];
}
function saveHoaDon(data) {
  localStorage.setItem(STORAGE_KEYS.HOA_DON, JSON.stringify(data));
}

// --- Giỏ hàng (cart) ---
function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
}
function saveCart(data) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(data));
}
function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.CART);
}

// --- Tiện ích ---
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function generateId(prefix) {
  const num = Date.now().toString().slice(-6);
  return `${prefix}${num}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}

// Khởi tạo dữ liệu khi load trang
initData();
