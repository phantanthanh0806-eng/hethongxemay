// Đây là lớp helper dùng chung cho toàn bộ ứng dụng.
// Nó quản lý dữ liệu mẫu, localStorage và các hàm tiện ích cơ bản.
const STORAGE_KEYS = {
  bikes: 'htqb_bikes',
  parts: 'htqb_parts',
  invoices: 'htqb_invoices',
  draft: 'htqb_draft_invoice'
};

const defaultBikes = [
  {
    id: 'XE001',
    name: 'Honda Wave Alpha 110',
    brand: 'Honda',
    type: 'Underbone',
    engine: '110cc',
    color: 'Đỏ/Đen',
    year: 2024,
    purchasePrice: 18500000,
    salePrice: 21500000,
    stock: 12,
    description: 'Xe số Honda Wave Alpha 110cc thiết kế nhẹ nhàng, tiết kiệm nhiên liệu phù hợp di chuyển trong đô thị.',
    image: 'https://via.placeholder.com/640x420/0d6efd/ffffff?text=Honda+Wave+Alpha',
    gallery: [
      'https://via.placeholder.com/640x420/0d6efd/ffffff?text=Wave+Alpha+1',
      'https://via.placeholder.com/640x420/198754/ffffff?text=Wave+Alpha+2',
      'https://via.placeholder.com/640x420/f8f9fa/000000?text=Wave+Alpha+3'
    ],
    specs: {
      power: '8.2 kW',
      weight: '99 kg',
      length: '1.915 mm',
      width: '685 mm',
      height: '1.070 mm',
      tank: '3.7 L',
      consumption: '1.9 L/100km'
    },
    reviews: [
      { name: 'Huy', rating: 5, comment: 'Xe chạy êm, tiết kiệm xăng, dịch vụ tốt.' },
      { name: 'Lan', rating: 4, comment: 'Phong cách đơn giản, phù hợp đi lại hàng ngày.' }
    ]
  },
  {
    id: 'XE002',
    name: 'Yamaha Exciter 155',
    brand: 'Yamaha',
    type: 'Sport',
    engine: '155cc',
    color: 'Xanh/Đen',
    year: 2024,
    purchasePrice: 39500000,
    salePrice: 46900000,
    stock: 8,
    description: 'Exciter 155 mạnh mẽ, thiết kế thể thao, phù hợp khách hàng trẻ trung.',
    image: 'https://via.placeholder.com/640x420/0dcaf0/ffffff?text=Yamaha+Exciter',
    gallery: [
      'https://via.placeholder.com/640x420/0dcaf0/ffffff?text=Exciter+1',
      'https://via.placeholder.com/640x420/6610f2/ffffff?text=Exciter+2',
      'https://via.placeholder.com/640x420/212529/ffffff?text=Exciter+3'
    ],
    specs: {
      power: '11.3 kW',
      weight: '126 kg',
      length: '1.990 mm',
      width: '725 mm',
      height: '1.125 mm',
      tank: '5.4 L',
      consumption: '2.0 L/100km'
    },
    reviews: [
      { name: 'Nam', rating: 5, comment: 'Tốc độ tốt, thiết kế thể thao ấn tượng.' },
      { name: 'Trang', rating: 4, comment: 'Bánh xe đầm, phù hợp chạy phố và đường trường.' }
    ]
  },
  {
    id: 'XE003',
    name: 'Suzuki Raider R150',
    brand: 'Suzuki',
    type: 'Sport',
    engine: '150cc',
    color: 'Cam/Đen',
    year: 2024,
    purchasePrice: 49000000,
    salePrice: 55000000,
    stock: 6,
    description: 'Raider R150 nổi bật với động cơ mạnh và dáng lái thể thao.',
    image: 'https://via.placeholder.com/640x420/f08f00/ffffff?text=Suzuki+Raider',
    gallery: [
      'https://via.placeholder.com/640x420/f08f00/ffffff?text=Raider+1',
      'https://via.placeholder.com/640x420/6f42c1/ffffff?text=Raider+2',
      'https://via.placeholder.com/640x420/495057/ffffff?text=Raider+3'
    ],
    specs: {
      power: '12.5 kW',
      weight: '115 kg',
      length: '1.960 mm',
      width: '725 mm',
      height: '1.035 mm',
      tank: '4.5 L',
      consumption: '2.1 L/100km'
    },
    reviews: [
      { name: 'Phúc', rating: 5, comment: 'Dáng xe cực ngầu, động cơ bốc ngay từ đề.' }
    ]
  },
  {
    id: 'XE004',
    name: 'Piaggio Liberty 125',
    brand: 'Piaggio',
    type: 'Scooter',
    engine: '124cc',
    color: 'Trắng',
    year: 2024,
    purchasePrice: 61000000,
    salePrice: 69900000,
    stock: 5,
    description: 'Liberty 125 phong cách châu Âu, phù hợp khách hàng thành thị sang trọng.',
    image: 'https://via.placeholder.com/640x420/ffffff/000000?text=Piaggio+Liberty',
    gallery: [
      'https://via.placeholder.com/640x420/ffffff/000000?text=Liberty+1',
      'https://via.placeholder.com/640x420/0d6efd/ffffff?text=Liberty+2',
      'https://via.placeholder.com/640x420/6c757d/ffffff?text=Liberty+3'
    ],
    specs: {
      power: '8.5 kW',
      weight: '128 kg',
      length: '1.910 mm',
      width: '700 mm',
      height: '1.130 mm',
      tank: '6.5 L',
      consumption: '2.2 L/100km'
    },
    reviews: [
      { name: 'Thảo', rating: 4, comment: 'Thiết kế quý phái, xe chạy ổn định, phù hợp đi làm.' }
    ]
  },
  {
    id: 'XE005',
    name: 'SYM Shark Mini 50',
    brand: 'SYM',
    type: 'Scooter',
    engine: '49cc',
    color: 'Vàng',
    year: 2024,
    purchasePrice: 15900000,
    salePrice: 18500000,
    stock: 10,
    description: 'SYM Shark Mini nhỏ gọn, hợp di chuyển nội đô và chi phí vận hành thấp.',
    image: 'https://via.placeholder.com/640x420/ffc107/000000?text=SYM+Shark+Mini',
    gallery: [
      'https://via.placeholder.com/640x420/ffc107/000000?text=Shark+1',
      'https://via.placeholder.com/640x420/0d6efd/ffffff?text=Shark+2',
      'https://via.placeholder.com/640x420/198754/ffffff?text=Shark+3'
    ],
    specs: {
      power: '2.7 kW',
      weight: '88 kg',
      length: '1.760 mm',
      width: '690 mm',
      height: '1.005 mm',
      tank: '4.5 L',
      consumption: '1.5 L/100km'
    },
    reviews: [
      { name: 'Hạnh', rating: 4, comment: 'Nhỏ gọn, tiết kiệm xăng, phù hợp sinh viên và gia đình.' }
    ]
  },
  {
    id: 'XE006',
    name: 'Honda SH 125i',
    brand: 'Honda',
    type: 'Scooter',
    engine: '125cc',
    color: 'Đen',
    year: 2024,
    purchasePrice: 68000000,
    salePrice: 75900000,
    stock: 7,
    description: 'Honda SH 125i sang trọng, trang bị hiện đại, phù hợp khách hàng cao cấp.',
    image: 'https://via.placeholder.com/640x420/212529/ffffff?text=Honda+SH+125i',
    gallery: [
      'https://via.placeholder.com/640x420/212529/ffffff?text=SH+1',
      'https://via.placeholder.com/640x420/0d6efd/ffffff?text=SH+2',
      'https://via.placeholder.com/640x420/f8f9fa/000000?text=SH+3'
    ],
    specs: {
      power: '10.3 kW',
      weight: '134 kg',
      length: '2.035 mm',
      width: '740 mm',
      height: '1.150 mm',
      tank: '7.0 L',
      consumption: '2.5 L/100km'
    },
    reviews: [
      { name: 'Tuấn', rating: 5, comment: 'Đẳng cấp showroom, phù hợp khách hàng cần phong cách lịch lãm.' }
    ]
  },
  {
    id: 'XE007',
    name: 'Yamaha NVX 155',
    brand: 'Yamaha',
    type: 'Scooter',
    engine: '155cc',
    color: 'Xám',
    year: 2024,
    purchasePrice: 48500000,
    salePrice: 56900000,
    stock: 9,
    description: 'NVX 155 hiện đại với thiết kế cá tính, phù hợp người trẻ thành thị.',
    image: 'https://via.placeholder.com/640x420/6c757d/ffffff?text=Yamaha+NVX',
    gallery: [
      'https://via.placeholder.com/640x420/6c757d/ffffff?text=NVX+1',
      'https://via.placeholder.com/640x420/0d6efd/ffffff?text=NVX+2',
      'https://via.placeholder.com/640x420/198754/ffffff?text=NVX+3'
    ],
    specs: {
      power: '11.1 kW',
      weight: '132 kg',
      length: '1.980 mm',
      width: '700 mm',
      height: '1.125 mm',
      tank: '5.5 L',
      consumption: '2.2 L/100km'
    },
    reviews: [
      { name: 'Minh', rating: 5, comment: 'NVX chạy nhẹ, thiết kế mạnh mẽ, cảm giác lái tốt.' }
    ]
  },
  {
    id: 'XE008',
    name: 'Suzuki GSX S150',
    brand: 'Suzuki',
    type: 'Street',
    engine: '147cc',
    color: 'Xanh/Đen',
    year: 2024,
    purchasePrice: 52000000,
    salePrice: 59900000,
    stock: 4,
    description: 'GSX S150 phong cách đường phố, phù hợp người yêu tốc độ và kiểu dáng hầm hố.',
    image: 'https://via.placeholder.com/640x420/0d6efd/ffffff?text=Suzuki+GSX+S150',
    gallery: [
      'https://via.placeholder.com/640x420/0d6efd/ffffff?text=GSX+1',
      'https://via.placeholder.com/640x420/f8f9fa/000000?text=GSX+2',
      'https://via.placeholder.com/640x420/495057/ffffff?text=GSX+3'
    ],
    specs: {
      power: '14.1 kW',
      weight: '133 kg',
      length: '2.010 mm',
      width: '745 mm',
      height: '1.070 mm',
      tank: '11.0 L',
      consumption: '2.3 L/100km'
    },
    reviews: [
      { name: 'Linh', rating: 5, comment: 'Xe mạnh, hầm hố, phù hợp chạy đường dài và đường phố.' }
    ]
  },
  {
    id: 'XE009',
    name: 'Piaggio Medley 150',
    brand: 'Piaggio',
    type: 'Scooter',
    engine: '150cc',
    color: 'Xanh',
    year: 2024,
    purchasePrice: 68500000,
    salePrice: 75900000,
    stock: 5,
    description: 'Medley 150 sang trọng với động cơ ổn định và trang bị cao cấp.',
    image: 'https://via.placeholder.com/640x420/0dcaf0/ffffff?text=Piaggio+Medley',
    gallery: [
      'https://via.placeholder.com/640x420/0dcaf0/ffffff?text=Medley+1',
      'https://via.placeholder.com/640x420/6c757d/ffffff?text=Medley+2',
      'https://via.placeholder.com/640x420/ffffff/000000?text=Medley+3'
    ],
    specs: {
      power: '11.1 kW',
      weight: '153 kg',
      length: '1.970 mm',
      width: '720 mm',
      height: '1.270 mm',
      tank: '7.5 L',
      consumption: '2.4 L/100km'
    },
    reviews: [
      { name: 'Phương', rating: 4, comment: 'Thiết kế thanh lịch, phù hợp dùng hàng ngày và đi làm.' }
    ]
  },
  {
    id: 'XE010',
    name: 'SYM Elizabeth 125',
    brand: 'SYM',
    type: 'Scooter',
    engine: '125cc',
    color: 'Hồng',
    year: 2024,
    purchasePrice: 21900000,
    salePrice: 25900000,
    stock: 11,
    description: 'SYM Elizabeth 125 thiết kế nhẹ nhàng, phù hợp khách hàng nữ và đi phố.',
    image: 'https://via.placeholder.com/640x420/ff69b4/ffffff?text=SYM+Elizabeth',
    gallery: [
      'https://via.placeholder.com/640x420/ff69b4/ffffff?text=Elizabeth+1',
      'https://via.placeholder.com/640x420/0d6efd/ffffff?text=Elizabeth+2',
      'https://via.placeholder.com/640x420/6c757d/ffffff?text=Elizabeth+3'
    ],
    specs: {
      power: '6.5 kW',
      weight: '120 kg',
      length: '1.900 mm',
      width: '700 mm',
      height: '1.190 mm',
      tank: '5.7 L',
      consumption: '1.8 L/100km'
    },
    reviews: [
      { name: 'Nhung', rating: 4, comment: 'Thiết kế nữ tính, dễ sử dụng, phù hợp gia đình.' }
    ]
  }
];

