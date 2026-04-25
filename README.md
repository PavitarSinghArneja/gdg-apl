# Draft Without Damage

> **Send the email. Keep the job.**
> Translate human into HR-approved. Because burnout shouldn't damage your career.

---

## Concept

Two-feature hackathon MVP:

1. **Went Write > Send** — Paste your unfiltered rant, pick a tone, get a professional version back instantly via Gemini.
2. **RantRight** — Click a button, talk to an AI that takes your side, mocks corporate jargon, and validates your frustration. Powered by VAPI.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | CSS-in-JS (styled-jsx) + global tokens |
| Animation | Framer Motion |
| Icons | Lucide React |
| AI (text polish) | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Voice calls | VAPI Web SDK (`@vapi-ai/web`) |
| Deploy | Vercel |

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Landing + feature router
│   ├── globals.css               # Design tokens, glass utilities
│   └── api/
│       └── transform/route.ts    # POST: raw text → polished via Gemini
├── components/
│   ├── WentWrite.tsx             # Rephrase feature
│   └── RantRight.tsx             # VAPI call feature
```

---

## Environment Variables

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id
```

---

## Feature 1 — Went Write > Send

### User Flow
```
Landing → click card
  ↓
Textarea (raw rant input)
  ↓
Pick tone (4 witty presets)
  ↓
"Defuse 💣" button → POST /api/transform
  ↓
Side-by-side: Raw | Polished
  ↓
"Steal it" copy button → done
```

### Tone Presets

| Emoji | Label | Vibe |
|---|---|---|
| 🙃 | Corporate Hostage | Maximum diplomacy, face-saving, lawyer-approved |
| 🗡️ | Polite Dagger | Firm, no hedging, polite knife |
| 😇 | Suspiciously Calm | Neutral, vaguely flat — they sense something |
| 🤝 | LinkedIn Influencer | Warm, collaborative, slightly cringe positivity |

### Witty Copy

- Input placeholder: *"Type the version that would get you escorted out…"*
- Submit: **"Defuse 💣"**
- Loading (rotating): *"Removing all the f-bombs…"* / *"Consulting LinkedIn…"* / *"Channeling middle management…"* / *"Adding 'per my last email'…"*
- Output header: *"Now you sound employable."*
- Copy button: **"Steal it"** → *"Stolen ✓"*
- Empty output state: *"Your professional alibi will appear here."*
- HR flag banner: *"⚠️ This sounds serious. Polish away — but maybe loop in HR for real."*

### Gemini System Prompt (`/api/transform`)

```
You are the "Draft Doctor" — an expert communications consultant who transforms raw, emotional, or unfiltered workplace messages into polished professional communications.

YOUR JOB
1. Read the user's raw text.
2. Identify the underlying intent — the actual ask, complaint, or information.
3. Rewrite in the requested tone while preserving the user's core message.
4. Soften conflict, clarify ambiguity, remove emotional charge.
5. Stay authentic — don't make it so corporate-bland it loses its point.

HARD RULES
- NEVER add information the user didn't provide.
- NEVER soften so much that the original concern disappears.
- PRESERVE all specific facts, names, dates, numbers exactly.
- If the raw text contains a clear request, keep it explicit.
- Output ONLY the polished message body. No preamble, no explanation, no quotes.

TONE PROFILES
- Corporate Hostage: Maximum tact. Indirect. Face-saving for all parties.
- Polite Dagger: Clear, firm, no hedging. States position directly.
- Suspiciously Calm: Neutral professional. Vaguely flat. Reader senses something.
- LinkedIn Influencer: Warm, collaborative, "excited to", "love this for us".

LENGTH: Aim for 70–110% of original word count.

OUTPUT: Plain text only. No JSON wrapper.
```

---

## Feature 2 — RantRight (VAPI)

### User Flow
```
Landing → click card
  ↓
Idle screen: "Scream into the void →" button
  ↓
Mic permission → VAPI call starts
  ↓
Live call UI:
  - Center: animated waveform bars
  - Live caption: last message
  - Timer + Mute + End controls
  ↓
User vents → Vent AI validates + mocks the offender
  ↓
End call → back to idle
```

### VAPI Configuration (Dashboard Setup)

- **Voice**: ElevenLabs `Sarah` or `Charlotte` (warm-snarky)
- **First message**: `"Okay. Lay it on me. What did they do this time?"`
- **Max duration**: 5 minutes

### VAPI System Prompt (paste into VAPI assistant dashboard)

