import { GoogleGenerativeAI } from "@google/generative-ai";
import { Task, AiCategorizationResponse, Quadrant } from '../types';
import { QUADRANT_DEFINITIONS, GEMINI_MODEL_NAME } from '../constants';

const getAiClient = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

const parseJsonFromText = <T>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Gagal mem-parse respons JSON:", e, "Teks asli:", text);
    throw new Error(`Gagal mem-parse respons JSON dari AI. Teks mentah: ${text.substring(0,100)}...`);
  }
};

export const categorizeTaskWithAI = async (
  description: string,
  apiKey: string
): Promise<AiCategorizationResponse> => {
  const ai = getAiClient(apiKey);
  const prompt = `You are an expert productivity assistant applying the Eisenhower Matrix. A user has a new task: "${description}".

Please categorize this task and provide a concise recommendation.
IMPORTANT: Analyze the language of the task description ("${description}"). The 'recommendation' field in your JSON response MUST be in the SAME language as the task description. For example, if the task is in Indonesian, the recommendation must be in Indonesian. If English, then English, and so on. The 'quadrant' value must always be one of the specified English enum values.

Respond ONLY with a JSON object matching this TypeScript interface:
\`\`\`typescript
interface AiResponse {
  quadrant: 'DO' | 'SCHEDULE' | 'DELEGATE' | 'DELETE'; // Choose one (always in English)
  recommendation: string; // Brief advice for this task (max 20 words, IN THE LANGUAGE OF THE TASK DESCRIPTION)
}
\`\`\`
Example for an Indonesian task "Selesaikan laporan bulanan":
{ "quadrant": "DO", "recommendation": "Tugas ini kritis dan butuh perhatian segera." }
Example for an English task "Finish monthly report":
{ "quadrant": "DO", "recommendation": "This task is critical and needs immediate attention." }`;

  try {
    // Initialize the model
    const model = ai.getGenerativeModel({ 
      model: GEMINI_MODEL_NAME,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    if (!responseText) {
      throw new Error("Tidak menerima respons teks dari AI");
    }

    const aiResponse = parseJsonFromText<AiCategorizationResponse>(responseText);
    if (!aiResponse || !aiResponse.quadrant || !aiResponse.recommendation) {
      throw new Error("Respons AI tidak memiliki field yang dibutuhkan (quadrant atau recommendation).");
    }
    if (!Object.values(Quadrant).includes(aiResponse.quadrant)) {
      console.error(`Kuadran tidak valid dari AI: ${aiResponse.quadrant}. Valid: ${Object.values(Quadrant)}`);
      // Defaulting or more robust error handling might be needed here.
      // For now, let it throw to indicate a problem with AI's adherence to the schema for 'quadrant'.
      throw new Error(`AI mengembalikan kuadran yang tidak valid: ${aiResponse.quadrant}.`);
    }
    return aiResponse;
  } catch (error) {
    console.error("Kesalahan dalam categorizeTaskWithAI:", error);
    throw error; 
  }
};

export const getTaskAdviceFromAI = async (
  task: Task,
  apiKey: string
): Promise<string> => {
  const ai = getAiClient(apiKey);
  const prompt = `I have a task: "${task.description}" currently in the "${QUADRANT_DEFINITIONS[task.quadrant].title} (${QUADRANT_DEFINITIONS[task.quadrant].description})" quadrant of my Eisenhower Matrix.
My original AI recommendation for it was: "${task.aiRecommendation || 'None provided'}".
As my personal productivity manager, what specific actionable advice (max 30 words) can you give me for handling THIS SPECIFIC task effectively now?
IMPORTANT: Please provide your advice in the SAME language as the task description ("${task.description}"). For example, if the task is in Indonesian, your advice should be in Indonesian.`;

  try {
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Kesalahan dalam getTaskAdviceFromAI:", error);
    throw error; 
  }
};

export const getOverallInsightFromAI = async (
  taskSummary: string, // Task summary is currently generated in English by App.tsx
  apiKey: string
): Promise<string> => {
  const ai = getAiClient(apiKey);
  // The taskSummary contains English quadrant titles but also snippets of actual task descriptions.
  // We'll instruct Gemini to infer the primary language from the task content if possible.
  const prompt = `I'm using the Eisenhower Matrix. Here's a summary of my current tasks:
${taskSummary}

As my personal productivity manager, analyze this task distribution. Provide 1-2 concise (max 50 words in total), actionable productivity tips or observations to help me better manage my time and priorities based on this specific distribution.
IMPORTANT: Try to infer the primary language used in the task descriptions within the summary. Respond in that primary language (e.g., Indonesian if most tasks seem to be in Indonesian). If the language is mixed or unclear, default to English. Focus on balance and effectiveness.`;

  try {
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Kesalahan dalam getOverallInsightFromAI:", error);
    throw error;
  }
};