import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * RepoGuardian AI - Gemini Configuration
 * 
 * 🆓 FREE API KEY: Get your free Gemini API key from Google AI Studio
 * Visit: https://aistudio.google.com
 * - Sign in with Google account
 * - Navigate to "API Keys"
 * - Create new project and generate API key
 * - Add to .env file as GEMINI_API_KEY=your_key_here
 * 
 * Free tier includes generous limits for development and testing!
 * See docs/free-ai-api-alternatives.md for other options.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes code and provides review feedback
 * @param {string} code - The code to analyze
 * @returns {Promise<string>} - Analysis results
 */
async function analyzeCode(code) {
    try {
        // Using Gemini 2.5 Flash - fast, capable, and free tier available
        // Alternative models: "gemini-2.5-pro", "gemini-1.5-flash", "gemini-1.5-pro"
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are a code review agent.
            Analyze this code and list issues, improvements, and fixes:
            
            ${code}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
        
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        
        if (error.message.includes("API_KEY")) {
            throw new Error(
                "Invalid or missing Gemini API key. " +
                "Get a free key at https://aistudio.google.com"
            );
        }
        
        if (error.message.includes("quota") || error.message.includes("429")) {
            throw new Error(
                "Rate limit exceeded. Consider using OpenRouter as fallback. " +
                "See docs/free-ai-api-alternatives.md"
            );
        }
        
        throw error;
    }
}

export { analyzeCode };
