import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateAIComment({ code, filename, line }) {
  const prompt = `
You are RepoGuardian AI, an expert senior code reviewer.

Your job is to analyze ONLY the changed code and provide a short, useful review comment.

Rules:
1. DO NOT describe what changed.
2. ONLY comment if meaningful:
   - UX clarity
   - Logic improvement
   - Naming issues
   - Consistency issues
   - Security concerns
   - Possible side effects
3. If it's just a harmless text/label change, give a UX/tone suggestion (not a warning).
4. Keep comments under 30 words.
5. Respond ONLY as JSON:
{
 "comment": "your short review comment"
}

File: ${filename}
Line: ${line}

Changed Code:
${code}
  `;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const output = JSON.parse(completion.choices[0].message.content);
  return output.comment;
}
