# Chat Library Documentation

## Overview

The Chat Library is a comprehensive AI assistant system built on Google's Gemini API that handles any type of query with exceptional detail and expertise. It intelligently detects query types and provides specialized responses optimized for the specific request.

## Features

### 1. **Query Type Detection**
The library automatically identifies query types to provide specialized handling:
- **Math**: Mathematical problems, equations, calculus
- **Code**: Programming assistance, implementations
- **Debug**: Bug fixing, error analysis
- **Explain**: Concept explanations, learning
- **Question**: General questions and answers

### 2. **Specialized Responses**
Each query type receives tailored system prompts with specific instructions:
- **Math**: Shows step-by-step workings, verifies answers
- **Code**: Provides clean, commented code with explanations
- **Debug**: Identifies root causes and provides fixes
- **Explain**: Breaks down concepts with examples
- **Question**: Provides thorough, contextualized answers

### 3. **Response Enhancement**
Additional utilities for response quality and engagement:
- Response metadata analysis
- Quality validation
- Follow-up question generation
- Conversation summarization

## Core Functions

### `chat(userMessage, conversationHistory, queryType)`
Main function for processing user messages.

**Parameters:**
- `userMessage` (string): The user's input message
- `conversationHistory` (array): Previous messages for context
- `queryType` (string, optional): Force a specific query type

**Returns:**
```javascript
{
  success: boolean,
  reply: string,
  timestamp: string,
  model: string,
  queryType: string
}
```

**Example:**
```javascript
const response = await chat(
  "Solve 2x + 5 = 13",
  [],
  "math"
);
// Returns detailed step-by-step solution
```

### `detectQueryType(message)`
Analyzes a message to determine its type.

**Parameters:**
- `message` (string): The message to analyze

**Returns:** string (query type)

**Example:**
```javascript
const type = detectQueryType("How does photosynthesis work?");
// Returns "explain"
```

### `processSpecializedQuery(queryType, message, conversationHistory)`
Explicitly process a query with a specific handler.

**Parameters:**
- `queryType` (string): Type of query
- `message` (string): The actual question
- `conversationHistory` (array): Previous messages

**Returns:** Promise with response object

**Example:**
```javascript
const response = await processSpecializedQuery(
  "code",
  "Create a React component for a button",
  []
);
```

### `getResponseMetadata(userMessage, aiResponse)`
Generates detailed metadata about the interaction.

**Returns:**
```javascript
{
  queryType: string,
  messageLength: number,
  responseLength: number,
  hasCodeBlock: boolean,
  hasMathNotation: boolean,
  hasFormattedLists: boolean,
  hasHeadings: boolean,
  complexity: string,
  timestamp: string
}
```

### `validateResponseQuality(response, queryType)`
Assesses if a response is comprehensive enough.

**Returns:**
```javascript
{
  isComprehensive: boolean,
  checks: {
    lengthOk: boolean,
    formattingOk: boolean,
    hasExplanation: boolean
  },
  recommendations: array
}
```

### `generateFollowUpQuestions(response, queryType)`
Creates relevant follow-up questions for engagement.

**Returns:** Array of suggested questions

**Example:**
```javascript
const questions = generateFollowUpQuestions(response, "math");
// Returns array like:
// ["Can you explain this step differently?", "What if the numbers were different?", ...]
```

### `summarizeConversation(messages)`
Creates a comprehensive summary of a conversation.

**Parameters:**
- `messages` (array): Array of conversation messages

**Returns:** Promise resolving to summary string

### `streamChat(message, onChunk)`
Streams responses in real-time for progressive display.

**Parameters:**
- `message` (string): User message
- `onChunk` (function): Callback for each text chunk

**Returns:** Promise with success status

**Example:**
```javascript
await streamChat(
  "Explain quantum computing",
  (chunk) => {
    console.log("Received:", chunk);
  }
);
```

## API Route Implementation

The chat API route (`/api/chat`) provides a REST endpoint with enhanced response metadata:

