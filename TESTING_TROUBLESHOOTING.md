# Chat API - Testing & Troubleshooting Guide

## ✅ Pre-Deployment Checklist

### Environment Setup

- [ ] `GEMINI_API_KEY` is set and valid
- [ ] Node.js version 18+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] Next.js version 16.2.6 or compatible
- [ ] Google Generative AI library installed

### File Integrity

- [ ] `app/lib/chatLibrary.js` exists and has all functions
- [ ] `app/api/chat/route.js` implements the API endpoint
- [ ] `components/researcher/ResearcherPage.jsx` loads properly
- [ ] `components/researcher/ChatMessages.jsx` renders messages
- [ ] `components/researcher/ChatInput.jsx` handles input
- [ ] No TypeScript/ESLint errors: `npm run lint`

### API Validation

- [ ] API key has correct permissions
- [ ] API key hasn't exceeded quota
- [ ] Network connectivity is available
- [ ] Firewall allows outbound HTTPS to Google APIs

### Database & Storage (if applicable)

- [ ] Conversation storage configured (if needed)
- [ ] Database migrations complete
- [ ] Backup systems in place

---

## 🧪 Testing Guide

### 1. Basic Functionality Tests

#### Test Math Query Detection & Response

```javascript
// Test message
"Solve the quadratic equation: x² - 5x + 6 = 0"

// Expected behavior
- Query type should be: "math"
- Response should show:
  - Problem identification
  - Step-by-step solution
  - Verification
  - Alternative methods (if applicable)
- Contains mathematical notation or formatted steps
```

#### Test Code Query

```javascript
// Test message
"Create a React component for a card with title and description"

// Expected behavior
- Query type should be: "code"
- Response should contain:
  - Complete functional component
  - Code block with proper syntax highlighting
  - Comments explaining logic
  - Usage examples
  - Props description
```

#### Test Debug Query

```javascript
// Test message
"TypeError: Cannot read property 'name' of undefined at line 45"

// Expected behavior
- Query type should be: "debug"
- Response should identify:
  - Root cause
  - Why it's happening
  - How to fix it
  - Prevention strategies
```

#### Test Explanation Query

```javascript
// Test message
"Explain how machine learning works"

// Expected behavior
- Query type should be: "explain"
- Response should:
  - Start simple, build complexity
  - Include examples
  - Use analogies
  - Explain practical applications
```

#### Test General Question

```javascript
// Test message
"What are the benefits of using TypeScript?"

// Expected behavior
- Query type should be: "question"
- Response should:
  - Answer comprehensively
  - Provide context
  - Include pros/cons
  - Suggest when to use
```

### 2. Component Testing

#### ChatMessages Component Test

````javascript
// Test rendering with different message types
const testMessages = [
  { id: 1, sender: 'user', text: 'Hello', queryType: null },
  { id: 2, sender: 'ai', text: 'Hi! How can I help?', queryType: 'question' },
  { id: 3, sender: 'ai', text: '```javascript\ncode here\n```', queryType: 'code' },
  { id: 4, sender: 'ai', text: 'Error message', isError: true }
];

// Verify:
- [ ] User messages appear on right, blue background
- [ ] AI messages appear on left, gray background
- [ ] Error messages appear in red
- [ ] Code blocks render with syntax highlighting
- [ ] Query type badges display (📐, 💻, 🐛, 📚, ❓)
- [ ] Follow-up questions display as clickable buttons
- [ ] Messages auto-scroll to bottom
- [ ] Loading state shows animated dots
````

#### ResearcherPage Component Test

```javascript
// Test user interaction flow
1. User enters query
2. Click send button or Ctrl+Enter
3. Verify:
   - [ ] Input clears
   - [ ] User message appears immediately
   - [ ] Loading state starts
   - [ ] Loading dots animate
4. Wait for response
5. Verify:
   - [ ] Loading state ends
   - [ ] AI response appears
   - [ ] Response is formatted correctly
   - [ ] Follow-up buttons appear
6. Click follow-up question
7. Verify:
   - [ ] Input field populates with question
   - [ ] Can modify question before sending
```

### 3. API Endpoint Tests

#### Direct API Testing

```bash
# Test with curl
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Solve 2x = 10",
    "conversationHistory": []
  }'

# Expected response
{
  "success": true,
  "reply": "...",
  "queryType": "math",
  "metadata": {...},
  "quality": {...},
  "followUpQuestions": [...],
  "timestamp": "...",
  "model": "gemini-2.5-flash"
}
```

#### Test Error Handling

```bash
# Test 1: Empty message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": ""}'
# Expected: 400 error

# Test 2: Invalid format
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": null}'
# Expected: 400 error

# Test 3: Missing message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: 400 error
```

#### Test Conversation History

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you simplify it?",
    "conversationHistory": [
      {"sender": "user", "text": "Solve 2x + 5 = 13"},
      {"sender": "ai", "text": "x = 4"}
    ]
  }'

