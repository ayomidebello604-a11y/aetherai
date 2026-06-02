export async function GET(req) {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  });
}

export async function POST(req) {
  return Response.json({
    status: 'ok',
    received: await req.json(),
  });
}
