import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Test Gemini API Integration
 * 
 * 🆓 Need an API key? Get one FREE at https://aistudio.google.com
 * Then add to .env file: GEMINI_API_KEY=your_key_here
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        console.log("🧪 Testing Gemini API Integration...\n");

        // Test 1: Basic text generation with Gemini 2.5 Flash
        console.log("=== Test 1: Basic Response ===");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent("Hello from RepoGuardian! Tell me about code review best practices in one sentence.");
        const response = await result.response;
        console.log("✅ Response:", response.text(), "\n");

        // Test 2: Code analysis simulation
        console.log("=== Test 2: Code Analysis ===");
        const codeAnalysisResult = await model.generateContent(`
            You are a code review agent.
            Analyze this code and list any issues:
            
            function hello() {
                var x = 1;
                console.log(x)
            }
        `);
        const analysisResponse = await codeAnalysisResult.response;
        console.log("✅ Analysis:", analysisResponse.text(), "\n");

        console.log("🎉 All tests passed! Gemini API is working correctly.\n");
        console.log("💡 For alternative free API providers, see docs/free-ai-api-alternatives.md");
        
    } catch (err) {
        console.error("\n❌ Error occurred:");
        console.error(err.message);
        
        if (err.message.includes("API_KEY") || !process.env.GEMINI_API_KEY) {
            console.error("\n📝 To fix this:");
            console.error("1. Visit https://aistudio.google.com");
            console.error("2. Sign in with your Google account");
            console.error("3. Create an API key (it's FREE!)");
            console.error("4. Add it to your .env file as: GEMINI_API_KEY=your_key_here\n");
            console.error("💡 See docs/free-ai-api-alternatives.md for other options");
        }
        
        if (err.stack) {
            console.error("\nStack trace:", err.stack);
        }
    }
}

test();