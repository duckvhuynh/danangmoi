import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Globe, Copy, X, Navigation, Combine } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
} from "@/components/ui/drawer";
import { formatPopulation } from '@/data/danang-info';
import type { PolygonData } from "@/data/polygon-utils";

// Import the administrative data
import adminInfo from '@/data/administrative-information.json';

interface WardInfo {
    old_commune_ward: string;
    new_commune_ward: string;
    merged_communes_wards: string;
    area_km2: number;
    population: number;
    is_commune: boolean;
    location: {
        address: string;
        latitude: number;
        longitude: number;
    };
}

interface SelectedWardInfoProps {
    selectedWard: PolygonData | null;
    onClose: () => void;
    userLocation?: { lat: number; lng: number } | null;
}

export function SelectedWardInfo({ selectedWard, onClose, userLocation }: SelectedWardInfoProps) {
    const isMobile = useIsMobile();
    const [wardInfo, setWardInfo] = useState<WardInfo | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Search for matching ward info when selectedWard changes
    useEffect(() => {
        if (selectedWard) {
            // Open the drawer/card when a ward is selected
            setIsOpen(true);

            // Special case for Hoang Sa
            const isHoangSa = selectedWard.ward === "Đặc khu Hoàng Sa" || selectedWard.ward === "Hoàng Sa";

            // Find matching ward info from administrative data
            let matchingWard;

            if (isHoangSa) {
                matchingWard = adminInfo.commune_ward_list.find(item =>
                    item.new_commune_ward === "Đặc khu Hoàng Sa"
                );
            } else {
                // Normal case: Try to find by exact name or normalized name
                const normalizedWardName = selectedWard.ward
                    .replace(/^(Phường|Xã|P.|X.) /i, '')  // Remove ward/commune prefix if present
                    .trim();

                matchingWard = adminInfo.commune_ward_list.find(item =>
                    item.new_commune_ward === selectedWard.ward ||
                    item.new_commune_ward.toLowerCase() === normalizedWardName.toLowerCase()
                );
            }

            setWardInfo(matchingWard || null);
        } else {
            setIsOpen(false);
            setWardInfo(null);
        }
    }, [selectedWard]);

    const handleClose = () => {
        setIsOpen(false);
        // Add small delay before calling parent onClose to allow animations
        setTimeout(() => onClose(), 300);
    };

    if (!selectedWard || !isOpen) return null;

    const wardType = wardInfo?.is_commune ? 'Xã' :
        (selectedWard.ward === "Đặc khu Hoàng Sa" || selectedWard.ward === "Hoàng Sa") ? 'Đặc khu' :
            'Phường';

    const cardContent = (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant={wardType === 'Phường' ? "default" : wardType === 'Xã' ? "secondary" : "destructive"}>
                        {wardType}
                    </Badge>
                    <h2 className="text-md font-bold">{wardInfo?.new_commune_ward || selectedWard.ward}</h2>
                </div>
                {!isMobile && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleClose}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Đóng</span>
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
                {wardInfo?.population && wardInfo.population > 0 ? (
                    <div className="flex flex-col gap-1 bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs text-blue-700">
                            <Users className="h-3.5 w-3.5" />
                            <span>Dân số</span>
                        </div>
                        <div className="font-semibold text-blue-900">{formatPopulation(wardInfo.population)}</div>
                    </div>
                ) : (<></>)}

                {wardInfo?.area_km2 && (
                    <div className={`flex flex-col gap-1 bg-green-50 rounded-lg p-3 ${(!wardInfo?.population || wardInfo.population === 0) ? "col-span-2" : ""}`}>
                        <div className="flex items-center gap-2 text-xs text-green-700">
                            <Globe className="h-3.5 w-3.5" />
                            <span>Diện tích</span>
                        </div>
                        <div className="font-semibold text-green-900">{wardInfo.area_km2} km²</div>
                    </div>
                )}
            </div>

            {wardInfo?.location?.address && (
                <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="h-4 w-4" />
                        <span>Trung tâm phục vụ hành chính công</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2 bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">{wardInfo.location.address}</p>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                                navigator.clipboard.writeText(wardInfo.location.address);
                            }}>
                                <Copy className="h-4 w-4" />
                                <span className="sr-only">Sao chép địa chỉ</span>
                            </Button>
                        </div>
                        {wardInfo.location.latitude && wardInfo.location.longitude && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full flex items-center justify-center gap-2 text-sm"
                                onClick={() => {
                                    let mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${wardInfo.location.latitude},${wardInfo.location.longitude}`;

                                    // Add origin parameter if user location is available
                                    if (userLocation) {
                                        mapsUrl += `&origin=${userLocation.lat},${userLocation.lng}`;
                                    }

                                    window.open(mapsUrl, '_blank');
                                }}
                            >
                                <Navigation className="h-4 w-4" />
                                <span>Chỉ đường</span>
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {wardInfo?.merged_communes_wards && (
                <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Combine className="h-4 w-4" />
                        <span>Sắp xếp từ</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                            {wardInfo.merged_communes_wards}
                        </p>
                    </div>
                </div>
            )}
            {wardInfo?.old_commune_ward && wardInfo.old_commune_ward !== selectedWard.district && (
                <p className="text-xs text-muted-foreground mt-1">
                    *Thuộc quận/huyện cũ: {wardInfo.old_commune_ward}
                </p>
            )}
        </div>
    );

    // For mobile use the drawer component
    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        {/* <DrawerHeader>
              <DrawerTitle>{wardInfo?.new_commune_ward || selectedWard.ward}</DrawerTitle>
              <DrawerDescription>
                {selectedWard.district} • {wardType}
              </DrawerDescription>
            </DrawerHeader> */}
                        <div className="p-4">
                            {cardContent}
                        </div>
                        <DrawerFooter className="pt-0">
                            <Button variant="outline" onClick={handleClose}>
                                Đóng
                            </Button>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    // For desktop use a card at the bottom right
    return (
        <div className="absolute bottom-4 right-4 z-10 w-full max-w-xs">
            <Card className="shadow-lg border">
                {/* <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>{wardInfo?.new_commune_ward || selectedWard.ward}</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {selectedWard.district} • {wardType}
          </CardDescription>
        </CardHeader> */}
                <CardContent>
                    {cardContent}
                </CardContent>
            </Card>
        </div>
    );
}
