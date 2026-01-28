// OpenRouter Integration Example
// Alternative free AI API provider for RepoGuardian
// See docs/free-ai-api-alternatives.md for full details

import OpenAI from 'openai';

/**
 * OpenRouter Configuration
 * 
 * 🆓 FREE SETUP:
 * 1. Visit https://openrouter.ai
 * 2. Create free account (no credit card needed)
 * 3. Get API key from dashboard
 * 4. Add to .env: OPENROUTER_API_KEY=your_key_here
 * 5. Install: npm install openai
 * 
 * Free tier: 50 requests/day (1000/day with $10 credit)
 * Access to Gemini, GPT, Claude, and more!
 */

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/yourusername/repogaurdian-ai",
    "X-Title": "RepoGuardian AI",
  }
});

/**
 * Analyzes code using OpenRouter's free models
 * @param {string} code - The code to analyze
 * @param {string} model - Model to use (default: google/gemini-2.0-flash-001)
 * @returns {Promise<string>} - Analysis results
 */
async function analyzeCodeWithOpenRouter(code, model = "google/gemini-2.0-flash-001") {
    try {
        const completion = await client.chat.completions.create({
            model: model, // Free models available - see list below
            messages: [
                {
                    role: "user",
                    content: `You are a code review agent. Analyze this code and list issues, improvements, and fixes:\n\n${code}`
                }
            ]
        });

        return completion.choices[0].message.content;
        
    } catch (error) {
        console.error("OpenRouter API Error:", error.message);
        
        if (error.message.includes("API_KEY") || error.message.includes("authentication")) {
            throw new Error(
                "Invalid or missing OpenRouter API key. " +
                "Get a free key at https://openrouter.ai"
            );
        }
        
        if (error.message.includes("rate limit")) {
            throw new Error(
                "Rate limit reached (50 requests/day on free tier). " +
                "Consider upgrading or using Google AI Studio instead."
            );
        }
        
        throw error;
    }
}

/**
 * FREE MODELS AVAILABLE ON OPENROUTER (No credit card needed):
 * 
 * Gemini:
 * - "google/gemini-2.0-flash-001" (Fast, good quality)
 * - "google/gemini-flash-1.5" (Alternative)
 * 
 * Meta:
 * - "meta-llama/llama-3.2-3b-instruct" (Smaller, faster)
 * - "meta-llama/llama-3.1-8b-instruct" (Balanced)
 * 
 * DeepSeek:
 * - "deepseek/deepseek-chat" (Great for coding)
 * 
 * NVIDIA:
 * - "nvidia/llama-3.1-nemotron-70b-instruct" (High quality)
 * 
 * Check latest free models: https://openrouter.ai/models?order=newest&supported_parameters=tools
 */

export { analyzeCodeWithOpenRouter };
