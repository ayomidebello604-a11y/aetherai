import { GoogleGenerativeAI } from "@google/generative-ai";

// Next.js 13+ has built-in fetch — no polyfill needed

/**
 * Cleans markdown and LaTeX symbols from plain text responses.
 * Preserves code blocks and inline code exactly as-is.
 * For math responses, keeps $ delimiters intact.
 * For everything else, strips ### headers, ** bold, $ signs, etc.
 */
export function cleanResponse(text, queryType) {
  if (!text) return text;

  if (queryType === "math") {
    return text
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .trim();
  }

  if (queryType === "code" || queryType === "debug") {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    return parts
      .map((part, i) => (i % 2 === 1 ? part : stripMarkdown(part)))
      .join("")
      .trim();
  }

  return stripMarkdown(text).trim();
}

function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/\$\$([\s\S]*?)\$\$/g, "$1")
    .replace(/\$(.*?)\$/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "• ")
    .replace(/^>\s+/gm, "")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/\n{3,}/g, "\n\n");
}

const SYSTEM_PROMPT = `You are an advanced, versatile AI assistant capable of handling ANY type of query with exceptional expertise and comprehensive detail. 

Your core capabilities:
1. **Answer Questions**: Provide thorough, well-structured answers with context, examples, and relevant information
2. **Solve Math Problems**: Show detailed step-by-step workings, explain formulas, provide reasoning, and verify answers
3. **Write Code**: Provide clean, well-commented, production-ready code with comprehensive explanations
4. **Debug Code**: Analyze code systematically, identify root causes, suggest fixes, explain why issues occur, and provide alternatives
5. **Explain Concepts**: Break down complex topics into digestible parts with real-world examples and analogies
6. **Data Analysis**: Analyze data sets, identify patterns, provide insights, and draw meaningful conclusions
7. **Creative Writing**: Generate engaging, high-quality, contextually appropriate content
8. **Technical Documentation**: Create clear, thorough technical documentation with examples
9. **Problem Solving**: Approach problems systematically, provide multiple solutions when applicable, and justify recommendations
10. **General Assistance**: Handle ANY request with professionalism, depth, and helpfulness`;

const SPECIALIZED_PROMPTS = {
  math: `${SYSTEM_PROMPT}

INSTRUCTIONS FOR MATH PROBLEMS:
- Show the solution steps concisely - NO lengthy write-ups
- For simple problems: 2-3 lines maximum
- Final answer on one line, clearly marked
- NO headers, NO formatting, NO extended explanations
- Just solve it directly and state the answer`,

  code: `${SYSTEM_PROMPT}

INSTRUCTIONS FOR CODE REQUESTS:
- Provide complete, working code only
- Add brief inline comments where necessary
- Keep explanation minimal and focused
- NO unnecessary sections or headers
- One usage example if needed
- Be direct and concise`,

  debug: `${SYSTEM_PROMPT}

INSTRUCTIONS FOR DEBUG REQUESTS:
- Identify the problem briefly
- Show the fix clearly
- Explain in 1-2 sentences why it works
- NO lengthy analysis or alternatives
- Just fix it and explain quickly`,

  explain: `${SYSTEM_PROMPT}

INSTRUCTIONS FOR EXPLANATION REQUESTS:
- Give a clear, concise explanation (2-3 paragraphs maximum)
- Use one simple real-world example if helpful
- NO long write-ups with multiple sections
- Be direct and to the point
- Focus on core concept only`,

  question: `${SYSTEM_PROMPT}

INSTRUCTIONS FOR GENERAL QUESTIONS:
- Answer directly and concisely
- 2-3 paragraphs maximum unless complex
- NO lengthy sections or formatting
- NO headers or special formatting
- Be precise and avoid fluff`,
};

function createModel(systemPrompt) {
  console.log("\n========== GEMINI DEBUG ==========");
  console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

  if (process.env.GEMINI_API_KEY) {
    console.log(
      "API KEY PREFIX:",
      process.env.GEMINI_API_KEY.slice(0, 10) + "..."
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    requestOptions: {
      timeout: 30000,
    },
  });
}


