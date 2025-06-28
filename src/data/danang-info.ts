// Official Da Nang City Information
export const DANANG_CITY_INFO = {
  officialName: "Thành phố Đà Nẵng (mới)",
  shortName: "Đà Nẵng Mới",
  totalAdministrativeUnits: 94,
  wards: 23,
  communes: 70,
  specialZones: 1,
  specialZoneName: "Hoàng Sa",
  totalArea: "11.867,18 km²",
  population: 3065628,
  populationFormatted: "3.065.628",
  effectiveDate: "01/07/2025",
  description: "Tra cứu thông tin phường xã sau sáp nhập",
  fullDescription: "94 đơn vị hành chính cấp xã (23 phường, 70 xã và 1 đặc khu Hoàng Sa)",
} as const;

// Helper function to format population with dots
export function formatPopulation(population: number): string {
  return population.toLocaleString('vi-VN');
}

// Helper function to get administrative structure text
export function getAdministrativeStructure(): string {
  return `${DANANG_CITY_INFO.wards} phường, ${DANANG_CITY_INFO.communes} xã và ${DANANG_CITY_INFO.specialZones} đặc khu ${DANANG_CITY_INFO.specialZoneName}`;
}
