/**
 * Image generation prompt configuration.
 *
 * Controls how user prompts are prepared, structured, validated,
 * and refined before being sent to an image-generation model.
 */

// ---------------------------------------------------------------------------
// Style presets — bias the rewrite toward a visual language without the
// caller having to hand-write style language every time.
// ---------------------------------------------------------------------------

const STYLE_PRESETS = {
  photographic: "photorealistic, shot on a full-frame camera, natural optical detail, realistic light falloff",
  cinematic: "cinematic still, anamorphic lens characteristics, dramatic color grading, film grain",
  illustration: "digital illustration, clean linework, intentional color palette, editorial style",
  "3d_render": "3D render, physically based rendering, studio lighting, subsurface scattering where relevant",
  anime: "anime-influenced illustration, cel shading, expressive linework",
  painterly: "painterly, visible brushwork, traditional-media texture",
  none: "",
};

// ---------------------------------------------------------------------------
// Core system instruction
// ---------------------------------------------------------------------------

const SYSTEM_INSTRUCTION = `
You are an expert AI image prompt engineer.

Your job is to transform a user's simple image description into a
detailed, visually rich prompt suitable for a high-quality image
generation model.

Hard rules:
- Preserve the user's original subject and intent exactly. Never change
  who or what the image is of.
- Do not add unrelated objects, characters, text, or logos.
- Do not invent named real people, brands, or copyrighted characters
  unless the user explicitly named them.
- Do not editorialize, hedge, or explain your reasoning.

When enriching the prompt, consider (only where it adds real value):
- subject and pose/action
- environment and setting
- composition and framing
- camera angle and perspective
- lighting and time of day
- color palette and mood
- materials, textures, and surface detail
- depth of field and focus
- level of realism
- artistic/technical style

Output format:
Return a single JSON object, with no markdown fences and no commentary,
matching exactly this shape:

{
  "prompt": "<the final, comma-or-clause-separated positive prompt>",
  "negative_prompt": "<comma-separated terms to avoid: artifacts, distortions, anything that would break the user's intent>"
}

Return ONLY that JSON object.
`;

const REFINE_INSTRUCTION = `
You are refining a previously generated image prompt based on new user
feedback.

Hard rules:
- Keep everything from the previous prompt that the user did not ask
  to change.
- Apply only the requested change(s).
- Do not reintroduce elements the user previously asked to remove.
- Do not add unrelated objects, characters, text, or logos.

Output format is the same JSON object as before:
{
  "prompt": "<the updated positive prompt>",
  "negative_prompt": "<updated negative prompt>"
}

Return ONLY that JSON object.
`;

// ---------------------------------------------------------------------------
// Lightweight pre-filter. This is NOT a substitute for real moderation —
// wire moderationCheck into your actual trust & safety / moderation API
// before generation. This just catches obvious cases cheaply and early.
// ---------------------------------------------------------------------------

const BLOCKED_TERMS = [
  // Deliberately left for the caller to populate/extend with their
  // platform's actual policy list, and/or replace with a real
  // moderation API call via `moderationCheck`.
];

async function defaultModerationCheck(text) {
  const lower = text.toLowerCase();
  const hit = BLOCKED_TERMS.find((term) => lower.includes(term));
  return hit ? { flagged: true, reason: `Blocked term: ${hit}` } : { flagged: false };
}

// ---------------------------------------------------------------------------
// Config object
// ---------------------------------------------------------------------------