**Request:**
```javascript
POST /api/chat
{
  "message": "Your question here",
  "conversationHistory": [
    { "sender": "user", "text": "..." },
    { "sender": "ai", "text": "..." }
  ]
}
```

**Response:**
```javascript
{
  "success": true,
  "reply": "Detailed response...",
  "queryType": "math",
  "metadata": {
    "responseLength": 1234,
    "hasCodeBlock": false,
    "complexity": "high"
  },
  "quality": {
    "isComprehensive": true,
    "checks": { ... },
    "recommendations": []
  },
  "followUpQuestions": [
    "Question 1?",
    "Question 2?"
  ],
  "timestamp": "2024-05-28T10:30:00Z",
  "model": "gemini-2.5-flash"
}
```

## Usage in React Components

### ResearcherPage Integration

```javascript
async function handleSendMessage() {
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
}
```

### ChatMessages Display

The ChatMessages component handles:
- Code syntax highlighting
- Markdown formatting (bold, lists, headings)
- Follow-up question suggestions
- Query type indicators
- Loading states

## Query Type Keywords

### Math Keywords
`solve, calculate, equation, formula, integral, derivative, differentiate, integrate, limit, sum, matrix, algebra, geometry, trigonometry, calculus, √, ∑, ∫, etc.`

### Code Keywords
`code, function, class, method, variable, debug, error, syntax, algorithm, program, python, javascript, implement, write, build, fix, etc.`

### Debug Keywords
`debug, fix, broken, not working, issue, problem, error, exception, bug, crash, etc.`

### Explain Keywords
`explain, what is, how does, why, understand, concept, describe, teach, learn, definition, etc.`

## System Prompts

Each query type uses a specialized system prompt designed for maximum effectiveness:

- **General SYSTEM_PROMPT**: Establishes core capabilities and response guidelines
- **SPECIALIZED_PROMPTS**: Tailored instructions for each query type

All prompts emphasize:
- Comprehensiveness and detail
- Clear explanations and reasoning
- Appropriate formatting
- Handling of edge cases
- Real-world examples where applicable

## Error Handling

The library includes robust error handling:

```javascript
try {
  const response = await chat(userMessage);
  if (!response.success) {
    // Handle error
    console.error(response.error);
  }
} catch (error) {
  console.error("Unexpected error:", error);
}
```

## Performance Considerations

- **Temperature**: 0.7 (balanced creativity and consistency)
- **Top P**: 0.9 (diverse but focused sampling)
- **Max Tokens**: 4096 (comprehensive responses)
- **Model**: Gemini 2.5 Flash (fast and capable)

## Environment Variables

Required:
```
GEMINI_API_KEY=your_api_key_here
```

## Best Practices

1. **Always include conversation history** for context-aware responses
2. **Use the API route** for production to handle validation and metadata
3. **Handle errors gracefully** with user-friendly messages
4. **Cache summaries** for frequently asked questions
5. **Use follow-up questions** to enhance user engagement
6. **Validate response quality** before displaying to users

## Extending the Library

### Adding New Query Types

1. Add keywords to `detectQueryType()`:
```javascript
const newKeywords = ["keyword1", "keyword2"];
```

2. Add specialized prompt to `SPECIALIZED_PROMPTS`:
```javascript
const SPECIALIZED_PROMPTS = {
  newType: `${SYSTEM_PROMPT}\n\nSPECIAL INSTRUCTIONS...`
};
```

3. Add follow-up questions in `generateFollowUpQuestions()`:
```javascript
const followUps = {
  newType: ["Question 1?", "Question 2?"]
};
```

## Troubleshooting

### Empty or Incomplete Responses
- Check API key validity
- Verify network connectivity
- Ensure message format is correct
- Check API rate limits

### Incorrect Query Type Detection
- Add more specific keywords
- Combine keywords for precision
- Consider message context

### Performance Issues
- Reduce conversation history size
- Use streaming for long responses
- Implement caching for summaries

## Version History

- **v1.0**: Initial release with basic chat functionality
- **v2.0**: Added query type detection and specialized prompts
- **v2.1**: Added response metadata and quality validation
- **v2.2**: Added follow-up question generation and streaming support
