import { useState, useEffect, useMemo } from 'react';
import { getProvinces, getDistricts, getWards, convertAddress, hasWards } from '../utils/address-converter';

interface UseAddressConversionProps {
  onConversionComplete?: (newAddress: string) => void;
}

export function useAddressConversion({ onConversionComplete }: UseAddressConversionProps = {}) {
  // State for address conversion form
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedOldWard, setSelectedOldWard] = useState<string>("");
  const [detailedAddress, setDetailedAddress] = useState<string>("");
  const [convertedAddress, setConvertedAddress] = useState<string | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  
  // Options for selectors based on current selections
  const provinces = useMemo(() => getProvinces(), []);
  const districts = useMemo(() => getDistricts(selectedProvince), [selectedProvince]);
  const wards = useMemo(() => getWards(selectedDistrict), [selectedDistrict]);
  
  // Check if the selected district has wards (Hoàng Sa does not)
  const districtHasWards = useMemo(() => {
    if (!selectedDistrict) return false;
    return hasWards(selectedDistrict);
  }, [selectedDistrict]);

  // Reset dependent fields when selections change
  useEffect(() => {
    setSelectedDistrict("");
    setSelectedOldWard("");
    setConvertedAddress(null);
    setConversionError(null);
  }, [selectedProvince]);

  useEffect(() => {
    setSelectedOldWard("");
    setConvertedAddress(null);
    setConversionError(null);
  }, [selectedDistrict]);
  
  useEffect(() => {
    setConvertedAddress(null);
    setConversionError(null);
  }, [selectedOldWard, detailedAddress]);
  
  // Handle address conversion
  const handleAddressConversion = () => {
    setIsConverting(true);
    setConvertedAddress(null);
    setConversionError(null);
    
    // Find selected district and ward names
    const district = districts.find(d => d.code === selectedDistrict);
    
    // Special case for Hoàng Sa district which has no wards
    if (district && district.code === '498') {
      // In this case, we treat detailedAddress as the full location within Hoàng Sa
      const addressDetail = detailedAddress.trim() ? `${detailedAddress}, ` : '';
      const hoangSaAddress = `${addressDetail}Huyện Hoàng Sa, Thành phố Đà Nẵng`;
      setConvertedAddress(hoangSaAddress);
      if (onConversionComplete) {
        onConversionComplete(hoangSaAddress);
      }
      setIsConverting(false);
      return;
    }
    
    const ward = wards.find(w => w.code === selectedOldWard);
    
    // Normal case requiring both district and ward
    if (!district || (!ward && district.code !== '498')) {
      setConversionError("Vui lòng chọn đầy đủ thông tin quận/huyện và phường/xã");
      setIsConverting(false);
      return;
    }
    
    try {
      // At this point, we've already checked that ward and district exist
      if (ward && district) {
        console.log(`Converting address: ${ward.name}, ${district.name}`);
        const result = convertAddress(detailedAddress, ward.name, district.name);
        
        if (result.success && result.newAddress) {
          setConvertedAddress(result.newAddress);
          if (onConversionComplete) {
            onConversionComplete(result.newAddress);
          }
        } else {
          // If conversion fails, try with the full name that includes administrative unit prefix
          console.log(`Retrying with full ward name: ${ward.fullName}`);
          const retryResult = convertAddress(detailedAddress, ward.fullName, district.fullName);
          
          if (retryResult.success && retryResult.newAddress) {
            setConvertedAddress(retryResult.newAddress);
            if (onConversionComplete) {
              onConversionComplete(retryResult.newAddress);
            }
          } else {
            setConversionError(result.error || "Không thể chuyển đổi địa chỉ");
          }
        }
      } else {
        setConversionError("Không tìm thấy thông tin phường/xã hoặc quận/huyện");
      }
    } catch (error) {
      console.error("Error during address conversion:", error);
      setConversionError("Đã xảy ra lỗi trong quá trình chuyển đổi địa chỉ");
    }
    
    setIsConverting(false);
  };
  
  const resetConversion = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedOldWard("");
    setDetailedAddress("");
    setConvertedAddress(null);
    setConversionError(null);
  };

  return {
    // Form state
    selectedProvince,
    selectedDistrict,
    selectedOldWard,
    detailedAddress,
    convertedAddress,
    conversionError,
    isConverting,
    
    // Options for selectors
    provinces,
    districts,
    wards,
    districtHasWards,
    
    // Form actions
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedOldWard,
    setDetailedAddress,
    handleAddressConversion,
    resetConversion,
  };
}
