// Vercel Serverless Function: /api/farmers
// Provides cross-device synchronization for authentic registered farmers only

let registeredFarmers = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(registeredFarmers);
  }

  if (req.method === 'DELETE') {
    registeredFarmers = [];
    return res.status(200).json({ success: true, count: 0, list: [] });
  }

  if (req.method === 'POST') {
    try {
      const record = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (record && (record.name || record.phone)) {
        const existingIdx = registeredFarmers.findIndex(
          f => f.id === record.id || (record.phone && f.phone === record.phone)
        );
        if (existingIdx >= 0) {
          registeredFarmers[existingIdx] = { ...registeredFarmers[existingIdx], ...record };
        } else {
          registeredFarmers.unshift(record);
        }
      }
      return res.status(200).json({ success: true, count: registeredFarmers.length, list: registeredFarmers });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
