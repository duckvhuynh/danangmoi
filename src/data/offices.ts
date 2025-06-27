export interface Office {
  id: string;
  name: string;
  type: 'city' | 'district' | 'ward';
  address: string;
  phone?: string;
  position: {
    lat: number;
    lng: number;
  };
  workingHours?: string;
  services?: string[];
}

// Mock data cho các trụ sở
export const offices: Office[] = [
  // Trụ sở UBND TP Đà Nẵng
  {
    id: 'city-danang',
    name: 'UBND TP. Đà Nẵng',
    type: 'city',
    address: '24 Trần Phú, Hải Châu, Đà Nẵng',
    phone: '0236.3821.234',
    position: {
      lat: 16.047079,
      lng: 108.206230
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:30',
    services: ['Hành chính công', 'Tiếp dân', 'Giải quyết thủ tục']
  },
  
  // Trụ sở các quận/huyện
  {
    id: 'district-hai-chau',
    name: 'UBND Quận Hải Châu',
    type: 'district',
    address: '396 Trần Hưng Đạo, Hải Châu, Đà Nẵng',
    phone: '0236.3822.468',
    position: {
      lat: 16.058716,
      lng: 108.214926
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:00',
    services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Giấy phép kinh doanh']
  },
  
  {
    id: 'district-cam-le',
    name: 'UBND Quận Cẩm Lệ',
    type: 'district',
    address: '55 Cách Mạng Tháng Tám, Cẩm Lệ, Đà Nẵng',
    phone: '0236.3653.409',
    position: {
      lat: 16.027556,
      lng: 108.174285
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:00',
    services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Giấy phép xây dựng']
  },
  
  {
    id: 'district-thanh-khe',
    name: 'UBND Quận Thanh Khê',
    type: 'district',
    address: '634 Nguyễn Tất Thành, Thanh Khê, Đà Nẵng',
    phone: '0236.3650.920',
    position: {
      lat: 16.073611,
      lng: 108.176667
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:00',
    services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Thủ tục đất đai']
  },
  
  {
    id: 'district-son-tra',
    name: 'UBND Quận Sơn Trà',
    type: 'district',
    address: '07 Hoàng Sa, Sơn Trà, Đà Nẵng',
    phone: '0236.3836.262',
    position: {
      lat: 16.095556,
      lng: 108.251389
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:00',
    services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Du lịch - dịch vụ']
  },
  
  {
    id: 'district-lien-chieu',
    name: 'UBND Quận Liên Chiểu',
    type: 'district',
    address: '16 Nguyễn Văn Linh, Liên Chiểu, Đà Nẵng',
    phone: '0236.3732.095',
    position: {
      lat: 16.070833,
      lng: 108.153611
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:00',
    services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Thủ tục đất đai']
  },
  
  {
    id: 'district-ngu-hanh-son',
    name: 'UBND Quận Ngũ Hành Sơn',
    type: 'district',
    address: '07 Nguyễn Khoa Văn, Ngũ Hành Sơn, Đà Nẵng',
    phone: '0236.3967.676',
    position: {
      lat: 15.979167,
      lng: 108.252778
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:00',
    services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Du lịch - dịch vụ']
  },
  
  {
    id: 'district-hoa-vang',
    name: 'UBND Huyện Hòa Vang',
    type: 'district',
    address: 'Hòa Phong, Hòa Vang, Đà Nẵng',
    phone: '0236.3681.109',
    position: {
      lat: 15.936111,
      lng: 108.097222
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:00',
    services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Nông nghiệp - nông thôn']
  },
  
  // Một số trụ sở phường mẫu
  {
    id: 'ward-hai-chau-1',
    name: 'UBND Phường Hải Châu I',
    type: 'ward',
    address: '12 Bạch Đằng, Hải Châu, Đà Nẵng',
    phone: '0236.3823.456',
    position: {
      lat: 16.047222,
      lng: 108.208611
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:00',
    services: ['Hộ khẩu', 'Tạm trú', 'Giấy chứng tử', 'Giấy khai sinh']
  },
  
  {
    id: 'ward-thanh-binh',
    name: 'UBND Phường Thanh Bình',
    type: 'ward',
    address: '45 Lê Duẩn, Hải Châu, Đà Nẵng',
    phone: '0236.3824.567',
    position: {
      lat: 16.065278,
      lng: 108.215278
    },
    workingHours: '7:30 - 11:30, 13:30 - 17:00',
    services: ['Hộ khẩu', 'Tạm trú', 'Giấy chứng tử', 'Giấy khai sinh']
  }
];
