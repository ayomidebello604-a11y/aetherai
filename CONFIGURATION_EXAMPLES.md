# Chat Library - Configuration Examples

## 1. Default Configuration (Balanced)

```javascript
// app/lib/chatLibrary.js
const generationConfig = {
  temperature: 0.7, // Balanced between creative and factual
  topP: 0.9, // Good diversity
  topK: 40, // Natural language quality
  maxOutputTokens: 4096, // Comprehensive responses
};

// Best for: General use, balanced responses
// Use case: Most queries, default behavior
```

---

## 2. Factual/Precise Configuration

```javascript
const generationConfig = {
  temperature: 0.3, // Low - very factual, less random
  topP: 0.8, // Lower diversity
  topK: 20, // More focused
  maxOutputTokens: 2048, // Shorter responses
};

// Best for: Technical queries, math, code
// Use case: When accuracy is critical
```

---

## 3. Creative/Detailed Configuration

```javascript
const generationConfig = {
  temperature: 0.9, // High - more creative variations
  topP: 1.0, // Maximum diversity
  topK: 64, // Wider selection
  maxOutputTokens: 8192, // Very detailed responses
};

// Best for: Explanations, creative writing, brainstorming
// Use case: When you want comprehensive, detailed responses
```

---

## 4. Quick Response Configuration

```javascript
const generationConfig = {
  temperature: 0.5, // Moderate
  topP: 0.85,
  topK: 30,
  maxOutputTokens: 512, // Short responses
};

// Best for: Quick answers, summaries
// Use case: When response speed is priority
```

---

## 5. Per-Query Configuration

Customize config based on query type:

```javascript
function getConfigForQueryType(queryType) {
  const configs = {
    math: {
      temperature: 0.2,
      topP: 0.8,
      topK: 20,
      maxOutputTokens: 2048,
    },
    code: {
      temperature: 0.3,
      topP: 0.85,
      topK: 25,
      maxOutputTokens: 4096,
    },
    explain: {
      temperature: 0.7,
      topP: 0.95,
      topK: 50,
      maxOutputTokens: 4096,
    },
    debug: {
      temperature: 0.2,
      topP: 0.8,
      topK: 20,
      maxOutputTokens: 3000,
    },
    question: {
      temperature: 0.6,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
    },
  };

  return configs[queryType] || configs.question;
}

// Usage in chat function
const config = getConfigForQueryType(detectedType);
```

---

## 6. Environment-Based Configuration

```javascript
// For development
const DEV_CONFIG = {
  temperature: 0.8,
  maxOutputTokens: 4096,
};

// For production
const PROD_CONFIG = {
  temperature: 0.5,
  maxOutputTokens: 2048,
};

const activeConfig =
  process.env.NODE_ENV === "production" ? PROD_CONFIG : DEV_CONFIG;
```

---

## 7. Custom Model Configuration

```javascript
// Switch between different Gemini models
const MODELS = {
  fast: "gemini-2.5-flash", // Fast, good for quick responses
  standard: "gemini-1.5-pro", // Balanced
  advanced: "gemini-ultra", // Most capable, slower
};

const model = genAI.getGenerativeModel({
  model: MODELS.standard,
  systemInstruction: SYSTEM_PROMPT,
});
```

---

## 8. Rate Limiting Configuration

```javascript
// Add rate limiting middleware
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later",
};

// Usage in API route
// Apply rate limiting before processing
```

---

## 9. Conversation History Optimization

```javascript
// Limit conversation history to improve performance
const MAX_HISTORY_LENGTH = 10; // Keep last 10 messages

function optimizeConversationHistory(history) {
  if (history.length > MAX_HISTORY_LENGTH) {
    return history.slice(-MAX_HISTORY_LENGTH);
  }
  return history;
}

// Usage in chat function
const optimizedHistory = optimizeConversationHistory(conversationHistory);
```

---

## 10. Response Caching Configuration

```javascript
const cacheConfig = {
  enabled: true,
  ttl: 3600000, // 1 hour cache duration
  maxSize: 100, // Maximum 100 cached responses
};

// Implement caching for frequent questions
const cache = new Map();

function getCachedResponse(messageHash) {
  const cached = cache.get(messageHash);
  if (cached && Date.now() - cached.timestamp < cacheConfig.ttl) {
    return cached.response;
  }
  return null;
}
```

---

## 11. Error Handling Configuration

```javascript
const errorConfig = {
  retryAttempts: 3,
  retryDelay: 1000, // milliseconds
  timeout: 30000, // 30 seconds
  detailedErrorMessages: process.env.NODE_ENV !== "production",
};

async function chatWithRetry(message, history) {
  for (let attempt = 0; attempt < errorConfig.retryAttempts; attempt++) {
    try {
      return await chat(message, history);
    } catch (error) {
      if (attempt === errorConfig.retryAttempts - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, errorConfig.retryDelay),
      );
    }
  }
}
```

---

## 12. Logging Configuration

