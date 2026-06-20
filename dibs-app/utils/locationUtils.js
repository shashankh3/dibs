export const PINCODE_COORDS = {
  // Chhattisgarh
  '490020': [21.2167, 81.4167], // Bhilai
  '490006': [21.2350, 81.3700], // Durg
  '491441': [21.1015, 81.0297], // Rajnandgaon
  '492001': [21.2514, 81.6296], // Raipur
  '495001': [22.0796, 82.1391], // Bilaspur CG
  // Delhi
  '110001': [28.6328, 77.2197], // Connaught Place
  '110011': [28.5921, 77.2307], // Lodhi Road
  '110016': [28.5672, 77.2100], // Hauz Khas
  '110085': [28.6920, 77.2975], // Shahdara
  // Mumbai / Maharashtra
  '400001': [18.9388, 72.8354], // Fort
  '400050': [19.0596, 72.8295], // Bandra
  '400076': [19.1197, 72.9052], // Powai
  '411001': [18.5196, 73.8554], // Pune
  // Madhya Pradesh
  '462001': [23.2599, 77.4126], // Bhopal
  '452001': [22.7196, 75.8577], // Indore
  '482001': [23.8315, 79.9264], // Jabalpur
  // Gujarat
  '380001': [23.0225, 72.5714], // Ahmedabad
  '390001': [22.3072, 73.1812], // Vadodara
  '395001': [21.1702, 72.8311], // Surat
  '360001': [22.3039, 70.8022], // Rajkot
  // Other major cities
  '560001': [12.9716, 77.5946], // Bangalore
  '500001': [17.3850, 78.4867], // Hyderabad
  '600001': [13.0827, 80.2707], // Chennai
  '700001': [22.5726, 88.3639], // Kolkata
  '302001': [26.9124, 75.7873], // Jaipur
  '226001': [26.8467, 80.9462], // Lucknow
};

export const getPincodeCoords = (pincode) => {
  if (!pincode) return [22.5, 78.5]; // Default fallback
  const pinStr = pincode.toString().trim();
  if (PINCODE_COORDS[pinStr]) return PINCODE_COORDS[pinStr];
  
  const prefix3 = pinStr.substring(0, 3);
  const prefix2 = pinStr.substring(0, 2);
  
  for (const [code, coords] of Object.entries(PINCODE_COORDS)) {
    if (code.startsWith(prefix3)) return coords;
  }
  for (const [code, coords] of Object.entries(PINCODE_COORDS)) {
    if (code.startsWith(prefix2)) return coords;
  }
  return [22.5, 78.5]; // Default fallback
};

export const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
