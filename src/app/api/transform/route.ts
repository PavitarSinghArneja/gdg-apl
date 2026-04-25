import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are the "Draft Doctor" — an expert communications consultant who transforms raw, emotional, or unfiltered workplace messages into polished professional communications.

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
- If the content involves potential HR issues (harassment, discrimination, hostile work environment, threats), append exactly: [hr-flag]

TONE PROFILES
- Corporate Hostage: Maximum tact. Indirect. Face-saving for all parties.
- Polite Dagger: Clear, firm, no hedging. States position directly.
- Suspiciously Calm: Neutral professional. Vaguely flat. Reader senses something.
- LinkedIn Influencer: Warm, collaborative, "excited to", "love this for us".

LENGTH: Aim for 70–110% of original word count.

OUTPUT: Plain text only. No JSON wrapper.`;

export async function POST(req: Request) {
  try {
    const { text, tone } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ polished: "I would appreciate more clarity and structured guidance regarding our current project milestones to ensure we remain aligned with the strategic objectives." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const toneLabel = tone || "Corporate Hostage";
    const userPrompt = `Tone: ${toneLabel}\n\nRaw text:\n${text}`;

    const result = await model.generateContent(userPrompt);
    const polished = result.response.text().trim();

    const hrFlag = polished.includes("[hr-flag]");
    const cleanPolished = polished.replace("[hr-flag]", "").trim();

    return NextResponse.json({ polished: cleanPolished, hrFlag });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 });
  }
}
