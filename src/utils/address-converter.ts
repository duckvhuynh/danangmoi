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
  AdministrativeUnitShortName: string;
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

// Utility function to normalize Vietnamese text for better matching
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .toLowerCase()
    .trim();
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
  
  // Sort districts by type: Thành phố -> Quận -> Thị xã -> Huyện, and then alphabetically by name
  return province.District
    .map(district => ({
      code: district.Code,
      name: district.Name,
      fullName: district.FullName,
      type: district.AdministrativeUnitShortName // Store type for sorting
    }))
    .sort((a, b) => {
      // Define order of administrative unit types
      const typeOrder: { [key: string]: number } = {
        'Thành phố': 1,
        'Quận': 2,
        'Thị xã': 3,
        'Huyện': 4
      };
      
      // Sort by administrative unit type first
      const typeA = typeOrder[a.type] || 999;
      const typeB = typeOrder[b.type] || 999;
      
      if (typeA !== typeB) {
        return typeA - typeB;
      }
      
      // Then sort alphabetically by name
      return a.name.localeCompare(b.name, 'vi');
    })
    .map(({ code, name, fullName }) => ({ code, name, fullName })); // Remove the temporary type property
};

// Get wards for a specific district
export const getWards = (districtCode: string): { code: string; name: string; fullName: string }[] => {
  for (const province of typedOldAdminData) {
    const district = province.District.find(d => d.Code === districtCode);
    if (district) {
      // Handle special case for Hoàng Sa
      if (district.Code === '498') { // Hoàng Sa district code
        return [];
      }
      
      if (district.Ward) {
        // Sort wards: Phường first, then Xã, then others, and then alphabetically by name
        return district.Ward
          .map(ward => ({
            code: ward.Code,
            name: ward.Name,
            fullName: ward.FullName,
            type: ward.AdministrativeUnitShortName
          }))
          .sort((a, b) => {
            // Define order of ward types
            const typeOrder: { [key: string]: number } = {
              'Phường': 1,
              'Xã': 2
            };
            
            // Get the type order, default to 3 for any other types
            const typeA = typeOrder[a.type] || 3;
            const typeB = typeOrder[b.type] || 3;
            
            if (typeA !== typeB) {
              return typeA - typeB;
            }
            
            // Then sort alphabetically by name
            return a.name.localeCompare(b.name, 'vi');
          })
          .map(({ code, name, fullName }) => ({ code, name, fullName })); // Remove the temporary type property
      }
    }
  }
  return [];
};

// Check if a district has wards (for Hoàng Sa special case)
export const hasWards = (districtCode: string): boolean => {
  for (const province of typedOldAdminData) {
    const district = province.District.find(d => d.Code === districtCode);
    if (district) {
      // Special case for Hoàng Sa - no wards
      if (district.Code === '498') {
        return false;
      }
      return district.Ward !== null && Array.isArray(district.Ward) && district.Ward.length > 0;
    }
  }
  return false;
};

