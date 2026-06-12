import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Structured output schema:
// The model decides the "type" of content it is producing and fills the
// matching field. This lets the UI render plain text, markdown, or code
// (with language) differently and correctly, regardless of what the user asks for.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: ["text", "markdown", "code"],
      description:
        "text = short plain-language answer, markdown = formatted answer using markdown (headings, lists, bold, etc), code = the answer is primarily a code snippet/program.",
    },
    content: {
      type: Type.STRING,
      description:
        "The main response content. For type=markdown use markdown syntax. For type=code, put ONLY the code here (no markdown fences).",
    },
    language: {
      type: Type.STRING,
      description:
        "Programming language of the code, only set when type=code (e.g. 'javascript', 'python').",
    },
    explanation: {
      type: Type.STRING,
      description:
        "Optional short explanation/markdown text accompanying a code answer. Only used when type=code.",
    },
  },
  required: ["type", "content"],
};

async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof text !== "string" || !text.trim()) {
      return { type: "text", content: " " };
    }

    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.content === "string") {
        return parsed;
      }
    } catch (parseError) {
      console.error("Gemini structured output parse error:", parseError);
    }

    // Fallback: treat raw text as plain text response
    return { type: "text", content: text.trim() };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { type: "text", content: "Something went wrong. Please try again." };
  }
}

export default main;
