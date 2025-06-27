# 🗺️ Đà Nẵng Mới - Tra Cứu Phường Xã

Ứng dụng web tra cứu thông tin phường xã mới của thành phố Đà Nẵng sau sáp nhập, có hiệu lực từ ngày 1/7/2025.

## ✨ Tính năng chính

### 🔍 Tra cứu & Tìm kiếm
- **Tìm kiếm địa chỉ cũ**: Nhập địa chỉ cũ để tìm phường xã mới tương ứng
- **Xác định vị trí**: Sử dụng GPS để xác định phường xã hiện tại
- **Click trên bản đồ**: Nhấp vào bất kỳ vị trí nào để xem thông tin phường xã

### 🗺️ Bản đồ tương tác
- **Hiển thị ranh giới**: Xem ranh giới các phường xã mới dưới dạng polygon trong suốt
- **Mã màu theo quận**: Mỗi quận/huyện có màu sắc riêng biệt
- **Tương tác hover**: Hiệu ứng khi di chuột qua các vùng
- **Zoom & pan**: Phóng to, thu nhỏ và di chuyển bản đồ tự do

### 🏢 Thông tin trụ sở
- **Hiển thị trụ sở**: Marker cho các trụ sở UBND thành phố, quận/huyện, phường/xã
- **Thông tin chi tiết**: Địa chỉ, điện thoại, giờ làm việc, dịch vụ
- **Chỉ đường**: Tích hợp tìm đường đến trụ sở

### 📊 Thống kê
- **Tổng quan**: Số lượng quận/huyện, phường/xã
- **Phân bố**: Thống kê phường xã theo từng quận/huyện
- **Thông báo**: Thông tin quan trọng về việc sáp nhập

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **Maps**: @vis.gl/react-google-maps
- **Icons**: Lucide React

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 18
- npm >= 9

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd danangmoi-app
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình Google Maps API
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Kích hoạt các API sau:
   - Maps JavaScript API
   - Places API (tùy chọn, cho tính năng tìm kiếm)
   - Geocoding API (tùy chọn, cho tính năng geocoding)
4. Tạo API Key
5. Sao chép API key và thay thế trong file `.env`:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Bước 4: Chạy ứng dụng
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── map/               # Map-related components
│   │   ├── MapContainer.tsx
│   │   ├── MapControls.tsx
│   │   ├── PolygonOverlay.tsx
│   │   ├── OfficeMarkers.tsx
│   │   └── UserLocationMarker.tsx
│   ├── sidebar/           # Sidebar components
│   ├── statistics/        # Statistics components
│   ├── AppSidebar.tsx     # Main sidebar
│   └── MainInterface.tsx  # Main interface component
├── data/
│   ├── danang_polygons.json  # Polygon data for wards
│   └── offices.ts            # Office locations data
└── lib/
    └── utils.ts           # Utility functions
```

## 📊 Dữ liệu

### Polygon Data (`danang_polygons.json`)
- Chứa tọa độ ranh giới các phường xã mới
- Format: GeoJSON với lat/lng coordinates
- Thông tin: district, ward, polygon coordinates

### Office Data (`offices.ts`)
- Thông tin các trụ sở UBND
- Bao gồm: tên, địa chỉ, tọa độ, điện thoại, giờ làm việc

## 🎨 UI/UX Features

### Responsive Design
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

### Accessibility
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ High contrast colors
- ✅ Touch-friendly interface

### Performance
- ✅ Map lazy loading
- ✅ Polygon optimization
- ✅ Component code splitting
- ✅ Image optimization

## 🔧 Development

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📝 TODO / Roadmap

### Phase 1 (Current) ✅
- [x] Basic map interface with polygons
- [x] Office markers and info windows
- [x] User location detection
- [x] Sidebar with search functionality
- [x] Statistics panel

### Phase 2 (Next)
- [ ] Advanced address search with autocomplete
- [ ] Directions integration
- [ ] Old address to new ward mapping
- [ ] Export functionality (PDF, CSV)

### Phase 3 (Future)
- [ ] AI-based branch optimization
- [ ] Multi-language support (EN/VI)
- [ ] Voice search for elderly users
- [ ] Public feedback system
- [ ] PWA support with offline capabilities

## 📄 License

Dự án được phát triển cho UBND TP. Đà Nẵng để phục vụ người dân.

## 🤝 Contributing

Để đóng góp vào dự án:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Hỗ trợ

- Email: support@danang.gov.vn
- Hotline: 1900.xxxx
- Website: https://danang.gov.vn

## 🖼️ Screenshots

### Giao diện chính
![Main Interface](./screenshots/main-interface.png)

### Tra cứu phường xã
![Ward Search](./screenshots/ward-search.png)

### Thông tin trụ sở
![Office Info](./screenshots/office-info.png)

## 📱 Mobile Experience

Ứng dụng được tối ưu hóa cho thiết bị di động với:
- Touch-friendly interface
- Responsive sidebar
- Optimized map controls
- Fast loading times