# Verify:
- [ ] Response understands context ("it" refers to previous equation)
- [ ] Response builds on previous answer
```

### 4. Query Type Detection Tests

```javascript
const testCases = [
  // Math
  { msg: "Solve 3x² + 2x - 1 = 0", expected: "math" },
  { msg: "What's the derivative of x³?", expected: "math" },
  { msg: "Calculate √144", expected: "math" },

  // Code
  { msg: "How do I write a for loop in Python?", expected: "code" },
  { msg: "Fix this JavaScript error", expected: "code" },
  { msg: "Create a REST API endpoint", expected: "code" },

  // Debug
  { msg: "My code is broken", expected: "debug" },
  { msg: "TypeError: Cannot read property", expected: "debug" },
  { msg: "Why is my code crashing?", expected: "debug" },

  // Explain
  { msg: "What is recursion?", expected: "explain" },
  { msg: "Explain how databases work", expected: "explain" },
  { msg: "How does encryption work?", expected: "explain" },

  // Question (default)
  { msg: "What's the capital of France?", expected: "question" },
  { msg: "When will the meeting start?", expected: "question" },
];

function runDetectionTests() {
  let passed = 0;
  let failed = 0;

  testCases.forEach(({ msg, expected }) => {
    const result = detectQueryType(msg);
    if (result === expected) {
      console.log(`✅ PASS: "${msg}" → ${result}`);
      passed++;
    } else {
      console.log(`❌ FAIL: "${msg}" → got ${result}, expected ${expected}`);
      failed++;
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
}
```

### 5. Performance Testing

#### Response Time Measurement

```javascript
async function measureResponseTime(message) {
  const startTime = performance.now();

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversationHistory: [] }),
  });

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`Response time: ${duration.toFixed(2)}ms`);
  return duration;
}

// Expected timings:
// - Simple question: 1-3 seconds
// - Code problem: 2-5 seconds
// - Complex math: 2-4 seconds
// - Long explanation: 3-6 seconds
```

#### Token Usage Measurement

```javascript
// Track tokens used per request
function estimateTokens(text) {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

async function trackTokenUsage(message, response) {
  const inputTokens = estimateTokens(message);
  const outputTokens = estimateTokens(response.reply);
  const totalTokens = inputTokens + outputTokens;

  console.log(
    `Input: ${inputTokens}, Output: ${outputTokens}, Total: ${totalTokens}`,
  );
  return totalTokens;
}
```

---

## 🐛 Troubleshooting Guide

### Problem: API Returns 401 Unauthorized

**Symptoms**:

- Authentication error in console
- "Invalid API key" in error message

**Solutions**:

1. Verify API key is set: `echo $GEMINI_API_KEY`
2. Check API key is correct in .env.local
3. Verify API key hasn't expired
4. Check API key has correct permissions
5. Restart development server after changing .env

```bash
# Verify API key
echo $GEMINI_API_KEY

# Should print your actual API key, not empty
```

### Problem: API Returns 429 Too Many Requests

**Symptoms**:

- Rate limit error after multiple requests
- Requests fail after a few minutes of use

**Solutions**:

1. Implement request throttling
2. Add delay between requests
3. Check API quota limits
4. Consider upgrading API tier

```javascript
// Add throttling
async function throttledChat(message, delay = 1000) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return chat(message);
}
```

### Problem: Responses are Empty or Incomplete

**Symptoms**:

- API returns success but reply is empty
- Responses cut off mid-sentence

**Solutions**:

1. Increase `maxOutputTokens`:

   ```javascript
   maxOutputTokens: 8192; // Increased from 4096
   ```

2. Check if response was actually received:

   ```javascript
   if (!response.reply || response.reply.trim() === "") {
     console.error("Empty response received");
   }
   ```

3. Verify API isn't timing out:
   - Check network speed
   - Monitor API latency

### Problem: Wrong Query Type Detection

**Symptoms**:

- Math problem detected as code
- Code request detected as question

**Solutions**:

1. Use more specific keywords:

   ```
   ❌ "How do I" (ambiguous)
   ✅ "How do I solve 2x + 5 = 13" (specific)
   ```

2. Combine keywords:

   ```
   "Write code to solve this equation" → better detected as code + math
   ```

3. Check keyword overlap and add exclusions

### Problem: Messages Don't Show Follow-up Questions

**Symptoms**:

- Follow-up buttons don't appear
- Messages render but no suggestions shown

**Solutions**:

1. Verify API returns followUpQuestions:

   ```javascript
   console.log(data.followUpQuestions);
   ```

2. Check if ChatMessages component is rendering them:

   ```javascript
   {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
     <FollowUpSuggestions {...} />
   )}
   ```

3. Verify feature flag if implemented:
   ```javascript
   if (featureFlags.enableFollowUpQuestions) {
     // Generate suggestions
   }
   ```

### Problem: Code Blocks Not Highlighting

**Symptoms**:

- Code appears in plain text
- No language badge above code

**Solutions**:

1. Ensure code is wrapped in triple backticks with language:

   ````
   ✅ ```javascript
   ❌ ```
   ❌ code without backticks
   ````

2. Check CSS is applied:

   ```css
   pre {
     background: #111;
     color: #fff;
     padding: 1rem;
   }
   ```

3. Verify MessageContent component processes code blocks correctly

### Problem: Input Doesn't Clear After Sending

**Symptoms**:

- Message text stays in input after send
- Same message keeps appearing

**Solutions**:

1. Check setQuery is called with empty string:

   ```javascript
   setQuery(""); // Must be empty string, not null
   ```

2. Verify state update happens before API call:
   ```javascript
   const currentQuery = query;
   setQuery(""); // Clear immediately
   // Then send currentQuery to API
   ```

### Problem: Conversation History Not Maintained

**Symptoms**:

- Each response ignores previous messages
- Context is lost between messages

**Solutions**:

1. Verify history is passed to API:

   ```javascript
   body: JSON.stringify({
     message: currentQuery,
     conversationHistory: messages, // Include this
   });
   ```

2. Check history format is correct:

   ```javascript
   // Correct format
   [
     { sender: "user", text: "..." },
     { sender: "ai", text: "..." },
   ];
   ```

3. Verify chat function uses history:
   ```javascript
   const contents = [
     ...conversationHistory.map(...),
     { role: "user", parts: [{ text: userMessage }] }
   ];
   ```

### Problem: Slow Response Times

**Symptoms**:

- Responses take 10+ seconds
- Loading spinner shows for long time

**Solutions**:

1. Reduce `maxOutputTokens`:

   ```javascript
   maxOutputTokens: 2048; // Faster but shorter responses
   ```

2. Reduce conversation history:

   ```javascript
   conversationHistory.slice(-5); // Keep only last 5 messages
   ```

3. Check network speed and API latency
4. Consider using streaming responses for better UX

### Problem: Styling Not Applied Correctly

**Symptoms**:

- Messages misaligned
- Colors wrong
- Layout broken

**Solutions**:

1. Verify Tailwind CSS is configured
2. Clear Next.js cache: `rm -rf .next`
3. Restart development server
4. Check for conflicting CSS
5. Verify className strings are correct

### Problem: Mobile Layout Issues

**Symptoms**:

- Messages cut off on mobile
- Input box too small
- Buttons not clickable

**Solutions**:

1. Check responsive classes:

   ```jsx
   className = "max-w-2xl md:max-w-4xl"; // Responsive width
   ```

2. Test on actual mobile device
3. Use browser dev tools mobile view
4. Verify touch events work properly

---

## 📊 Monitoring & Debugging

### Browser Console Debugging

```javascript
// Add to components for debugging
console.log("Messages:", messages);
console.log("API Response:", data);
console.log("Query Type:", queryType);
console.log("Error:", error);

