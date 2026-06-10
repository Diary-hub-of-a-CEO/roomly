export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { location, roomType, noiseLevel, petsAllowed, furnished, bathrooms, proximityScore } = req.body || {};
  const baseMap = {
    'Single Bed': 550,
    'Double Bed': 820,
    'Office Space': 1240,
    'Studio Apartment': 980
  };
  const locationBoost = /downtown|central|city|prime/i.test(location) ? 1.28 : /near university|campus|station/i.test(location) ? 1.16 : 1.04;
  const typeBase = baseMap[roomType] ?? 700;
  const noiseFactor = noiseLevel === 'Low' ? 0.94 : noiseLevel === 'High' ? 1.08 : 1.0;
  const petsFactor = petsAllowed ? 1.06 : 0.96;
  const furnishBonus = furnished ? 120 : 0;
  const bathroomBoost = 35 * Math.max(0, Number(bathrooms) - 1);
  const proximityBoost = 1 + (Math.min(10, Math.max(1, Number(proximityScore))) - 5) * 0.03;

  const estimatedRent = Math.round((typeBase + furnishBonus + bathroomBoost) * locationBoost * noiseFactor * petsFactor * proximityBoost);
  const explanation = `Estimated rent for a ${roomType?.toLowerCase() ?? 'room'} near ${location ?? 'your chosen area'} is based on room style, location, noise level, pets policy, and proximity to campus.`;

  res.status(200).json({ estimatedRent, explanation });
}