```javascript
const loggingConfig = {
  enabled: true,
  level: process.env.LOG_LEVEL || "info", // info, warn, error, debug
  logResponses: process.env.NODE_ENV !== "production",
  logToFile: true,
  logPath: "./logs/chat.log",
};

function logMessage(level, message, data = {}) {
  if (loggingConfig.enabled) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${level}: ${message}`, data);

    if (loggingConfig.logToFile) {
      // Log to file
    }
  }
}
```

---

## 13. Multi-Language Support Configuration

```javascript
const languageConfig = {
  supported: ["en", "es", "fr", "de", "zh"],
  default: "en",
};

function getSystemPromptForLanguage(language) {
  const prompts = {
    en: SYSTEM_PROMPT,
    es: SYSTEM_PROMPT_ES,
    fr: SYSTEM_PROMPT_FR,
    de: SYSTEM_PROMPT_DE,
    zh: SYSTEM_PROMPT_ZH,
  };

  return prompts[language] || prompts[languageConfig.default];
}
```

---

## 14. Feature Flags Configuration

```javascript
const featureFlags = {
  enableStreaming: true,
  enableFollowUpQuestions: true,
  enableResponseMetadata: true,
  enableQualityValidation: true,
  enableConversationSummarization: true,
  enableResponseCaching: false,
  enableAnalytics: true
};

// Usage
if (featureFlags.enableFollowUpQuestions) {
  response.followUpQuestions = generateFollowUpQuestions(...);
}
```

---

## 15. Analytics & Tracking Configuration

```javascript
const analyticsConfig = {
  enabled: true,
  trackQueryTypes: true,
  trackResponseTime: true,
  trackSuccessRate: true,
  trackUserEngagement: true,
  analyticsProvider: "google-analytics", // or 'custom'
  reportingInterval: 3600000, // 1 hour
};

async function trackQuery(queryType, responseTime, success) {
  if (analyticsConfig.enabled) {
    // Log analytics data
    // Send to analytics provider
  }
}
```

---

## Implementation Example

```javascript
// app/lib/chatLibrary.js with custom configuration

import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuration object
const config = {
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.CHAT_MODEL || "gemini-2.5-flash",
  generation: {
    temperature: parseFloat(process.env.TEMP || "0.7"),
    topP: parseFloat(process.env.TOP_P || "0.9"),
    topK: parseInt(process.env.TOP_K || "40"),
    maxOutputTokens: parseInt(process.env.MAX_TOKENS || "4096"),
  },
  features: {
    streaming: process.env.ENABLE_STREAMING !== "false",
    caching: process.env.ENABLE_CACHE !== "false",
    analytics: process.env.ENABLE_ANALYTICS !== "false",
  },
  limits: {
    maxHistoryLength: parseInt(process.env.MAX_HISTORY || "10"),
    timeout: parseInt(process.env.TIMEOUT || "30000"),
  },
};

const genAI = new GoogleGenerativeAI(config.apiKey);

export async function chat(
  userMessage,
  conversationHistory = [],
  queryType = null,
) {
  try {
    const detectedType = queryType || detectQueryType(userMessage);
    const systemPrompt = SPECIALIZED_PROMPTS[detectedType] || SYSTEM_PROMPT;

    const model = genAI.getGenerativeModel({
      model: config.model,
      systemInstruction: systemPrompt,
    });

    const optimizedHistory = conversationHistory.slice(
      -config.limits.maxHistoryLength,
    );

    const contents = [
      ...optimizedHistory.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const response = await model.generateContent({
      contents,
      generationConfig: config.generation,
    });

    const reply = response.response.text();

    return {
      success: true,
      reply: reply,
      timestamp: new Date().toISOString(),
      model: config.model,
      queryType: detectedType,
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return {
      success: false,
      error: error.message || "An error occurred while processing your message",
      timestamp: new Date().toISOString(),
    };
  }
}
```

---

## Environment Variables Setup

```bash
# .env.local file

# API Configuration
GEMINI_API_KEY=your_api_key_here
CHAT_MODEL=gemini-2.5-flash

# Generation Parameters
TEMP=0.7
TOP_P=0.9
TOP_K=40
MAX_TOKENS=4096

# Features
ENABLE_STREAMING=true
ENABLE_CACHE=false
ENABLE_ANALYTICS=true

# Limits
MAX_HISTORY=10
TIMEOUT=30000

# Logging
LOG_LEVEL=info

# Environment
NODE_ENV=development
```

---

## Best Practices for Configuration

1. **Start with defaults**: Use the default configuration for most cases
2. **Adjust gradually**: Make small changes and test
3. **Monitor performance**: Track response time and quality
4. **Use environment variables**: Don't hardcode sensitive settings
5. **Document custom configs**: Explain why you changed defaults
6. **Test thoroughly**: Test new configurations before production
7. **Cache responses**: Enable caching for frequently asked questions
8. **Monitor costs**: Track API usage and token consumption
9. **Set limits**: Implement rate limiting and timeout values
10. **Log appropriately**: Log enough for debugging, not too much for performance

---

**Configuration Guide Version**: 1.0
**Last Updated**: May 28, 2026
