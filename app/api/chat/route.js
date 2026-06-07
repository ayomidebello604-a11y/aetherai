import {
  chat,
  detectQueryType,
  getResponseMetadata,
  validateResponseQuality,
  generateFollowUpQuestions,
} from "@/app/lib/chatLibrary";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Forwarded-Host, Accept-Language, Content-Language, Content-Type, Authorization',
    },
  })
}

export async function POST(req) {
  try {
    // Validate environment variables
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return Response.json(
        { success: false, error: "We're having trouble connecting to our research service. This is a temporary issue on our end. Please try again in a moment." },
        { status: 500 }
      );
    }

    const { message, conversationHistory } = await req.json();

    // Validate input
    if (!message || typeof message !== "string") {
      return Response.json(
        { success: false, error: "Your message format isn't recognized. Please make sure you're sending plain text." },
        { status: 400 }
      );
    }
      
    if (message.trim().length === 0) {
      return Response.json(
        { success: false, error: "It looks like you sent an empty message. Type something and give it another shot!" },
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
          error: response.error || "I encountered a problem while thinking about your question. Please rephrase it or try again.",
          timestamp: response.timestamp,
        },
        { status: 500 }
      );
    }


    try {
      const metadata = getResponseMetadata(message, response.reply);
      const quality = validateResponseQuality(response.reply, queryType);
      const followUpQuestions = generateFollowUpQuestions(response.reply, queryType);

      return Response.json(
        {
          success: true,
          reply: response.reply,
          sources: response.sources || [],   // grounding sources from Google Search
          queryType,
          metadata,
          quality,
          followUpQuestions,
          timestamp: response.timestamp,
          model: response.model,
        },
        { status: 200 }
      );
    } catch (processingError) {
      console.error("Error processing response metadata:", processingError);
      // Fallback if metadata processing fails
      return Response.json(
        {
          success: true,
          reply: response.reply,
          sources: response.sources || [],
          queryType,
          timestamp: response.timestamp,
          model: response.model,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    let userError = "Something went wrong on our end. We're investigating the issue. Please try again shortly.";
    if (error.message?.includes("timeout")) {
      userError = "Your request took too long to process. Try asking a more concise question.";
    } else if (error.message?.includes("rate")) {
      userError = "You're asking questions a bit too fast. Please wait a moment and try again.";
    } else if (error.message?.includes("network")) {
      userError = "We're having network issues. Please check your connection and try again.";
    }
    return Response.json(
      {
        success: false,
        error: userError,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
