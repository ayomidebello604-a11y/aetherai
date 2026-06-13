// Detect programming language from code
function detectLanguage(code) {
  if (!code) return 'typescript';
  
  const trimmed = code.trim();
  
  // C patterns (check early)
  if (/(^|\n)\s*(#include|int main|printf|void|char|struct)\b/m.test(trimmed) && !/(std::|using namespace)/m.test(trimmed)) {
    return 'c';
  }
  
  // C/C++ patterns (check early - very specific)
  if (/(#include|void|int main|this>>|printf|std::cout|using namespace|Serial.print|std::vector|template <)\b/.test(trimmed)) {
    return 'cpp';
  }
  
  // Go patterns (check early - very specific)
  if (/(^|\n)\s*(package |func |import \(|:=|go )\b/m.test(trimmed) && /\{[\s\S]*\}/.test(trimmed)) {
    return 'go';
  }
  
  // Rust patterns (check early - very specific)
  if (/(^|\n)\s*(fn |let mut |impl |use |pub |fn main|#\[)\b/m.test(trimmed)) {
    return 'rust';
  }
  
  // Kotlin patterns
  if (/(^|\n)\s*(fun |val |var |class |object |interface |data class|companion object)\b/m.test(trimmed) && /(->|\.\.)/m.test(trimmed)) {
    return 'kotlin';
  }
  
  // Swift patterns
  if (/(^|\n)\s*(import|func |let |var |struct |class |enum )\b/m.test(trimmed) && /(\{[\s\S]*\}|-\>)/m.test(trimmed) && !/(public |interface )/m.test(trimmed)) {
    return 'swift';
  }
  
  // Java patterns (check early - look for java-specific imports)
  if (/(^|\n)\s*(public |private |protected |class |interface |import java\.|@Override|@Test)\b/m.test(trimmed)) {
    return 'java';
  }
  
  // C# patterns (check early - very specific)
  if (/(^|\n)\s*(using |namespace |public class |private class |async Task|Console\.WriteLine|[A-Z]\w+\s+\w+\s*\{)\b/m.test(trimmed)) {
    return 'csharp';
  }
  
  // Ruby patterns
  if (/(^|\n)\s*(def |class |require |attr_|puts |print |rescue |begin )\b/m.test(trimmed)) {
    return 'ruby';
  }
  
  // PHP patterns (check early - <?php is definitive)
  if (/(^|\n)\s*(<\?php|<\?|function |class |namespace |\$\w+|->|echo |print )/m.test(trimmed) || /^\s*<\?php/.test(trimmed)) {
    return 'php';
  }
  
  // SQL patterns
  if (/(^|\n)\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|JOIN)\b/im.test(trimmed)) {
    return 'sql';
  }
  
  // HTML patterns
  if (/<(html|head|body|div|p|span|button)\b/i.test(trimmed) || /<!DOCTYPE/i.test(trimmed)) {
    return 'html';
  }
  
  // CSS patterns
  if (/\.[a-zA-Z_-]+\s*\{|#[a-zA-Z_-]+\s*\{|@media|@keyframes/.test(trimmed)) {
    return 'css';
  }
  
  // TypeScript patterns (check before JavaScript since it's more specific)
  if (/\b(interface |type |enum |namespace |: [A-Z]\w+\s*[,\)=;])\b/.test(trimmed) || /:\s*(string|number|boolean|any|unknown|never|Array|Promise)\b/.test(trimmed)) {
    return 'typescript';
  }
  
  // JavaScript patterns (ES6+ - import/export are strong indicators)
  if (/(^|\n)\s*(import |export |const |let |var |function |=>|async |await |console\.)\b/m.test(trimmed)) {
    return 'javascript';
  }
  
  // Python patterns (check AFTER JavaScript to avoid matching 'import')
  if (/(^|\n)\s*(def |from |if __name__|except:|async def|print|input)\b/m.test(trimmed) || /:\s*$|:\s*#/m.test(trimmed)) {
    return 'python';
  }
  
  return 'typescript';
}

function buildPrompt(code, language, instruction) {
  const languageExamples = {
    'python': 'Python (uses def, class, import, indentation)',
    'javascript': 'JavaScript (uses const/let/var, function, =>)',
    'typescript': 'TypeScript (uses interface, type, : Type syntax)',
    'go': 'Go (uses func, package, goroutines)',
    'rust': 'Rust (uses fn, let mut, impl)',
    'java': 'Java (uses public class, interface, import java)',
    'c': 'C (uses #include, int main, void, printf)',
    'cpp': 'C++ (uses #include, std::, void int main)',
    'csharp': 'C# (uses public class, using, namespace)',
    'php': 'PHP (uses <?php, $var, function)',
    'ruby': 'Ruby (uses def, class, puts, require)',
    'kotlin': 'Kotlin (uses fun, val, var, class, data class)',
    'swift': 'Swift (uses func, let, var, struct, class)',
    'sql': 'SQL (uses SELECT, INSERT, UPDATE, DELETE, JOIN)',
    'html': 'HTML (uses <!DOCTYPE, <html>, <body>, etc.)',
    'css': 'CSS (uses selectors, properties, @media, @keyframes)',
  };

  const langDisplay = languageExamples[language] || language;

  return `You are an expert code reviewer and AI assistant.

LANGUAGE REQUIREMENT: You MUST work with code in ${langDisplay} ONLY.
The input code is written in ${language}.
You MUST return the modified code in the EXACT SAME ${language} language.

DO NOT:
- Convert code to TypeScript
- Convert code to JavaScript
- Change the programming language in any way
- Convert to any other language

DO:
- Keep all ${language} specific syntax, conventions, and idioms
- Maintain the original language's style and patterns
- Only improve the code logic, performance, or fix bugs within ${language}

Your task:
1. Modify the code according to this instruction: "${instruction || 'improve and optimize the code'}"
2. Return ONLY a valid JSON object with these exact keys:
   - "modifiedCode": the complete modified ${language} code as a string (escape all newlines as \\n)
   - "explanation": a clear explanation of what you changed and why

IMPORTANT: Return ONLY the JSON object, no markdown, no backticks, no extra text.
Make sure all newlines in the code are escaped as \\n and all quotes are escaped as \\".

Code to modify (${language}):

${code}
`;
}

export async function analyseCode(code, language = '', instruction = '') {
  // Auto-detect language if not provided
  const detectedLang = language || detectLanguage(code);

  try {
    const res = await fetch('/api/coprogrammer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Your route.js reads body.message
        message: buildPrompt(code, detectedLang, instruction),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      const apiError = errorData.error;
      // Return the API error as-is since it's already user-friendly
      throw new Error(apiError || `Code analysis service error (${res.status}). Please try again.`);
    }

    const data = await res.json();

    // data.reply is the raw string from your route.js
    let raw = data.reply;

    // Strip markdown fences if present
    raw = raw
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Find the JSON object - look for { ... }
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error('The analysis service returned an unexpected format. Please try with different code.');
    }

    const jsonStr = raw.substring(jsonStart, jsonEnd + 1);

    // Parse the JSON object
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      throw new Error(`The analysis service is having trouble processing your request. Please try with simpler code.`);
    }

    // Safety check — make sure we got an object with the right keys
    if (!parsed.modifiedCode || !parsed.explanation) {
      throw new Error('The analysis service couldn\'t complete your request. Please try again with different code.');
    }

    return parsed;
  } catch (error) {
    // Check if it's an AbortError from timeout
    if (error.name === 'AbortError') {
      throw new Error('Analysis request took too long. Try with simpler or shorter code.');
    }
    throw error;
  }
}

export async function detectLanguageWithAI(code) {
  if (!code || code.trim().length === 0) {
    return 'typescript';
  }

  try {
    const prompt = `Analyze this code snippet and identify the programming language it's written in.

Code:
${code}

Respond with ONLY a JSON object in this format (no markdown, no extra text):
{"language": "language_name"}

Use one of these language identifiers: python, javascript, typescript, java, c, cpp, csharp, go, rust, php, ruby, kotlin, swift, sql, html, css, or other if you detect something else.
If unsure, make your best guess based on syntax patterns.`;

    const res = await fetch('/api/coprogrammer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
      }),
    });

    if (!res.ok) {
      // Fallback to keyword detection if API fails
      return detectLanguage(code);
    }

    const data = await res.json();
    let raw = data.reply;

    // Strip markdown fences if present
    raw = raw
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Find the JSON object
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      return detectLanguage(code);
    }

    const jsonStr = raw.substring(jsonStart, jsonEnd + 1);

    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.language && typeof parsed.language === 'string') {
        // Normalize language name
        const normalized = parsed.language.toLowerCase().trim();
        const validLanguages = ['python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'kotlin', 'swift', 'sql', 'html', 'css'];
        if (validLanguages.includes(normalized)) {
          return normalized;
        }
        return normalized; // Return the AI's best guess even if not in our predefined list
      }
    } catch (parseError) {
      return detectLanguage(code);
    }

    return detectLanguage(code);
  } catch (error) {
    // Fallback to keyword detection on any error
    return detectLanguage(code);
  }
}

export { detectLanguage };

