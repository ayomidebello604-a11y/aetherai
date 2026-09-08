import { NextResponse } from "next/server";
import {
  processImagePrompt,
  validateImagePrompt,
} from "@/app/lib/imagePrompt";

const MODEL = "@cf/black-forest-labs/flux-2-klein-9b";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      prompt,
      width = 1024,
      height = 1024,
    } = body;

    // ----------------------------------------
    // 1. Validate the user's prompt
    // ----------------------------------------

    const validation = validateImagePrompt(prompt);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // ----------------------------------------
    // 2. Get Cloudflare credentials
    // ----------------------------------------

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      console.error("Cloudflare credentials are missing.");

      return NextResponse.json(
        {
          success: false,
          error: "Image generation service is not configured.",
        },
        { status: 500 }
      );
    }

    // ----------------------------------------
    // 3. Process the user's prompt
    // ----------------------------------------

    const processedPrompt = await processImagePrompt(prompt);

    // ----------------------------------------
    // 4. Create Cloudflare request
    // ----------------------------------------

    const formData = new FormData();

    formData.append("prompt", processedPrompt);
    formData.append("width", String(width));
    formData.append("height", String(height));

    // ----------------------------------------
    // 5. Call FLUX.2 Klein 9B
    // ----------------------------------------

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiToken}`,
        },

        body: formData,
      }
    );

    const result = await response.json();

    // ----------------------------------------
    // 6. Handle Cloudflare errors
    // ----------------------------------------

    if (!response.ok) {
      console.error("Cloudflare error:", result);

      return NextResponse.json(
        {
          success: false,
          error: "Image generation failed.",
          details: result,
        },
        { status: response.status }
      );
    }

    // ----------------------------------------               
    // 7. Make sure an image was returned               
    // ----------------------------------------       

    const image = result?.result?.image;

    if (!image) {
      console.error("No image returned:", result);

      return NextResponse.json(
        {
          success: false,
          error: "The image model did not return an image.",
        },
        { status: 500 }
      );
    }

    // ----------------------------------------
    // 8. Return the image to the frontend
    // ----------------------------------------

    return NextResponse.json({
      success: true,
      image,
      prompt: prompt,
      processedPrompt,
      model: MODEL,
    });
  } catch (error) {
    console.error("Image generation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while generating the image.",
      },
      { status: 500 }
    );
  }                                 
}                                    