// Use debug utilities
const debug = {
  log: (label, data) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG] ${label}:`, data);
    }
  },
};

debug.log("Response received", data);
```

### Network Monitoring

```javascript
// Monitor API calls in Network tab
// 1. Open DevTools (F12)
// 2. Go to Network tab
// 3. Send a message
// 4. Click on /api/chat request
// 5. Review Headers, Preview, Response tabs

// Check timing:
// - Time: total request time
// - Latency: server response time
// - Download: data transfer time
```

### Error Logging

```javascript
// Set up error tracking
function logError(error, context = {}) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    context: context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  console.error("Error:", errorData);

  // Send to error tracking service (Sentry, etc.)
  // sendToErrorTracker(errorData);
}
```

---

## 🔄 Testing Workflow

### Daily Testing Routine

1. ✅ Test each query type (math, code, debug, explain, question)
2. ✅ Test conversation history with 2-3 turn conversation
3. ✅ Check follow-up questions appear and work
4. ✅ Verify error messages display correctly
5. ✅ Check performance (response time < 5 seconds)

### Weekly Testing

1. Run full test suite
2. Test with edge cases and unusual inputs
3. Monitor API usage and costs
4. Check for console errors
5. Test on different browsers
6. Test on mobile devices

### Monthly Testing

1. Performance regression testing
2. Load testing with multiple concurrent users
3. Security audit
4. Database backup verification
5. Documentation review

---

## 📝 Test Cases Reference

```javascript
// Save as tests/chatLibrary.test.js
describe("Chat Library", () => {
  describe("Query Type Detection", () => {
    test("should detect math queries", () => {
      const type = detectQueryType("Solve 2x + 5 = 13");
      expect(type).toBe("math");
    });

    test("should detect code queries", () => {
      const type = detectQueryType("Write a React component");
      expect(type).toBe("code");
    });

    // Add more tests...
  });

  describe("Chat Function", () => {
    test("should return successful response", async () => {
      const response = await chat("Hello");
      expect(response.success).toBe(true);
      expect(response.reply).toBeDefined();
    });

    // Add more tests...
  });
});
```

---

## 🚀 Health Check Commands

```bash
# Check Node version
node --version  # Should be 18+

# Check npm packages
npm list

# Build check
npm run build

# Lint check
npm run lint

# Check if server starts
npm run dev
# Then navigate to http://localhost:3000/researcher

# Test API endpoint
curl http://localhost:3000/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

---

**Testing Guide Version**: 1.0
**Last Updated**: May 28, 2026
**Maintained By**: Development Team
