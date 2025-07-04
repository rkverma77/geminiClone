import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return typeof text === "string" ? text.trim() || " " : " ";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return " ";
  }
}

export default main;
