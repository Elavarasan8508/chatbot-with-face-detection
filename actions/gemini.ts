import  { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyD5LnBGm3GuVzX7Q2Ru97rkalFHPljDOxo");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export const generateGeminiResponse = async (prompt,history,emotion,pred) => {


const template = `you are a mental health assistant . feel free to ask follow up questions .
chatHistory: ${JSON.stringify(history)} .
prompt:${prompt}.
respond in md format.
my emotion now is ${emotion}.
.use natural language and use the details to best assist the user's mental health to happy
`

    

const result = await model.generateContent(template);

console.log(result.response.text());

return result.response.text();

}

