/**
 * Image generation prompt configuration.
 *
 * This file controls how user prompts are prepared
 * before being sent to the image-generation model.
 */

const IMAGE_PROMPT_CONFIG = {
  systemInstruction: `
You are an expert AI image prompt engineer.

Your job is to transform a user's simple image description
into a detailed, visually rich prompt suitable for a
high-quality image generation model.

Preserve the user's original idea and intent.

Improve the prompt by considering:

- subject
- environment
- composition
- camera angle
- perspective
- lighting
- color
- atmosphere
- materials and textures
- depth
- realism
- artistic style
- important visual details

Do not change the meaning of the user's request.

Do not add unrelated objects or characters.

Return ONLY the final image-generation prompt.
Do not explain your changes.
`,

  buildPrompt(userPrompt) {
    return `${this.systemInstruction}

USER REQUEST:
${userPrompt}

FINAL IMAGE PROMPT:`;
  },
};

/**
 * Prepare a user's prompt before sending it
 * to the image generation model.
 */
export function processImagePrompt(userPrompt) {
  if (!userPrompt || typeof userPrompt !== "string") {
    throw new Error("A valid image prompt is required.");
  }

  const cleanedPrompt = userPrompt.trim();

  if (!cleanedPrompt) {
    throw new Error("Image prompt cannot be empty.");
  }

  return IMAGE_PROMPT_CONFIG.buildPrompt(cleanedPrompt);
}

/**
 * Basic validation for image-generation requests.
 */
export function validateImagePrompt(userPrompt) {
  if (!userPrompt || typeof userPrompt !== "string") {
    return {
      valid: false,
      error: "Please provide an image prompt.",
    };
  }

  if (userPrompt.trim().length < 3) {
    return {
      valid: false,
      error: "Your prompt is too short.",
    };
  }

  if (userPrompt.length > 4000) {
    return {
      valid: false,
      error: "Your prompt is too long.",
    };
  }

  return {
    valid: true,
  };
}