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
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