const defaultParts = [
  { id: 'PT001', name: 'Lốp trước IRC NR-77 70/90-17', type: 'Lốp xe', purchasePrice: 320000, salePrice: 420000, stock: 42, supplier: 'Honda Genuine', image: 'https://via.placeholder.com/300x220/198754/ffffff?text=Lóp+trước', compatible: ['Wave Alpha', 'Wave RSX', 'Future'], description: 'Lốp chuyên dụng cho xe số và tay ga, độ bền cao.' },
  { id: 'PT002', name: 'Lốp sau IRC NR-77 80/90-17', type: 'Lốp xe', purchasePrice: 380000, salePrice: 470000, stock: 30, supplier: 'Yamaha Parts', image: 'https://via.placeholder.com/300x220/0d6efd/ffffff?text=Lóp+sau', compatible: ['Wave Alpha', 'Future', 'Exciter'], description: 'Lốp sau với khả năng bám đường tốt và chịu tải cao.' },
  { id: 'PT003', name: 'Dầu nhớt Motul 3000 4T', type: 'Dầu nhớt', purchasePrice: 85000, salePrice: 115000, stock: 64, supplier: 'Motul', image: 'https://via.placeholder.com/300x220/ffc107/000000?text=Dầu+nhột', compatible: ['Wave Alpha', 'Winner X', 'SH'], description: 'Nhớt tổng hợp cao cấp giúp động cơ sạch và êm.' },
  { id: 'PT004', name: 'Bình ắc quy Yuasa YTZ7S', type: 'Bình ắc quy', purchasePrice: 620000, salePrice: 780000, stock: 18, supplier: 'Yuasa', image: 'https://via.placeholder.com/300x220/6c757d/ffffff?text=Ác+quy+Yuasa', compatible: ['SH', 'Exciter', 'CB150R'], description: 'Ắc quy chuẩn hiệu suất cao, khởi động nhanh.' },
  { id: 'PT005', name: 'Đèn pha LED Honda Wave RSX', type: 'Đèn xe', purchasePrice: 115000, salePrice: 165000, stock: 27, supplier: 'Honda Genuine', image: 'https://via.placeholder.com/300x220/d63384/ffffff?text=Đèn+pha', compatible: ['Wave RSX', 'Wave Alpha'], description: 'Đèn LED chiếu sáng mạnh, tiết kiệm điện.' },
  { id: 'PT006', name: 'Gương chiếu hậu Honda SH', type: 'Gương chiếu hậu', purchasePrice: 52000, salePrice: 78000, stock: 35, supplier: 'Honda Genuine', image: 'https://via.placeholder.com/300x220/0dcaf0/ffffff?text=Gương', compatible: ['SH', 'Liberty', 'NVX'], description: 'Gương thiết kế tinh tế, chống chói khi đi đêm.' },
  { id: 'PT007', name: 'Phanh đĩa Brembo 220mm', type: 'Phanh', purchasePrice: 185000, salePrice: 235000, stock: 20, supplier: 'Brembo', image: 'https://via.placeholder.com/300x220/f03e3e/ffffff?text=Phaanh', compatible: ['Winner X', 'Exciter', 'CB150R'], description: 'Phanh đĩa hiệu suất cao cho phản hồi chính xác.' },
  { id: 'PT008', name: 'Nhông sên dĩa DID 428', type: 'Nhông sên dĩa', purchasePrice: 145000, salePrice: 225000, stock: 38, supplier: 'DID', image: 'https://via.placeholder.com/300x220/6610f2/ffffff?text=Nhông+sên', compatible: ['Wave Alpha', 'Future', 'Winner X'], description: 'Bộ truyền động chất lượng cao, độ bền vượt trội.' },
  { id: 'PT009', name: 'Bugi NGK CR6HSA', type: 'Động cơ', purchasePrice: 25000, salePrice: 45000, stock: 52, supplier: 'NGK', image: 'https://via.placeholder.com/300x220/0dcaf0/ffffff?text=Bụgi', compatible: ['Wave Alpha', 'Future', 'Winner X'], description: 'Bugi hiệu suất cao cho đánh lửa ổn định.' },
  { id: 'PT010', name: 'Yên xe Wave Alpha đen', type: 'Gương chiếu hậu', purchasePrice: 310000, salePrice: 420000, stock: 22, supplier: 'Honda Genuine', image: 'https://via.placeholder.com/300x220/212529/ffffff?text=Yên+xe', compatible: ['Wave Alpha', 'Wave RSX'], description: 'Yên xe bọc nỉ cao cấp, chống nước tốt.' }
];

