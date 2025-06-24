import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Use environment variable instead of hardcoded API key (optional but safer)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ✅ Fixes the 'any' type errors by explicitly typing all parameters
export const generateGeminiResponse = async (
  prompt: string,
  history: any[],
  emotion: string,
  pred: string
): Promise<string> => {
  const template = `you are a mental health assistant. Feel free to ask follow-up questions.
chatHistory: ${JSON.stringify(history)}.
prompt: ${prompt}.
respond in md format.
my emotion now is ${emotion}.
Use natural language and use the details to best assist the user's mental health to happy`;

  const result = await model.generateContent(template);

  console.log(result.response.text());

  return result.response.text();
};
