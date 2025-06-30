import administrativeData from './administrative-information.json';

export interface Office {
  id: string;
  name: string;
  type: 'commune' | 'ward' | 'special';
  address: string;
  phone?: string;
  position: {
    lat: number;
    lng: number;
  };
  workingHours?: string;
  services?: string[];
}

// Determine office type based on is_commune flag and special cases
const determineOfficeType = (item: { 
  new_commune_ward: string; 
  old_commune_ward?: string;
  is_commune?: boolean;
}): Office['type'] => {
  const name = item.new_commune_ward || '';
  
  // Handle Hoàng Sa and other special cases
  if (name.includes('Đặc khu') || name.includes('Hoàng Sa')) {
    return 'special';
  }
  
  // Based on is_commune flag
  if (item.is_commune === true) {
    return 'commune';
  } else if (item.is_commune === false) {
    return 'ward';
  } else {
    // Fallback if is_commune is undefined
    return 'ward';
  }
};

// Transform commune/ward data into office format
export const getOfficesFromAdministrativeData = (): Office[] => {
  // Start with default city and district offices
  const offices: Office[] = [
    // Special administrative zone - Hoàng Sa
    {
      id: 'special-hoang-sa',
      name: 'Đặc khu Hoàng Sa',
      type: 'special',
      address: 'Quần đảo Hoàng Sa, Đà Nẵng',
      position: {
        lat: 16.4402,  // Approximate coordinates for Hoàng Sa
        lng: 111.9136
      },
      workingHours: '7:30 - 11:30, 13:30 - 17:30',
    //   services: ['Quản lý hành chính', 'Bảo vệ chủ quyền']
    },
    
    // // District level offices
    // {
    //   id: 'district-hai-chau',
    //   name: 'UBND Quận Hải Châu',
    //   type: 'district',
    //   address: '396 Trần Hưng Đạo, Hải Châu, Đà Nẵng',
    //   phone: '0236.3822.468',
    //   position: {
    //     lat: 16.058716,
    //     lng: 108.214926
    //   },
    //   workingHours: '7:30 - 11:30, 13:30 - 17:00',
    //   services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Giấy phép kinh doanh']
    // },
    // {
    //   id: 'district-cam-le',
    //   name: 'UBND Quận Cẩm Lệ',
    //   type: 'district',
    //   address: '55 Cách Mạng Tháng Tám, Cẩm Lệ, Đà Nẵng',
    //   phone: '0236.3653.409',
    //   position: {
    //     lat: 16.027556,
    //     lng: 108.174285
    //   },
    //   workingHours: '7:30 - 11:30, 13:30 - 17:00',
    //   services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Giấy phép xây dựng']
    // },
    // {
    //   id: 'district-thanh-khe',
    //   name: 'UBND Quận Thanh Khê',
    //   type: 'district',
    //   address: '634 Nguyễn Tất Thành, Thanh Khê, Đà Nẵng',
    //   phone: '0236.3650.920',
    //   position: {
    //     lat: 16.073611,
    //     lng: 108.176667
    //   },
    //   workingHours: '7:30 - 11:30, 13:30 - 17:00',
    //   services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Thủ tục đất đai']
    // },
    // {
    //   id: 'district-son-tra',
    //   name: 'UBND Quận Sơn Trà',
    //   type: 'district',
    //   address: '07 Hoàng Sa, Sơn Trà, Đà Nẵng',
    //   phone: '0236.3836.262',
    //   position: {
    //     lat: 16.095556,
    //     lng: 108.251389
    //   },
    //   workingHours: '7:30 - 11:30, 13:30 - 17:00',
    //   services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Du lịch - dịch vụ']
    // },
    // {
    //   id: 'district-lien-chieu',
    //   name: 'UBND Quận Liên Chiểu',
    //   type: 'district',
    //   address: '16 Nguyễn Văn Linh, Liên Chiểu, Đà Nẵng',
    //   phone: '0236.3732.095',
    //   position: {
    //     lat: 16.070833,
    //     lng: 108.153611
    //   },
    //   workingHours: '7:30 - 11:30, 13:30 - 17:00',
    //   services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Thủ tục đất đai']
    // },
    // {
    //   id: 'district-hoa-vang',
    //   name: 'UBND Huyện Hòa Vang',
    //   type: 'district',
    //   address: 'Hòa Tiến, Hòa Vang, Đà Nẵng',
    //   phone: '0236.3786.567',
    //   position: {
    //     lat: 16.0155, 
    //     lng: 108.1021
    //   },
    //   workingHours: '7:30 - 11:30, 13:30 - 17:00',
    //   services: ['Đăng ký hộ khẩu', 'Cấp CCCD', 'Nông nghiệp - Thủy lợi']
    // }
  ];
  
  // Transform commune/ward data into offices
  administrativeData.commune_ward_list.forEach((item, index) => {
    // Skip if this is Hoàng Sa (we already added it manually)
    if (item.new_commune_ward === 'Đặc khu Hoàng Sa' || 
        (item.new_commune_ward && item.new_commune_ward.includes('Hoàng Sa'))) {
      return;
    }
    
    // Skip entries without location data
    if (!item.location || !item.location.latitude || !item.location.longitude) {
      return;
    }
    
    const officeType = determineOfficeType(item);
    const prefix = '';
    
    // Create appropriate name based on type
    let administrativePrefix = '';
    if (officeType === 'commune') {
      administrativePrefix = 'Xã';
    } else if (officeType === 'ward') {
      administrativePrefix = 'Phường';
    } else if (officeType === 'special') {
      administrativePrefix = 'Đặc khu';
    }
    
    // For special cases, avoid duplication in the name
    const displayName = item.new_commune_ward;
    if (officeType === 'special' && displayName.includes('Đặc khu')) {
      administrativePrefix = '';
    }
    
    offices.push({
      id: `${officeType}-${index}`,
      name: `${prefix} ${administrativePrefix} ${displayName}`.trim(),
      type: officeType,
      address: item.location.address || '',
      phone: item.location.phone, // Include phone number if available
      position: {
        lat: item.location.latitude,
        lng: item.location.longitude
      },
      workingHours: '7:30 - 11:30, 13:30 - 17:00',
    });
  });
  
  return offices;
};

// Export the offices data for immediate use
export const offices = getOfficesFromAdministrativeData();
