import { Coordinate } from "../types/common";
import { Statue } from "../types/statues";

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLng = degreesToRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;
  return distance;
}

export function sortByDistanceFromPoint(
  coordinates: Statue[],
  referencePoint: Coordinate
): Statue[] {
  const nextSort = [...coordinates];
  nextSort.sort((a, b) => {
    const distanceToA = calculateDistance(
      referencePoint.lat,
      referencePoint.lng,
      a.lat,
      a.lng
    );
    const distanceToB = calculateDistance(
      referencePoint.lat,
      referencePoint.lng,
      b.lat,
      b.lng
    );

    return distanceToA - distanceToB;
  });
  return nextSort;
}
