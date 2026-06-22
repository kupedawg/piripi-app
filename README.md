# Piripi the Tech Guy 🤖

**An open source AI twin template for community tech workforce leaders.**

Built by [Phil Kupenga](https://nextchapter.co.nz) (Ngāti Porou, Te-Whānau-ā-Apanui) — founder of the Tairāwhiti Tech Talent Incubator and Next Chapter Consulting NZ.

Live demo: [piripi.nextchapter.co.nz](https://piripi.nextchapter.co.nz)

---

## What is this?

Piripi is Phil Kupenga's AI twin — a chat interface that answers questions about:
- Getting into tech from scratch
- The Tairāwhiti Tech Talent Incubator model
- Why Māori should care about AI
- How to replicate a community tech talent programme in your region

It's built to be **forked and customised** by any community, hapū, iwi, or organisation wanting to build their own AI guide based on their leader's knowledge.

---

## Tech stack

- Plain HTML/CSS/JS — no framework, no build step
- [Anthropic Claude API](https://anthropic.com) (claude-sonnet-4-6)
- Deployed on [Vercel](https://vercel.com) (free tier)
- Mobile-first, works on any device

---

## Deploy your own in 4 steps

### Step 1 — Fork this repo
Click **Fork** at the top right of this page on GitHub.

### Step 2 — Customise the knowledge base
Open `index.html` and find the `SYSTEM_PROMPT` constant in the `<script>` section.

Replace the knowledge base content with your own story, your programme details, your philosophy. Keep the guardrails section — it's what prevents hallucination.

Key sections to update:
- `## About [Your Name]` — your story
- `## Your programme` — what you've built
- `## Getting into tech` — your approach
- `## Key phrases` — your own words
- `## Contact` — your contact details

Also update the avatar SVG or replace with an `<img>` tag pointing to your own image.

### Step 3 — Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **New Project** → Import your forked repo
3. No build settings needed — it's static HTML
4. Click **Deploy** — live in 30 seconds

### Step 4 — Add your API key
In your Vercel project:
1. Go to **Settings → Environment Variables**
2. Add `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)

> **Note:** The API key is currently handled by the Claude.ai environment in development. For production you'll need to add a simple serverless function to proxy the API call securely. See `api/chat.js` below.

---

## Adding a custom domain

In Vercel project settings → **Domains**:
1. Add your domain e.g. `piripi.yourdomain.co.nz`
2. In your DNS provider add a CNAME record:
   - Name: `piripi`
   - Value: `cname.vercel-dns.com`
3. Done — usually live within minutes

---

## Securing the API key (production)

For production, never expose your API key in frontend code. Add a serverless proxy:

Create `api/chat.js` in your repo:

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
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
  res.status(200).json(data);
}
```

Then in `index.html`, change the fetch URL from:
```js
'https://api.anthropic.com/v1/messages'
```
to:
```js
'/api/chat'
```

---

## Customisation tips

**Avatar:** Replace the SVG with your own image:
```html
<img src="your-avatar.png" style="width:100%;height:100%;object-fit:cover;object-position:top;">
```

**Colours:** Find and replace `#00C853` (green) and `#111` (black) with your brand colours.

**Suggestion chips:** Update the four starter questions to match your most common conversations.

**Opening message:** Find `tēnā koe! I'm Piripi` and update to your AI twin's greeting.

---

## The anti-hallucination approach

This template uses a **document-grounded RAG-style system prompt** rather than fine-tuning. The key guardrail:

```
If unsure, say: "That's a good one for [Name] directly — reach out at [email]"
Never invent statistics, names, or outcomes not in this knowledge base
```

This gives the AI a natural escape hatch rather than forcing it to guess.

---

## Who built this

**Phil Kupenga** — Ngāti Porou, Te-Whānau-ā-Apanui. Founder of:
- [Tairāwhiti Tech Talent Incubator](https://nextchapter.co.nz/tairāwhititechtalentincubator)
- [Next Chapter Consulting NZ](https://nextchapter.co.nz)
- [Tupuna Pai](https://tupunapai.com) — AI governance for Māori organisations
- [More Māori in Tech](https://nextchapter.co.nz)

Winner, Rangatiratanga Tōtara Award — Te Hapori Matihiko 2023.

📧 phil@nextchapter.co.nz | 📞 +64 21 877 827

---

## Licence

MIT — fork it, use it, build on it. If you use it to build something for your community, Phil would love to hear about it.

---

*"The doing is the credential." — Phil Kupenga*