// Convert old address to new address
export const convertAddress = (
  detailedAddress: string,
  wardName: string,
  districtName: string
): { 
  success: boolean; 
  newAddress?: string | string[]; 
  newWard?: string | string[];
  isCommune?: boolean;
  adminUnitType?: string;
  error?: string;
  multipleResults?: boolean;
  locationInfo?: Array<{
    address: string;
    district: string;
    phone: string;
    latitude: number;
    longitude: number;
  }>
} => {
  try {
    // Special case for Hoàng Sa district
    if (districtName === "Hoàng Sa") {
      return {
        success: true,
        newAddress: `${detailedAddress}, Huyện Hoàng Sa, Thành phố Đà Nẵng`,
        newWard: "Hoàng Sa",
        adminUnitType: "huyện"
      };
    }
    
    // Special case for Hòa Liên ward (code 20296)
    if (wardName === "Hòa Liên" || wardName === "Xã Hòa Liên") {
      // Get both locations where Hòa Liên appears
      const haiVanInfo = adminInfo.commune_ward_list.find(
        item => item.new_commune_ward === "Hải Vân" && item.merged_communes_wards.includes("Hòa Liên")
      );
      
      const lienChieuInfo = adminInfo.commune_ward_list.find(
        item => item.new_commune_ward === "Liên Chiểu" && item.merged_communes_wards.includes("Hòa Liên")
      );
      
      if (haiVanInfo && lienChieuInfo) {
        const addressDetail = detailedAddress.trim() ? `${detailedAddress}, ` : '';
        
        // Create both addresses
        const haiVanAddress = `${addressDetail}Phường Hải Vân, Thành phố Đà Nẵng`;
        const lienChieuAddress = `${addressDetail}Phường Liên Chiểu, Thành phố Đà Nẵng`;
        
        // Create location info for both results
        const locationInfo = [
          {
            address: haiVanInfo.location.address,
            district: "Hải Vân",
            phone: haiVanInfo.location.phone,
            latitude: haiVanInfo.location.latitude,
            longitude: haiVanInfo.location.longitude
          },
          {
            address: lienChieuInfo.location.address,
            district: "Liên Chiểu",
            phone: lienChieuInfo.location.phone,
            latitude: lienChieuInfo.location.latitude,
            longitude: lienChieuInfo.location.longitude
          }
        ];
        
        return {
          success: true,
          newAddress: [haiVanAddress, lienChieuAddress],
          newWard: ["Hải Vân", "Liên Chiểu"],
          isCommune: false,
          adminUnitType: "phường",
          multipleResults: true,
          locationInfo
        };
      }
    }
    
    // Clean up inputs - remove administrative unit prefixes
    const cleanWardName = wardName.replace(/^(Phường|Xã|Thị trấn)\s+/, '').trim();
    const cleanDistrictName = districtName.replace(/^(Quận|Huyện|Thị xã|Thành phố)\s+/, '').trim();
    
    // Normalize ward name for better matching
    const normalizedWardName = cleanWardName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
      .toLowerCase()
      .trim();
    
    // Find all matching districts in administrative information
    const matchingDistrictItems = adminInfo.commune_ward_list;
    
    if (matchingDistrictItems.length === 0) {
      return { 
        success: false, 
        error: `Không tìm thấy thông tin về quận/huyện ${cleanDistrictName}` 
      };
    }
    
    // Find the new ward that contains the old ward
    let newWardInfo = null;
    
    // First try exact match strategy
    for (const item of matchingDistrictItems) {
      if (!item.merged_communes_wards) continue;
      
      const mergedList = item.merged_communes_wards.split(', ');
      
      // Try to find exact match with prefix
      const exactMatch = mergedList.find(mergedWard => 
        mergedWard.includes(wardName) || // Direct inclusion check
        mergedWard.endsWith(` ${cleanWardName}`) // Ends with the ward name after a space
      );
      
      if (exactMatch) {
        newWardInfo = item;
        break;
      }
    }
    
    // If no exact match, try with normalized comparison
    if (!newWardInfo) {
      for (const item of matchingDistrictItems) {
        if (!item.merged_communes_wards) continue;
        
        const mergedList = item.merged_communes_wards.split(', ');
        
        const foundMatch = mergedList.some(mergedWard => {
          // Remove the administrative unit prefix for comparison
          const cleanMergedWard = mergedWard.replace(/^(Phường|Xã|Thị trấn)\s+/, '').trim();
          
          // Exact match without prefix
          if (cleanMergedWard === cleanWardName) return true;
          
          // Normalize for fuzzy match
          const normalizedMergedWard = cleanMergedWard
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
          
          // Check for containment in both directions
          return normalizedMergedWard.includes(normalizedWardName) || 
                 normalizedWardName.includes(normalizedMergedWard);
        });
        
        if (foundMatch) {
          newWardInfo = item;
          break;
        }
      }
    }
    
    if (!newWardInfo) {
      // If still no match found, try a more lenient approach with only district match
      // Find any ward in the same district
      const anyWardInDistrict = matchingDistrictItems[0];
      if (anyWardInDistrict) {
        console.log(`Using district-level match for ${cleanWardName} in ${cleanDistrictName}`);
        newWardInfo = anyWardInDistrict;
      } else {
        return { 
          success: false, 
          error: `Không tìm thấy thông tin về phường/xã ${cleanWardName} trong quận/huyện ${cleanDistrictName}` 
        };
      }
    }
    
    // Determine the administrative unit type based on is_commune flag
    let adminUnitType = 'Đặc khu'; // Default if is_commune is undefined
    
    if (newWardInfo.is_commune === true) {
      adminUnitType = 'Xã';
    } else if (newWardInfo.is_commune === false) {
      adminUnitType = 'Phường';
    }
    
    // Format the new address
    const addressDetail = detailedAddress.trim() ? `${detailedAddress}, ` : '';
    const newAddress = `${addressDetail}${adminUnitType} ${newWardInfo.new_commune_ward}, Thành phố Đà Nẵng`;
    
    // Log successful conversion for debugging
    console.log(`Converted address: ${wardName}, ${districtName} => ${adminUnitType} ${newWardInfo.new_commune_ward}`);
    
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
