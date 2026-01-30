import fs from "fs";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function askBot(question) {
  let vectorDB = [];

  try {
    vectorDB = JSON.parse(fs.readFileSync("./ai-bot/vector-db.json"));
  } catch {
    console.log("⚠️ Vector DB empty — fallback mode enabled");
  }

  let context = "";

  if (vectorDB.length > 0) {
    const embed = await groq.embeddings.create({
      model: "nomic-embed-text",
      input: question,
    });

    const userVector = embed.data[0].embedding;

    let best = { score: -1, text: "" };

    for (let item of vectorDB) {
      const score = cosineSimilarity(userVector, item.embedding);
      if (score > best.score) best = { score, text: item.text };
    }

    context = best.text;
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant for RepoGuardian. Answer clearly and concisely using only the provided context.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  return completion.choices[0].message.content.trim();
}
