import { Coordinate } from "../types/common";
import { Statue } from "../types/statues";

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const earthRadiusKm = 6371;
  const x =
    degreesToRadians(lng2 - lng1) *
    Math.cos(degreesToRadians((lat1 + lat2) / 2));
  const y = degreesToRadians(lat2 - lat1);
  const distance = earthRadiusKm * Math.sqrt(x * x + y * y);
  return distance;
}

export function sortByDistanceFromPoint(
  statues: Statue[],
  userLocation: Coordinate
): Statue[] {
  return [...statues].sort((a, b) => {
    const distanceToA = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      a.lat,
      a.lng
    );
    const distanceToB = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      b.lat,
      b.lng
    );

    return distanceToA - distanceToB;
  });
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const distanceMeters = distanceKm * 1000;
    const roundedMeters = Math.round(distanceMeters / 10) * 10;
    return `${roundedMeters} m`;
  } else {
    const roundedKm = parseFloat(distanceKm.toFixed(2));
    return `${roundedKm} km`;
  }
}
