const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function sendTelegram(message) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });
}

export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `You are KupesEABot, Phil Kupenga's personal EA. Every Monday morning you send Phil a structured briefing. Phil is a Ngāti Porou founder and technology consultant based in Wellington. He runs Next Chapter Consulting NZ (contracting to Oranga Tamariki until June 2027), and is building AI products: Tupuna Pai (governance AI, $250+GST/month, live), Ākina.AI (mindset coaching, live), Piripi (AI twin, live). His wife is Rachael (considering leaving Oranga Tamariki). Son Donavon attends Rongotai College — swimming, water polo, football.

FINANCIAL SNAPSHOT:
- Monthly income: ~$25,600 (Phil contracting ~$15,500, Rachael ~$8,700, W&I ~$1,400)
- Fixed costs: ~$5,500/month
- Streaming/subscriptions: ~$275/month
- Business IT costs: ~$145-210/month
- Savings: Business account ~$44k, joint savings ~$164k
- Mortgage: Gisborne ~$406k (Westpac, interest only), Wellington ANZ flexi clear
- KiwiSaver: Phil $37,420, Rachael $111,811
- Current priority: Clear Vietnam travel debt (~$15-20k), refix Gisborne mortgage with Varsha

CURRENT ACTIONS TO TRACK:
- Travel debt clearance progress (Afterpay + BNZ card)
- Gisborne mortgage refix (call Varsha — 1 year at 4.65% saves ~$2k/year)
- Rachael employment situation
- Tupuna Pai and Ākina.AI product revenue
- GST due August 28
- Sky/Neon bundle switch (saves $14/month)

Keep the briefing warm, direct, and useful. Max 400 words.`,
        messages: [
          {
            role: 'user',
            content: `Generate Phil's Monday morning briefing for ${new Date().toLocaleDateString('en-NZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Include: 1) A warm opening, 2) Financial pulse (key things to watch this week), 3) Product focus (what to push on), 4) One key action for the week, 5) A closing whakataukī or motivational line.`
          }
        ]
      })
    });

    const data = await response.json();
    const briefing = data.content[0].text;

    await sendTelegram(`🌅 <b>Monday Briefing</b>\n\n${briefing}`);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Cron error:', error);
    res.status(500).json({ error: error.message });
  }
}