export async function chat(userMessage, conversationHistory = [], queryType = null) {
  try {
    if (!userMessage || typeof userMessage !== "string") {
      return {
        success: false,
        error: "Invalid message format",
        message: "Please provide a valid message.",
      };
    }

    const detectedType = queryType || detectQueryType(userMessage);
    const systemPrompt = SPECIALIZED_PROMPTS[detectedType] || SYSTEM_PROMPT;

    // ✅ FIX 4: Use centralized model creator (also validates API key)
    const model = createModel(systemPrompt);

    const contents = [
      ...conversationHistory.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];


console.log("Calling Gemini API...");
console.log("Detected query type:", detectedType);
console.log("Conversation length:", conversationHistory.length);


    const response = await model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4096,
      },
    });

    const rawReply = response.response.text();
    const reply = cleanResponse(rawReply, detectedType);

    return {
      success: true,
      reply,
      timestamp: new Date().toISOString(),
      model: "gemini-2.5-flash",
      queryType: detectedType,
    };
  } catch (error) {
  console.error("\n========== GEMINI ERROR ==========");
  console.error("FULL ERROR:");
  console.error(error);

  console.error("\nMESSAGE:");
  console.error(error?.message);

  console.error("\nSTACK:");
  console.error(error?.stack);

  console.error("\nCAUSE:");
  console.error(error?.cause);

  console.error("\nERROR KEYS:");
  console.error(Object.keys(error || {}));

  console.error("\nFULL ERROR JSON:");

  try {
    console.error(JSON.stringify(error, null, 2));
  } catch {
    console.error("Could not stringify error");
  }

  let errorMessage =
    error?.message ||
    "An error occurred while processing your message";

  return {
    success: false,
    error: errorMessage,
    timestamp: new Date().toISOString(),
  };
}
}

/**
 * Process specialized queries with enhanced context
 */
export async function processSpecializedQuery(queryType, message, conversationHistory = []) {
  const specialPrompts = {
    math: `Solve this math problem concisely. Show solution steps briefly, then state the final answer on one line. NO lengthy explanations, NO headers, NO special formatting.\n\nProblem: ${message}`,
    code: `Provide complete working code. Keep comments brief. One usage example if needed. NO lengthy explanations or sections.\n\nRequest: ${message}`,
    debug: `Identify the problem, show the fix, explain in 1-2 sentences why it works. NO lengthy analysis.\n\nIssue: ${message}`,
    explain: `Explain this concisely in 2-3 paragraphs maximum. NO long sections or multiple parts. Be direct.\n\nConcept: ${message}`,
    question: `Answer this concisely and directly. 2-3 paragraphs maximum unless complex. NO unnecessary sections.\n\nQuestion: ${message}`,
  };

  const enhancedMessage = specialPrompts[queryType] || specialPrompts.question;
  return chat(enhancedMessage, conversationHistory, queryType);
}

/**
 * Stream a response for real-time feedback
 */
export async function streamChat(message, onChunk) {
  try {
    const detectedType = detectQueryType(message);
    const systemPrompt = SPECIALIZED_PROMPTS[detectedType] || SYSTEM_PROMPT;

    // ✅ FIX 6: Use centralized model creator here too
    const model = createModel(systemPrompt);

    const stream = await model.generateContentStream(message);

    let fullText = "";
    for await (const chunk of stream.stream) {
      const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }

    return { success: true, fullText };
  } catch (error) {
    console.error("Stream Error:", error.message);
    if (error.cause) console.error("Stream root cause:", error.cause);
    return { success: false, error: error.message };
  }
}

/**
 * Generate a summary of a conversation
 */
