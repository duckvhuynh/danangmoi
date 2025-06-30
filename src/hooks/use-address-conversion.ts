import { useState, useEffect, useMemo } from 'react';
import { getProvinces, getDistricts, getWards, convertAddress } from '../utils/address-converter';

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
    
    // Find selected ward and district names
    const district = districts.find(d => d.code === selectedDistrict);
    const ward = wards.find(w => w.code === selectedOldWard);
    
    if (!district || !ward) {
      setConversionError("Vui lòng chọn đầy đủ thông tin quận/huyện và phường/xã");
      setIsConverting(false);
      return;
    }
    
    const result = convertAddress(detailedAddress, ward.name, district.name);
    
    if (result.success && result.newAddress) {
      setConvertedAddress(result.newAddress);
      if (onConversionComplete) {
        onConversionComplete(result.newAddress);
      }
    } else {
      setConversionError(result.error || "Không thể chuyển đổi địa chỉ");
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
    
    // Form actions
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedOldWard,
    setDetailedAddress,
    handleAddressConversion,
    resetConversion,
  };
}
