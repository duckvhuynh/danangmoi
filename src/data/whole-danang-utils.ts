import wholeDanangData from './whole-danang.json';
import type { PolygonData } from './polygon-utils';

// Type assertion for the imported data
interface WholeDanangData {
  id: number;
  level: number;
  code: string;
  name: string;
  paths: Array<Array<[number, number]>>;
  colorIndex: number;
  obj_id: string;
  bound: {
    latitudeSouth: number;
    longitudeWest: number;
    latitudeNorth: number;
    longitudeEast: number;
  };
  location: {
    lat: number;
    lng: number;
  };
}

// Process whole-danang.json data to create a PolygonData object
export function getWholeDanangPolygon(): PolygonData {
  const danangData = wholeDanangData[0] as unknown as WholeDanangData;
  
  // Process all paths into polygon format
  // Only use the first path (the main boundary) for rendering
  const mainPath = danangData.paths[0];
  const mainPolygon = mainPath.map(coord => ({
    lat: coord[1],
    lng: coord[0]
  }));
  
  // Process the other paths as separate polygons
  const additionalPolygons = danangData.paths
    .slice(1)
    .filter(path => path.length > 2)
    .map(path => 
      path.map(coord => ({
        lat: coord[1],
        lng: coord[0]
      }))
    );
  
  const wholeDanangPolygon: PolygonData = {
    district: 'Đà Nẵng',
    ward: 'Thành phố Đà Nẵng',
    polygon: mainPolygon,
    polygons: additionalPolygons,
    id: danangData.id,
    code: danangData.code
  };
  
  return wholeDanangPolygon;
}

// Get bounds for the whole Da Nang area
export function getWholeDanangBounds(): {
  south: number;
  west: number;
  north: number;
  east: number;
} {
  const danangData = wholeDanangData[0] as unknown as WholeDanangData;
  
  return {
    south: danangData.bound.latitudeSouth,
    west: danangData.bound.longitudeWest,
    north: danangData.bound.latitudeNorth,
    east: danangData.bound.longitudeEast
  };
}
