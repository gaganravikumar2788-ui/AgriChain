// Vercel Serverless Function: /api/users
// Provides cross-device synchronization for registered users on Vercel deployment

let registeredUsers = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(registeredUsers);
  }

  if (req.method === 'POST') {
    try {
      const record = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (record && (record.name || record.mobile || record.phone)) {
        const cleanDigits = String(record.mobile || record.phone || '').replace(/[^0-9]/g, '').slice(-10);
        const existingIdx = registeredUsers.findIndex(u => {
          const uClean = String(u.mobile || u.phone || '').replace(/[^0-9]/g, '').slice(-10);
          return uClean && cleanDigits && uClean === cleanDigits;
        });

        if (existingIdx >= 0) {
          registeredUsers[existingIdx] = { ...registeredUsers[existingIdx], ...record };
        } else {
          registeredUsers.unshift(record);
        }
      }
      return res.status(200).json({ success: true, count: registeredUsers.length, users: registeredUsers });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
