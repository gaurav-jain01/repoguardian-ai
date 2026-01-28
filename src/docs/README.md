# RepoGuardian AI - Documentation

## 🚀 Quick Start

### Getting Started with Free AI API

RepoGuardian uses AI to analyze code. You have several **FREE** options:

#### ⭐ Option 1: Google AI Studio (Recommended)
**Best for:** Development, testing, and production  
**Cost:** FREE  
**Setup Time:** 2 minutes

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Sign in with Google account
3. Click "Get API Key"
4. Create new project
5. Copy your API key
6. Add to `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
7. Run `node test/testGemini.js` to verify

✅ **Works immediately with existing code!**

---

#### 🔄 Option 2: OpenRouter
**Best for:** Access to multiple AI models  
**Cost:** FREE (50 requests/day)  
**Setup Time:** 3 minutes

1. Visit [OpenRouter](https://openrouter.ai)
2. Create free account
3. Get API key
4. Add to `.env`: `OPENROUTER_API_KEY=your_key_here`
5. See `config/openrouter.example.js` for implementation

**Free Models:**
- Gemini 2.0 Flash
- Claude Haiku
- GPT-4o Mini
- DeepSeek Chat
- And more!

---

#### 🏠 Option 3: Self-Hosted (Ollama)
**Best for:** Privacy, unlimited usage  
**Cost:** FREE (requires local hardware)  
**Setup Time:** 15 minutes

For advanced users who want complete control.

---

## 📚 Documentation Files

- [`free-ai-api-alternatives.md`](./free-ai-api-alternatives.md) - Comprehensive guide to all free AI options
- [`../config/openrouter.example.js`](../config/openrouter.example.js) - OpenRouter integration example

---

## 🆘 Troubleshooting

### Error: "API_KEY_INVALID"
- Make sure you copied the entire API key
- Check that it's in your `.env` file
- Verify the key at [Google AI Studio](https://aistudio.google.com)

### Error: "Rate limit exceeded"
- You've hit the free tier limit
- Wait 24 hours, or
- Consider OpenRouter for additional quota
- See alternatives in `free-ai-api-alternatives.md`

### Error: "Model not found"
- Update to latest model name in `config/gemini.js`
- Current models: `gemini-2.5-flash`, `gemini-2.5-pro`

---

## 💡 Tips

1. **Google AI Studio** offers the best quality and fastest responses
2. **OpenRouter** is great for comparing different models
3. Monitor your usage to stay within free limits
4. Never commit API keys to git (they're in `.gitignore`)

---

## 🔗 Quick Links

- [Google AI Studio](https://aistudio.google.com) - Get free Gemini API key
- [OpenRouter](https://openrouter.ai) - Multi-model AI platform
- [Ollama](https://ollama.com) - Run AI locally

---

**Need help?** Check out the detailed guide in [`free-ai-api-alternatives.md`](./free-ai-api-alternatives.md)
