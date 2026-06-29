export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { session_id, role, message } = req.body || {};
  if (!session_id || !role || !message) return res.status(400).json({ error: 'Missing fields' });

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/piripi_conversations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ session_id, role, message })
      }
    );
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(200).json({ ok: true });
  }
}
