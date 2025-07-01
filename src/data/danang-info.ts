import adminInfo from './administrative-information.json';

// Parse and extract data from administrative-information.json
const metaData = adminInfo.metadata;
const cityInfo = metaData.city_info;
const adminStructure = metaData.administrative_structure;

// Get unique districts from commune_ward_list
const getDistricts = (): string[] => {
  const districts = new Set<string>();
  adminInfo.commune_ward_list.forEach(item => {
    if (item.old_commune_ward) {
      districts.add(item.old_commune_ward);
    }
  });
  return Array.from(districts);
};

// Group wards/communes by district
const getWardsByDistrict = () => {
  const wardsByDistrict: Record<string, {
    name: string;
    isCommune: boolean;
    population: number;
    area: number;
    mergedFrom: string;
  }[]> = {};
  
  adminInfo.commune_ward_list.forEach(item => {
    if (!wardsByDistrict[item.old_commune_ward]) {
      wardsByDistrict[item.old_commune_ward] = [];
    }
    
    wardsByDistrict[item.old_commune_ward].push({
      name: item.new_commune_ward,
      isCommune: item.is_commune,
      population: item.population,
      area: item.area_km2,
      mergedFrom: item.merged_communes_wards,
    });
  });
  
  return wardsByDistrict;
};

// Official Da Nang City Information with enriched data from administrative-information.json
export const DANANG_CITY_INFO = {
  // Basic information
  officialName: "Thành phố Đà Nẵng (mới)",
  shortName: "Đà Nẵng Mới",
  administrativeLevel: cityInfo.administrative_level,
  
  // Administrative structure
  totalAdministrativeUnits: adminStructure.total_subdivisions,
  districts: getDistricts(),
  wards: adminStructure.wards,
  communes: adminStructure.communes,
  specialZones: adminStructure.special_zones || 1,
  specialZoneName: "Hoàng Sa",
  wardsByDistrict: getWardsByDistrict(),
  
  // Geographic information
  totalArea: formatArea(cityInfo.area_km2),
  totalAreaRaw: cityInfo.area_km2,
  
  // Population information
  population: cityInfo.population,
  populationFormatted: cityInfo.population,
  populationDensity: cityInfo.population_density,
  
  // Merger information
  mergedFrom: metaData.merged_from,
  administrativeCenter: metaData.administrative_center,
  subdivisionReduction: metaData.subdivision_reduction,
  mergedUnits: adminStructure.merged_units,
  unmergedUnits: adminStructure.unmerged_units,
  unmergedCommunes: adminStructure.unmerged_communes,
  
  // Economic information
  grdpBillionVND: cityInfo.grdp_billion_vnd,
  hasSeaport: cityInfo.has_seaport,
  seaportCount: cityInfo.seaports,
  pierCount: cityInfo.piers,
  
  // Additional information
  vehicleLicenseCodes: cityInfo.vehicle_license_codes,
  effectiveDate: "01/07/2025",
  description: "Tra cứu thông tin phường xã sau sáp nhập",
  fullDescription: `${adminStructure.total_subdivisions} Đơn vị hành chính (${adminStructure.wards} phường, ${adminStructure.communes} xã và ${adminStructure.special_zones || 1} đặc khu Hoàng Sa)`,
  
  // Detailed ward/commune information
  wardInfo: adminInfo.commune_ward_list
} as const;

/**
 * Helper function to format population with dots
 * @param population Population number
 * @returns Formatted population string
 */
export function formatPopulation(population: number): string {
  return population.toLocaleString('vi-VN');
}

/**
 * Helper function to format area with commas
 * @param areaKm2 Area in square kilometers
 * @returns Formatted area string
 */
export function formatArea(areaKm2: number): string {
  // Format with vi-VN locale and explicitly replace decimal point with comma if needed
  const formattedNumber = areaKm2.toLocaleString('vi-VN').replace('.', ',');
  return `${formattedNumber} km²`;
}

/**
 * Helper function to get administrative structure text
 * @returns Administrative structure description
 */
export function getAdministrativeStructure(): string {
  return `${DANANG_CITY_INFO.wards} phường, ${DANANG_CITY_INFO.communes} xã và ${DANANG_CITY_INFO.specialZones} đặc khu ${DANANG_CITY_INFO.specialZoneName}`;
}

/**
 * Find ward information by name
 * @param wardName Name of the ward/commune to find
 * @returns Ward information or undefined if not found
 */
export function getWardByName(wardName: string) {
  return DANANG_CITY_INFO.wardInfo.find(ward => ward.new_commune_ward === wardName);
}

/**
 * Calculate total population by district
 * @param districtName Name of the district
 * @returns Total population in the district
 */
export function getDistrictPopulation(districtName: string): number {
  return DANANG_CITY_INFO.wardInfo
    .filter(ward => ward.old_commune_ward === districtName)
    .reduce((total, ward) => total + (ward.population || 0), 0);
}

/**
 * Calculate total area by district
 * @param districtName Name of the district
 * @returns Total area in square kilometers
 */
export function getDistrictArea(districtName: string): number {
  return DANANG_CITY_INFO.wardInfo
    .filter(ward => ward.old_commune_ward === districtName)
    .reduce((total, ward) => total + (ward.area_km2 || 0), 0);
}
