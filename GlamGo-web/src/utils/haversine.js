/**
 * AGhataCris - Algoritmo Espacial: Fórmula de Haversine (RF03, RNF01)
 * Calcula a distância do grande círculo entre dois pontos geográficos em quilômetros.
 */

const EARTH_RADIUS_KM = 6371.0;

/**
 * Converte graus para radianos
 * @param {number} deg 
 * @returns {number}
 */
function toRad(deg) {
  return (deg * Math.PI) / 180.0;
}

/**
 * Calcula a distância em quilômetros entre duas coordenadas (lat1, lon1) e (lat2, lon2).
 * @param {number} lat1 - Latitude do ponto 1
 * @param {number} lon1 - Longitude do ponto 1
 * @param {number} lat2 - Latitude do ponto 2
 * @param {number} lon2 - Longitude do ponto 2
 * @returns {number} Distância em km arredondada para 2 casas decimais
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;
  return Math.round(distance * 100) / 100;
}

module.exports = {
  calculateHaversineDistance,
  EARTH_RADIUS_KM
};
