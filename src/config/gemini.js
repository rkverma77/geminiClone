import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: API_KEY, // hardcoded for now
});

async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Sanitize and return safe string
    if (typeof text === "string") {
      return text.trim() || " ";
    } else {
      return " ";
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return " ";
  }
}

export default main;
