import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================================
// SYSTEM PROMPT — ChatGPT + Claude style, rich & structured
// ============================================================

const SYSTEM_PROMPT = `You are Aether AI, an advanced research, mathematics, and programming assistant. You are highly intelligent, precise, and educational.You are built by Bello Samad.

CORE BEHAVIOR:
- Always use rich markdown formatting in your responses.
- Use ## headings, ### subheadings, **bold**, *italic*, bullet lists, numbered lists, tables, and code blocks appropriately.
- Never give flat, unformatted walls of text.
- Be thorough but not verbose — every sentence should add value.
- Speak in a professional, warm, and educational tone.
-Speak ina friendly,local and harsh word depending on the request.

---

MATHEMATICS:
- Always solve step-by-step. Never skip a step.
- Show the formula before substituting values.
- Explain every transformation in plain English.
- Use proper math symbols: ×, ÷, √, π, ∑, ∫, ≤, ≥, ≠, ², ³
- Use LaTeX inside dollar signs for inline math: $E = mc^2$
- Use double dollar signs for display math: $$\\int_0^\\infty e^{-x} dx = 1$$
- Always present the final answer clearly at the end: **Answer: 42**
- Verify the answer when possible.

Math Response Format:
## Problem
[Restate the problem clearly]

## Given
[List all known values]

## Formula
[State the formula(s) used]

## Solution
[Step-by-step working]

## Answer
**[Final answer, clearly stated]**

---

CODING:
- Always provide complete, working, production-ready code.
- Wrap all code in fenced code blocks with the correct language tag.
- Add brief but meaningful inline comments.
- After the code, explain how it works in a short paragraph.
- Mention time/space complexity when relevant.
- Suggest improvements or edge cases to consider.

---

RESEARCH & GENERAL QUESTIONS:
- Provide factual, well-structured answers.
- Use headings and bullet points for clarity.
- Distinguish facts from opinions.
- If you are uncertain, say so explicitly.

Research Response Format:
## Summary
[2-3 sentence executive summary]

## Key Findings
- Finding 1
- Finding 2

## Detailed Analysis
[In-depth explanation]

## Conclusion
[Wrap up with actionable insight or takeaway]

---

EXPLANATIONS:
- Break complex ideas into simple, digestible parts.
- Use real-world analogies.
- Provide examples wherever helpful.
- Keep it educational and engaging.

---

ABSOLUTE RULES:
- Never fabricate facts or sources.
- Never give a one-liner for a complex question.
- Always format your response — headings, bullets, code blocks, math notation.
- If a question has multiple parts, address each part with its own heading.`;

// ============================================================
// SPECIALIZED PROMPTS
// ============================================================

const SPECIALIZED_PROMPTS = {
  math: SYSTEM_PROMPT,
  code: SYSTEM_PROMPT,
  debug: SYSTEM_PROMPT,
  explain: SYSTEM_PROMPT,
  question: SYSTEM_PROMPT,
};

// ============================================================
// MODEL FACTORY
// ============================================================

function createModel(systemPrompt) {
  console.log("\n========== GEMINI DEBUG ==========");
  console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Research service configuration is missing. Please contact support.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  return genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    systemInstruction: systemPrompt,
    requestOptions: {
      timeout: 30000,
    },
  });
}

// ============================================================
// CORE CHAT FUNCTION
// ============================================================

export async function chat(userMessage, conversationHistory = [], queryType = null) {
  try {
    if (!userMessage || typeof userMessage !== "string") {
      return {
        success: false,
        error: "Your message format isn't valid. Please send plain text.",
        message: "Please provide a valid message.",
      };
    }

    const detectedType = queryType || detectQueryType(userMessage);
    const systemPrompt = SPECIALIZED_PROMPTS[detectedType] || SYSTEM_PROMPT;
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
        temperature: detectedType === "math" ? 0.2 : 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    // DO NOT strip markdown — let the frontend render it
    const reply = response.response.text();

    return {
      success: true,
      reply,
      timestamp: new Date().toISOString(),
      model: "gemini-3.5-flash",
      queryType: detectedType,
    };
  } catch (error) {
    console.error("\n========== GEMINI ERROR ==========");
    console.error("MESSAGE:", error?.message);
    console.error("STACK:", error?.stack);
    console.error("CAUSE:", error?.cause);

    let userError = "I encountered an issue processing your question. Please try again.";
    if (error?.message?.includes("timeout")) {
      userError = "Your request took too long. Try asking a shorter or simpler question.";
    } else if (error?.message?.includes("rate")) {
      userError = "You're asking questions too quickly. Please wait a moment and try again.";
    } else if (error?.message?.includes("Invalid")) {
      userError = "Your question format wasn't recognized. Please try rewording it.";
    } else if (error?.message?.includes("API")) {
      userError = "We're experiencing service issues. Please try again shortly.";
    }

    return {
      success: false,
      error: userError,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================
// STREAMING CHAT
// ============================================================

export async function streamChat(message, onChunk) {
  try {
    const detectedType = detectQueryType(message);
    const systemPrompt = SPECIALIZED_PROMPTS[detectedType] || SYSTEM_PROMPT;
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
    let userError = "I couldn't process your streaming request. Please try again.";
    if (error.message?.includes("timeout")) {
      userError = "Your request took too long to stream. Try a shorter question.";
    } else if (error.message?.includes("network")) {
      userError = "Network connection issue. Check your internet and try again.";
    }
    return { success: false, error: userError };
  }
}

// ============================================================
// SPECIALIZED QUERY HANDLER
// ============================================================

export async function processSpecializedQuery(queryType, message, conversationHistory = []) {
  return chat(message, conversationHistory, queryType);
}

// ============================================================
// CONVERSATION SUMMARY
// ============================================================

export async function summarizeConversation(messages) {
  try {
    const conversationText = messages
      .map((msg) => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
      .join("\n\n");

    const summaryPrompt = `Summarize this conversation. Include:
1. Main topics discussed
2. Key points and answers
3. Problems solved
4. Context for future reference

Conversation:
${conversationText}`;

    const response = await chat(summaryPrompt);
    return response.reply || "Unable to generate summary";
  } catch (error) {
    console.error("Summary Error:", error);
    return "Error generating summary";
  }
}

// ============================================================
// METADATA & QUALITY HELPERS
// ============================================================

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

// ============================================================
// QUERY TYPE DETECTOR
// ============================================================

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
    "syntax", "algorithm", "program", "script",
    "javascript", "python", "java", "cpp", "c++", "html",
    "css", "react", "node", "database", "api", "endpoint",
    "refactor", "optimize", "implement", "build",
  ];

  const debugKeywords = [
    "debug", "fix", "broken", "not working", "issue",
    "problem", "error:", "exception", "bug", "crash",
    "fail", "doesn't work", "won't work", "can't", "trouble",
  ];

  const explainKeywords = [
    "explain", "what is", "how does", "why", "understand",
    "concept", "describe", "tell me", "teach", "learn",
    "difference between", "definition", "meaning", "clarify",
  ];

  if (
    debugKeywords.some((kw) => lowerMessage.includes(kw)) &&
    (codeKeywords.some((kw) => lowerMessage.includes(kw)) ||
      lowerMessage.includes("error"))
  ) {
    return "debug";
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
  getResponseMetadata,
  validateResponseQuality,
  generateFollowUpQuestions,
};