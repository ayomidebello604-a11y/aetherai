import OpenAI from "openai";

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
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Check input size to prevent overwhelming the API
    if (body.message && body.message.length > 50000) {
      return Response.json(
        {
          error: "Code is too long. Please keep it under 50,000 characters.",
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
    let errorMessage = "Something went wrong";
    if (error.message?.includes("timeout")) {
      errorMessage = "Request timed out. Try with shorter code.";
    } else if (error.message?.includes("token")) {
      errorMessage = "Code or response too large. Try with shorter code.";
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