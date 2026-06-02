# Quick Reference Guide - Chat API Implementation

## 🚀 Quick Start

### Setup
1. Ensure `GEMINI_API_KEY` is set in your environment
2. Start the development server: `npm run dev`
3. Navigate to `/researcher` to use the chat feature

### Using the Chat System

#### Access
- **Route**: http://localhost:3000/researcher
- **Components**: ResearcherPage, ChatMessages, ChatInput

#### Capabilities
- Ask math problems and get step-by-step solutions
- Request code implementations with explanations
- Get help debugging code
- Learn concepts with examples
- Ask general questions

---

## 📚 Core Functions Quick Reference

### `chat(message, history, queryType)`
**What it does**: Main chat function that processes user messages
```javascript
const response = await chat("Solve 2x + 5 = 13", [], "math");
```
**Returns**: `{ success, reply, queryType, timestamp, model }`

### `detectQueryType(message)`
**What it does**: Identifies what type of query the user is asking
```javascript
const type = detectQueryType("How does photosynthesis work?");
// Returns: "explain"
```
**Returns**: string (math | code | debug | explain | question)

### `processSpecializedQuery(type, message, history)`
**What it does**: Process a query with explicit type specification
```javascript
await processSpecializedQuery("code", "Create a React button", []);
```

### `generateFollowUpQuestions(response, queryType)`
**What it does**: Suggest relevant follow-up questions
```javascript
const suggestions = generateFollowUpQuestions(response, "math");
// Returns: ["Can you explain this step?", "What if numbers were different?", ...]
```

### `summarizeConversation(messages)`
**What it does**: Create a summary of the conversation
```javascript
const summary = await summarizeConversation(messages);
```

### `getResponseMetadata(message, response)`
**What it does**: Get detailed metadata about the response
```javascript
const meta = getResponseMetadata(userMsg, aiResponse);
// Returns: { queryType, responseLength, hasCodeBlock, complexity, ... }
```

### `validateResponseQuality(response, queryType)`
**What it does**: Check if response is comprehensive enough
```javascript
const quality = validateResponseQuality(response, "code");
// Returns: { isComprehensive, checks, recommendations }
```

---

## 🔍 Query Type Detection Keywords

### Math Keywords
`solve`, `calculate`, `equation`, `formula`, `integral`, `derivative`, `√`, `∑`, `∫`, `limit`, `matrix`, `algebra`, `calculus`, etc.

**Example**: "Solve 3x² + 2x - 1 = 0" → **math**

### Code Keywords
`code`, `function`, `class`, `debug`, `error`, `javascript`, `python`, `implement`, `write`, `build`, `fix`, etc.

**Example**: "Create a JavaScript function to calculate factorial" → **code**

### Debug Keywords
`debug`, `fix`, `broken`, `error:`, `not working`, `bug`, `crash`, `fail`, etc.

**Example**: "My code throws TypeError at line 42" → **debug**

### Explain Keywords
`explain`, `what is`, `how does`, `why`, `understand`, `concept`, `describe`, `teach`, etc.

**Example**: "Explain how neural networks work" → **explain**

### Question Keywords
(Everything else)

**Example**: "What is the capital of France?" → **question**

---

## 🛠️ API Endpoint Reference

### POST `/api/chat`

**Request Body:**
```javascript
{
  "message": "Your question or request",
  "conversationHistory": [
    { "sender": "user", "text": "Previous message" },
    { "sender": "ai", "text": "Previous response" }
  ]
}
```

**Response:**
```javascript
{
  "success": true,
  "reply": "Detailed answer...",
  "queryType": "math",
  "metadata": {
    "responseLength": 1200,
    "hasCodeBlock": false,
    "hasMathNotation": true,
    "complexity": "high"
  },
  "quality": {
    "isComprehensive": true,
    "checks": { "lengthOk": true, "formattingOk": true, "hasExplanation": true },
    "recommendations": []
  },
  "followUpQuestions": [
    "Can you explain this step differently?",
    "What if the numbers were different?"
  ],
  "timestamp": "2026-05-28T10:30:00.000Z",
  "model": "gemini-2.5-flash"
}
```

**Error Response:**
```javascript
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2026-05-28T10:30:00.000Z"
}
```

