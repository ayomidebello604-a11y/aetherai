import OpenAI from "openai";

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
    // Initialize client for each request with fresh API key
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "Our code analysis service isn't available right now. Please come back in a few moments." },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      return Response.json(
        { error: "We couldn't process your request. Please make sure your code and instructions are valid." },
        { status: 400 }
      );
    }

    // Validate that message exists
    if (!body.message) {
      return Response.json(
        { error: "No code provided for analysis. Please paste some code and try again." },
        { status: 400 }
      );
    }

    // Check input size to prevent overwhelming the API
    if (body.message && body.message.length > 50000) {
      return Response.json(
        {
          error: "Your code snippet is too large for analysis. Please share a smaller section (under 50,000 characters) and I'll analyze it for you.",
        },
        {
          status: 400,
        }
      );
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer and AI assistant specializing in code analysis. You analyze code for correctness, performance, security, and best practices. Always return responses in valid JSON format when requested. Be precise and concise.",
        },
        {
          role: "user",
          content: body.message,
        },
      ],

      temperature: 0.7,
      max_tokens: 4096,
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    // More specific error messaging
    let errorMessage = "I'm having trouble analyzing your code right now. Please try again in a moment.";
    if (error.message?.includes("timeout")) {
      errorMessage = "Your analysis request took too long to process. Try breaking your code into smaller pieces or simplifying the instructions.";
    } else if (error.message?.includes("token")) {
      errorMessage = "Your code and instructions are too large to process together. Try with a smaller code snippet or shorter instructions.";
    } else if (error.message?.includes("401") || error.message?.includes("unauthorized")) {
      errorMessage = "Our analysis service is temporarily unavailable. Please try again shortly.";
    } else if (error.message?.includes("network")) {
      errorMessage = "We're experiencing network issues. Check your connection and try again.";
    }

    return Response.json(
      {
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}