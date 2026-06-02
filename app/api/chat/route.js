import {
  chat,
  detectQueryType,
  getResponseMetadata,
  validateResponseQuality,
  generateFollowUpQuestions,
} from "@/app/lib/chatLibrary";

export async function POST(req) {
  try {
    // Validate environment variables
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return Response.json(
        { success: false, error: "API key is not configured" },
        { status: 500 }
      );
    }

    const { message, conversationHistory } = await req.json();

    // Validate input
    if (!message || typeof message !== "string") {
      return Response.json(
        { success: false, error: "Invalid message format" },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
      return Response.json(
        { success: false, error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Detect query type
    const queryType = detectQueryType(message);

    // Process the message through the chat library
    const response = await chat(message, conversationHistory || []);

    if (!response.success) {
      console.error("Chat library error:", response.error);
      return Response.json(
        {
          success: false,
          error: response.error || "Failed to process message",
          timestamp: response.timestamp,
        },
        { status: 500 }
      );
    }

    try {
      // Get response metadata and quality assessment
      const metadata = getResponseMetadata(message, response.reply);
      const quality = validateResponseQuality(response.reply, queryType);
      const followUpQuestions = generateFollowUpQuestions(response.reply, queryType);

      // Return the comprehensive response
      return Response.json(
        {
          success: response.success,
          reply: response.reply,
          queryType: queryType,
          metadata: metadata,
          quality: quality,
          followUpQuestions: followUpQuestions,
          timestamp: response.timestamp,
          model: response.model,
        },
        { status: 200 }
      );
    } catch (processingError) {
      console.error("Error processing response metadata:", processingError);
      // Fallback response if metadata processing fails
      return Response.json(
        {
          success: response.success,
          reply: response.reply,
          queryType: queryType,
          timestamp: response.timestamp,
          model: response.model,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Chat API Error:", error);

    return Response.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}