const IMAGE_PROMPT_CONFIG = {
  systemInstruction: SYSTEM_INSTRUCTION,
  refineInstruction: REFINE_INSTRUCTION,
  stylePresets: STYLE_PRESETS,
  minLength: 3,
  maxLength: 4000,
  moderationCheck: defaultModerationCheck,

  /**
   * Build the full prompt sent to the rewriting model for a fresh request.
   * @param {string} userPrompt
   * @param {{ style?: keyof typeof STYLE_PRESETS, aspectRatio?: string }} [options]
   */
  buildPrompt(userPrompt, options = {}) {
    const { style = "none", aspectRatio } = options;
    const styleHint = STYLE_PRESETS[style] ?? "";

    const constraints = [
      styleHint ? `Preferred style bias: ${styleHint}.` : null,
      aspectRatio ? `Target aspect ratio: ${aspectRatio}.` : null,
    ]
      .filter(Boolean)
      .join("\n");

    return `${this.systemInstruction}
${constraints ? `\nADDITIONAL CONSTRAINTS:\n${constraints}\n` : ""}
USER REQUEST:
${userPrompt}

FINAL IMAGE PROMPT (JSON only):`;
  },

  /**
   * Build a refinement prompt from a prior generated prompt + new instruction.
   * @param {string} previousPrompt
   * @param {string} editInstruction
   */
  buildRefinePrompt(previousPrompt, editInstruction) {
    return `${this.refineInstruction}

PREVIOUS PROMPT:
${previousPrompt}

REQUESTED CHANGE:
${editInstruction}

UPDATED IMAGE PROMPT (JSON only):`;
  },
};

// ---------------------------------------------------------------------------
// Sanitization helpers
// ---------------------------------------------------------------------------

function stripControlChars(str) {
  return str.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}

/**
 * Parse a model's raw text response into { prompt, negative_prompt }.
 * Tolerates stray markdown fences or quoting the model may add despite
 * instructions.
 */
function parseModelOutput(raw) {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      prompt: typeof parsed.prompt === "string" ? parsed.prompt.trim() : "",
      negativePrompt:
        typeof parsed.negative_prompt === "string" ? parsed.negative_prompt.trim() : "",
    };
  } catch {
    // Model didn't return valid JSON — fall back to treating the whole
    // cleaned response as the positive prompt so the pipeline doesn't hard-fail.
    return { prompt: cleaned, negativePrompt: "" };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validate a raw user prompt before doing anything else with it.
 * @param {string} userPrompt
 */
function validateImagePrompt(userPrompt) {
  if (!userPrompt || typeof userPrompt !== "string") {
    return { valid: false, error: "Please provide an image prompt." };
  }

  const trimmed = stripControlChars(userPrompt).trim();

  if (trimmed.length < IMAGE_PROMPT_CONFIG.minLength) {
    return { valid: false, error: "Your prompt is too short." };
  }

  if (trimmed.length > IMAGE_PROMPT_CONFIG.maxLength) {
    return { valid: false, error: "Your prompt is too long." };
  }

  return { valid: true, cleanedPrompt: trimmed };
}

/**
 * Prepare a user's prompt before sending it to the rewriting model.
 * Runs validation and (optionally) moderation, then builds the
 * full instruction text to send.
 *
 * @param {string} userPrompt
 * @param {{ style?: string, aspectRatio?: string, skipModeration?: boolean }} [options]
 */
async function processImagePrompt(userPrompt, options = {}) {
  const validation = validateImagePrompt(userPrompt);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  if (!options.skipModeration) {
    const modResult = await IMAGE_PROMPT_CONFIG.moderationCheck(validation.cleanedPrompt);
    if (modResult.flagged) {
      throw new Error(`Prompt rejected by moderation: ${modResult.reason}`);
    }
  }

  return IMAGE_PROMPT_CONFIG.buildPrompt(validation.cleanedPrompt, options);
}

/**
 * Build a refinement request from a previous prompt and a new instruction.
 * @param {string} previousPrompt
 * @param {string} editInstruction
 */
async function processRefinePrompt(previousPrompt, editInstruction) {
  const validation = validateImagePrompt(editInstruction);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  if (!previousPrompt || typeof previousPrompt !== "string" || !previousPrompt.trim()) {
    throw new Error("A previous prompt is required to refine.");
  }

  return IMAGE_PROMPT_CONFIG.buildRefinePrompt(previousPrompt.trim(), validation.cleanedPrompt);
}

export {
  IMAGE_PROMPT_CONFIG,
  STYLE_PRESETS,
  processImagePrompt,
  processRefinePrompt,
  validateImagePrompt,
  parseModelOutput,
};