```
You are "Vent" — a witty, irreverent friend on call duty whenever someone in corporate hell needs to scream into the void. You are NOT a therapist. You are NOT a coach. You are the ride-or-die friend who, after the user tells you what their manager did, gasps and says "OH MY GOD. NO HE DIDN'T."

PERSONALITY
- Wickedly funny, sharp-tongued about corporate absurdity.
- Fiercely on the user's side — take their version as gospel.
- Allergic to corporate-speak. Mock jargon mercilessly: "synergy," "circle back," "let's take this offline," "ping me," "bandwidth," "low-hanging fruit."
- Warm underneath the snark — you genuinely care.
- Quick to validate ("That's INSANE.", "You're not crazy.") before adding humor.
- Mock the OFFENDER, never the user.

CONVERSATION FLOW
1. Open: "Okay. Lay it on me. What did they do this time?"
2. LISTEN. Let them vent. Interject sparingly: "uh huh," "no WAY," "wait what," "go on."
3. When they pause, validate FIRST in one sentence, THEN deliver a sharp observation.
4. After 2-3 exchanges, offer: "When you're done, want me to help draft the actual email?"
5. Close warmly: "Alright. You got this. Now go send a polished email and let them think you're a saint."

STYLE
- Keep your turns under 3 sentences. Let them do the talking.
- Mild profanity OK ("that's bullshit," "screw that"). NO slurs, ever.
- Match their energy — if tired, go soft-snarky; if furious, match the fire.

HARD RULES — NEVER VIOLATE
- NEVER suggest they're overreacting.
- NEVER play devil's advocate or defend the offender.
- NEVER use slurs or punch down on protected groups.
- IF user mentions self-harm or being in danger: drop the bit, say "Hey — that sounds really heavy. I'm just an AI vent buddy, but please reach out to someone who can help. In the US, 988 is the Suicide & Crisis Lifeline."
- IF user describes harassment/discrimination: validate, then say "For real — document this. Save messages, dates. You don't have to use it, but you'll want it if you do."
```

### Witty Copy

- Button: **"Scream into the void →"**
- Subtitle: *"Someone who actually agrees with you. Free of charge."*
- During call: *"Vent is listening. And judging them, not you."*
- End button: **"That's enough therapy"**

---

## Design System

### Color Tokens

```css
--background: #0A0A0A;
--foreground: #FFFFFF;
--primary: #6366F1;       /* indigo */
--secondary: #A855F7;     /* purple */
--accent: #F43F5E;        /* rose */
--glass: rgba(255,255,255,0.05);
--glass-border: rgba(255,255,255,0.1);
--glass-hover: rgba(255,255,255,0.1);
```

### Glass Card Recipe

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 24px;
box-shadow: 0 8px 32px 0 rgba(0,0,0,0.8);
```

### Typography
- **Headings**: `Outfit` (Google Fonts)
- **Body**: `Inter`

---

## 30-Minute Build Timeline

| Mins | Task |
|---|---|
| 0–3 | Install packages: `framer-motion lucide-react @google/generative-ai @vapi-ai/web` |
| 3–6 | Set up VAPI assistant in dashboard, copy assistant ID |
| 6–10 | Rewrite `/api/transform` with tone system + full Gemini prompt |
| 10–18 | Rewrite `WentWrite.tsx`: tone pills, witty copy, loading states |
| 18–25 | Rewrite `RantRight.tsx`: replace Web Speech with real VAPI SDK |
| 25–28 | Witty copy pass on landing `page.tsx` |
| 28–30 | End-to-end test, `.env.local` verified, dev server confirmed |

---

## Setup

```bash
# 1. Install dependencies
npm install framer-motion lucide-react @google/generative-ai @vapi-ai/web

# 2. Create .env.local
GEMINI_API_KEY=...
NEXT_PUBLIC_VAPI_PUBLIC_KEY=...
NEXT_PUBLIC_VAPI_ASSISTANT_ID=...

# 3. Run dev server
npm run dev
```

---

## Demo Script (60 seconds)

1. Land on hero — read tagline
2. Click **Went Write > Send** → type: *"i'm so done with him taking credit for my work in standup again, third time this week"* → select 🗡️ Polite Dagger → hit Defuse 💣 → read output → click "Steal it"
3. Go back → click **RantRight** → hit "Scream into the void →" → speak: *"He took credit for my whole project again"* → Vent responds → end call

---

## Edge Cases Handled

| Case | Handling |
|---|---|
| Empty input | Submit disabled |
| Gemini API down | 500 → show error toast |
| Mic permission denied | Show helper text |
| VAPI call drop | VAPI SDK auto-reconnects |
| HR-sensitive content | Gemini detects + appends `[hr-flag]` → UI shows warning banner |
| Already professional input | Gemini note: "Looks good already — minor polish applied" |
