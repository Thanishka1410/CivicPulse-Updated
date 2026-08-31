// Haversine formula to compute distance between two geo-coordinates in kilometers
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findDuplicateComplaints(newComplaint, existingComplaints, radiusKm = 0.2) {
  const { latitude, longitude, category } = newComplaint;
  
  if (!latitude || !longitude) return [];

  return existingComplaints.filter(item => {
    // Only check active (non-resolved) complaints
    if (['Resolved', 'Cancelled'].includes(item.status)) return false;
    
    // Category match or generic nearby check
    const isSameCategory = item.category.toLowerCase() === (category || '').toLowerCase();
    
    const distance = calculateDistanceKm(latitude, longitude, item.latitude, item.longitude);
    
    // Match if within radius (e.g., 200 meters = 0.2 km) and same category
    return distance <= radiusKm && isSameCategory;
  }).map(item => ({
    ...item,
    distanceMeters: Math.round(calculateDistanceKm(latitude, longitude, item.latitude, item.longitude) * 1000)
  }));
}
