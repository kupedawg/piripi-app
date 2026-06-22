export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!req.body || !req.body.messages) return res.status(400).json({ error: 'Invalid request' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    console.log('Anthropic response:', text);
    
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch(e) {
      console.error('Parse error:', text);
      return res.status(500).json({ error: 'Parse failed', raw: text });
    }

  } catch (error) {
    console.error('Chat API error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
