import adminInfo from '../data/administrative-information.json';
import oldAdminData from '../data/danang-quangnam-old.json';

export interface OldWard {
  Type: string;
  Code: string;
  Name: string;
  FullName: string;
  DistrictCode: string;
  AdministrativeUnitShortName: string;
}

export interface OldDistrict {
  Type: string;
  Code: string;
  Name: string;
  FullName: string;
  ProvinceCode: string;
  Ward: OldWard[];
}

export interface OldProvince {
  Type: string;
  Code: string;
  Name: string;
  FullName: string;
  District: OldDistrict[];
}

// Type guard to check if the data conforms to OldProvince structure
function isOldAdminData(data: unknown): data is OldProvince[] {
  return Array.isArray(data) && 
    data.every(item => 
      typeof item === 'object' && 
      item !== null &&
      'Type' in item && 
      'Code' in item && 
      'Name' in item && 
      'District' in item &&
      Array.isArray((item as OldProvince).District)
    );
}

// Verify and cast data
const typedOldAdminData: OldProvince[] = isOldAdminData(oldAdminData) ? oldAdminData : [];

// Get provinces for selection
export const getProvinces = (): { code: string; name: string; fullName: string }[] => {
  return typedOldAdminData.map(province => ({
    code: province.Code,
    name: province.Name,
    fullName: province.FullName
  }));
};

// Get districts for a specific province
export const getDistricts = (provinceCode: string): { code: string; name: string; fullName: string }[] => {
  const province = typedOldAdminData.find(p => p.Code === provinceCode);
  if (!province) return [];
  
  return province.District.map(district => ({
    code: district.Code,
    name: district.Name,
    fullName: district.FullName
  }));
};

// Get wards for a specific district
export const getWards = (districtCode: string): { code: string; name: string; fullName: string }[] => {
  for (const province of typedOldAdminData) {
    const district = province.District.find(d => d.Code === districtCode);
    if (district && district.Ward) {
      return district.Ward.map(ward => ({
        code: ward.Code,
        name: ward.Name,
        fullName: ward.FullName
      }));
    }
  }
  return [];
};

// Convert old address to new address
export const convertAddress = (
  detailedAddress: string,
  wardName: string,
  districtName: string
): { 
  success: boolean; 
  newAddress?: string; 
  newWard?: string;
  isCommune?: boolean;
  adminUnitType?: string;
  error?: string 
} => {
  try {
    // Clean up inputs
    const cleanWardName = wardName.replace(/^(Phường|Xã|Thị trấn)\s+/, '').trim();
    const cleanDistrictName = districtName.replace(/^(Quận|Huyện|Thị xã|Thành phố)\s+/, '').trim();
    
    // Find matching district in administrative information
    const districtInfo = adminInfo.commune_ward_list.find(
      item => item.old_commune_ward === cleanDistrictName
    );
    
    if (!districtInfo) {
      return { 
        success: false, 
        error: `Không tìm thấy thông tin về quận/huyện ${cleanDistrictName}` 
      };
    }
    
    // Find the new ward that contains the old ward
    const newWardInfo = adminInfo.commune_ward_list.find(item => {
      if (item.old_commune_ward !== cleanDistrictName) return false;
      
      // Check if this ward's merged_communes_wards contains our ward
      if (!item.merged_communes_wards) return false;
      
      const mergedList = item.merged_communes_wards.split(', ');
      
      // Normalize all text for comparison to handle edge cases with different prefixes and accents
      const normalizedWardName = wardName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/^(phuong|xa|thi tran)\s+/, '')
        .trim();
        
      return mergedList.some(mergedWard => {
        // We need to check both with and without administrative unit prefix
        // First check if it's exactly the same
        if (mergedWard === wardName) return true;
        
        // Then check if only the name part matches (without Phường/Xã prefix) with normalization
        const normalizedMergedWard = mergedWard
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/^(phuong|xa|thi tran)\s+/, '')
          .trim();
          
        return normalizedMergedWard === normalizedWardName;
      });
    });
    
    if (!newWardInfo) {
      return { 
        success: false, 
        error: `Không tìm thấy thông tin về phường/xã ${cleanWardName} trong quận/huyện ${cleanDistrictName}` 
      };
    }
    
    // Determine the administrative unit type based on is_commune flag
    let adminUnitType = 'đặc khu'; // Default if is_commune is undefined
    
    if (newWardInfo.is_commune === true) {
      adminUnitType = 'xã';
    } else if (newWardInfo.is_commune === false) {
      adminUnitType = 'phường';
    }
    
    // Format the new address
    const newAddress = `${detailedAddress}, ${adminUnitType} ${newWardInfo.new_commune_ward}, Thành phố Đà Nẵng`;
    
    return { 
      success: true, 
      newAddress,
      newWard: newWardInfo.new_commune_ward,
      isCommune: newWardInfo.is_commune,
      adminUnitType
    };
  } catch (error) {
    console.error("Error converting address:", error);
    return { 
      success: false, 
      error: 'Đã xảy ra lỗi khi chuyển đổi địa chỉ' 
    };
  }
};
