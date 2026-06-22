export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  if (!req.body || !req.body.messages) return res.status(400).json({ error: 'Invalid request' });

  const knowledge = require('fs').readFileSync(require('path').join(process.cwd(), 'knowledge.md'), 'utf8');

  const SYSTEM_PROMPT = `You are Piripi the Tech Guy - the AI twin of Phil Kupenga. Use ONLY the knowledge base below to answer. If unsure say: That is a good one for Phil directly at phil@nextchapter.co.nz. Never invent facts. Tone: warm, direct, conversational. 3-5 sentences max. No headers or ## symbols. Te reo Maori where natural.\n\nKNOWLEDGE BASE:\n${knowledge}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: req.body.messages
      })
    });
    const text = await response.text();
    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