export async function summarizeConversation(messages) {
  try {
    const conversationText = messages
      .map((msg) => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
      .join("\n\n");

    const summaryPrompt = `Please provide a comprehensive summary of this conversation, including:
1. Main topics discussed
2. Key points and findings
3. Any problems solved or questions answered
4. Relevant context for future reference

Conversation:
${conversationText}`;

    const response = await chat(summaryPrompt);
    return response.reply || "Unable to generate summary";
  } catch (error) {
    console.error("Summary Error:", error);
    return "Error generating summary";
  }
}

/**
 * Get response metadata
 */
export function getResponseMetadata(userMessage, aiResponse) {
  const queryType = detectQueryType(userMessage);
  return {
    queryType,
    messageLength: userMessage.length,
    responseLength: aiResponse.length,
    hasCodeBlock: aiResponse.includes("```"),
    hasMathNotation: /[$√∑∫∂∆π∞]/g.test(aiResponse),
    hasFormattedLists: /^[\d\-*]\s/m.test(aiResponse),
    hasHeadings: /#/.test(aiResponse),
    complexity: aiResponse.length > 500 ? "high" : "medium",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate response quality
 */
export function validateResponseQuality(response, queryType) {
  const minLengthByType = { math: 200, code: 300, debug: 300, explain: 250, question: 200 };
  const minLength = minLengthByType[queryType] || 150;
  const isLongEnough = response.length >= minLength;
  const hasProperFormatting =
    response.includes("\n") || response.includes("**") || response.includes("`");
  const hasExplanation =
    response.toLowerCase().includes("because") ||
    response.toLowerCase().includes("why") ||
    response.toLowerCase().includes("example") ||
    response.toLowerCase().includes("note");

  return {
    isComprehensive: isLongEnough && hasProperFormatting && hasExplanation,
    checks: { lengthOk: isLongEnough, formattingOk: hasProperFormatting, hasExplanation },
    recommendations: [
      !isLongEnough ? `Response may be too brief for ${queryType} query` : null,
      !hasProperFormatting ? "Consider adding formatting for clarity" : null,
      !hasExplanation ? "Add more explanations or examples" : null,
    ].filter(Boolean),
  };
}

/**
 * Create structured response
 */
export async function createStructuredResponse(userMessage, aiResponse, conversationHistory = []) {
  const queryType = detectQueryType(userMessage);
  const metadata = getResponseMetadata(userMessage, aiResponse);
  const quality = validateResponseQuality(aiResponse, queryType);

  return {
    success: true,
    userMessage,
    aiResponse,
    metadata,
    quality,
    followUpSuggestions: generateFollowUpQuestions(aiResponse, queryType),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate follow-up questions
 */
export function generateFollowUpQuestions(response, queryType) {
  const followUps = {
    math: [
      "Can you explain this step differently?",
      "What if the numbers were different?",
      "Are there other methods to solve this?",
    ],
    code: [
      "How can I optimize this code?",
      "Can you add error handling?",
      "How does this work under the hood?",
    ],
    debug: [
      "Are there similar issues I should watch for?",
      "How can I prevent this in the future?",
      "Are there alternative approaches?",
    ],
    explain: [
      "Can you provide more examples?",
      "How is this applied in practice?",
      "What are the limitations?",
    ],
    question: [
      "Can you elaborate on any point?",
      "Are there other perspectives?",
      "What should I do next?",
    ],
  };

  return followUps[queryType] || followUps.question;
}

/**
 * Detect query type from message content
 */
export function detectQueryType(message) {
  const lowerMessage = message.toLowerCase();

  const mathKeywords = [
    "solve", "calculate", "equation", "formula", "integral",
    "derivative", "differentiate", "integrate", "limit", "sum",
    "product", "factorial", "matrix", "vector", "algebra",
    "geometry", "trigonometry", "calculus", "statistics",
    "probability", "√", "∑", "∫", "∂", "∆", "π", "∞",
    "²", "³", "^", "math", "quadratic", "polynomial",
    "fraction", "percentage", "ratio", "proportion",
  ];

  const codeKeywords = [
    "code", "function", "class", "method", "variable",
    "debug", "error", "syntax", "logic", "algorithm",
    "program", "script", "javascript", "python", "java",
    "cpp", "c++", "html", "css", "react", "node",
    "database", "api", "endpoint", "refactor", "optimize",
    "implement", "create a", "write", "build", "how to",
    "fix", "bug", "issue", "error", "traceback",
    "stack trace", "exception",
  ];

  const explainKeywords = [
    "explain", "what is", "how does", "how to", "why",
    "understand", "concept", "describe", "tell me", "teach",
    "learn", "difference between", "definition", "meaning",
    "clarify", "elaborate",
  ];

  const debugKeywords = [
    "debug", "fix", "broken", "not working", "issue",
    "problem", "error:", "exception", "bug", "crash",
    "fail", "doesn't work", "won't work", "can't", "trouble",
  ];

  if (debugKeywords.some((kw) => lowerMessage.includes(kw))) {
    if (
      codeKeywords.some((kw) => lowerMessage.includes(kw)) ||
      lowerMessage.includes("code") ||
      lowerMessage.includes("error")
    ) {
      return "debug";
    }
  }

  if (mathKeywords.some((kw) => lowerMessage.includes(kw))) return "math";
  if (codeKeywords.some((kw) => lowerMessage.includes(kw))) return "code";
  if (explainKeywords.some((kw) => lowerMessage.includes(kw))) return "explain";

  return "question";
}

export default {
  chat,
  processSpecializedQuery,
  streamChat,
  summarizeConversation,
  detectQueryType,
  cleanResponse,
};