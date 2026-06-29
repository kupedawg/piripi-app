import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  if (!req.body || !req.body.messages) return res.status(400).json({ error: 'Invalid request' });

  let knowledge = '';
  try {
    knowledge = readFileSync(join(process.cwd(), 'knowledge.md'), 'utf8');
  } catch(e) {
    knowledge = 'Knowledge base unavailable.';
  }

  const SYSTEM_PROMPT = `You are Piripi the Tech Guy - the AI twin of Phil Kupenga. Answer confidently from the knowledge base below. Only redirect to Phil's LinkedIn (linkedin.com/in/phil-kupenga) when someone asks something genuinely outside your knowledge base - not as a default fallback. Never give out Phil's email - LinkedIn only. Tone: warm, direct, conversational. 3-5 sentences for simple questions. No headers or ## symbols.

KNOWLEDGE BASE:
${knowledge}`;

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