---

## 💻 Component Integration Examples

### Using in ResearcherPage:
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userQuery,
    conversationHistory: messages
  })
});

const data = await response.json();

const aiMessage = {
  text: data.reply,
  queryType: data.queryType,
  followUpQuestions: data.followUpQuestions,
  metadata: data.metadata
};

setMessages(prev => [...prev, aiMessage]);
```

### Handling Follow-up Questions:
```javascript
const handleFollowUpClick = (question) => {
  setQuery(question);  // Populate input with suggestion
  handleSendMessage(); // Send immediately
};
```

---

## 📊 Response Format Examples

### Math Problem Response:
```
**Problem**: Solve 2x + 5 = 13

**Solution**:
1. Start with: 2x + 5 = 13
2. Subtract 5 from both sides: 2x = 8
3. Divide both sides by 2: x = 4

**Verification**: 2(4) + 5 = 8 + 5 = 13 ✓
```

### Code Response:
```javascript
// React button component
export function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

### Debug Response:
```
**Problem**: TypeError: Cannot read property 'length' of undefined

**Root Cause**: You're trying to access `.length` on a variable that might be undefined

**Solution**:
Before: let len = data.array.length;
After:  let len = data?.array?.length ?? 0;

**Explanation**: Use optional chaining (?.) to safely access nested properties
```

---

## ⚙️ Configuration & Settings

### Generation Parameters:
```javascript
generationConfig: {
  temperature: 0.7,        // Balance between creativity and consistency
  topP: 0.9,              // Nucleus sampling
  topK: 40,               // Top-k sampling
  maxOutputTokens: 4096   // Response length limit
}
```

### Adjusting Parameters:
- **Increase temperature** (0.7→0.9) for more creative responses
- **Decrease temperature** (0.7→0.5) for more factual responses
- **Increase maxOutputTokens** for longer, more detailed responses
- **Decrease maxOutputTokens** for shorter, more concise responses

---

## 🐛 Troubleshooting

### Problem: Empty Responses
**Solution**: 
- Check API key is valid
- Verify network connectivity
- Check if API rate limit exceeded
- Try with simpler query

### Problem: Wrong Query Type Detection
**Solution**:
- Add specific keywords for your query type
- Use more precise language
- Be more explicit about what you need

### Problem: Incomplete Code Responses
**Solution**:
- Increase `maxOutputTokens` in generationConfig
- Break complex requests into smaller parts
- Ask for specific parts separately

### Problem: API Errors
**Solution**:
- Verify `GEMINI_API_KEY` environment variable
- Check API key has proper permissions
- Check API key hasn't expired
- Monitor API usage and quotas

---

## 📝 File Structure

```
adverseai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          # Chat API endpoint
│   └── lib/
│       ├── chatLibrary.js        # Core chat functionality
│       └── CHAT_LIBRARY_README.md # Detailed documentation
├── components/
│   └── researcher/
│       ├── ResearcherPage.jsx    # Main page
│       ├── ChatMessages.jsx      # Message display
│       └── ChatInput.jsx         # Input component
└── IMPLEMENTATION_SUMMARY.md      # This implementation summary
```

---

## 🎯 Common Tasks

### Add a New Query Type:
1. Add keywords to `detectQueryType()`
2. Add specialized prompt to `SPECIALIZED_PROMPTS`
3. Add follow-up questions to `generateFollowUpQuestions()`

### Customize System Prompt:
1. Edit `SYSTEM_PROMPT` in `chatLibrary.js`
2. Update specialized prompts as needed
3. Test with various queries

### Change Model:
1. Replace model ID in `chat()` function: `"gemini-2.5-flash"`
2. Test compatibility with response structure

### Adjust Response Length:
1. Change `maxOutputTokens` in `generationConfig`
2. Current: 4096 (very detailed)
3. For shorter: use 2048 or 1024

---

## 📞 Support Resources

1. **Documentation**: See `app/lib/CHAT_LIBRARY_README.md`
2. **API Reference**: Check `app/api/chat/route.js`
3. **Components**: Review `components/researcher/`
4. **Examples**: Check test messages in ChatMessages initial state

---

**Last Updated**: May 28, 2026
**Version**: 2.2
**Status**: Production Ready ✅