const defaultInvoices = [];

function getStoredData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function setStoredData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function initAppData() {
  if (!localStorage.getItem(STORAGE_KEYS.bikes)) {
    setStoredData(STORAGE_KEYS.bikes, defaultBikes);
  }
  if (!localStorage.getItem(STORAGE_KEYS.parts)) {
    setStoredData(STORAGE_KEYS.parts, defaultParts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.invoices)) {
    setStoredData(STORAGE_KEYS.invoices, defaultInvoices);
  }
}

function getBikes() {
  initAppData();
  return getStoredData(STORAGE_KEYS.bikes);
}

function getParts() {
  initAppData();
  return getStoredData(STORAGE_KEYS.parts);
}

function getInvoices() {
  initAppData();
  return getStoredData(STORAGE_KEYS.invoices);
}

function saveBikes(bikes) {
  setStoredData(STORAGE_KEYS.bikes, bikes);
}

function saveParts(parts) {
  setStoredData(STORAGE_KEYS.parts, parts);
}

function saveInvoices(invoices) {
  setStoredData(STORAGE_KEYS.invoices, invoices);
}

function saveDraftInvoice(draft) {
  setStoredData(STORAGE_KEYS.draft, draft);
}

function getDraftInvoice() {
  return getStoredData(STORAGE_KEYS.draft) || {};
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('vi-VN') + ' ₫';
}

function parseNumber(value) {
  if (typeof value === 'number') return value;
  return Number(String(value).replace(/[^0-9.-]+/g, '')) || 0;
}

function generateId(prefix, list) {
  const existing = list.filter(item => item.id.startsWith(prefix));
  const next = existing.length + 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container position-fixed top-0 end-0 p-3';
  document.body.appendChild(container);
  return container;
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-bg-${type} border-0 show`;
  toast.role = 'alert';
  toast.ariaLive = 'assertive';
  toast.ariaAtomic = 'true';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
    </div>
  `;
  container.appendChild(toast);
  toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
  setTimeout(() => toast.remove(), 4500);
}

function watchScrollReveal() {
  const elements = Array.from(document.querySelectorAll('.scroll-fade'));
  if (!elements.length) return;

  const reveal = () => {
    const triggerBottom = window.innerHeight * 0.9;
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add('visible');
      }
    });
  };

  reveal();
  window.addEventListener('scroll', reveal);
}

document.addEventListener('DOMContentLoaded', () => {
  initAppData();
  watchScrollReveal();
});
