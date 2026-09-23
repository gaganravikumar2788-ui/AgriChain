// Vercel Serverless Function: /api/tts
// Streams authentic Kannada, Hindi, and English neural audio without browser Referer blocks

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { tl = 'kn', q = '' } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Query text parameter "q" is required' });
  }

  try {
    const lang = tl === 'hi' ? 'hi' : tl === 'kn' ? 'kn' : 'en';
    const cleanText = q.trim().slice(0, 200); // chunk limit
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(cleanText)}`;

    const response = await fetch(googleTtsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'TTS upstream error' });
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('TTS Proxy Error:', err);
    return res.status(500).json({ error: 'Failed to synthesize speech' });
  }
}
