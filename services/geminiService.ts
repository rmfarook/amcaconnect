import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const SYSTEM_INSTRUCTION = `
You are a helpful, knowledgeable, and respectful Islamic AI Assistant for a community web portal called "AmcaConnect". 
Your role is to assist users with questions about:
1. Islamic faith, history, and practices (fiqh, hadith, quran).
2. Community events and general guidance.
3. Spiritual advice in a compassionate and moderate tone.

Guidelines:
- Always be polite and use Islamic greetings (e.g., "Assalamu Alaikum") when appropriate.
- Provide references to Quran or Hadith when giving religious answers if possible.
- If a question involves complex legal rulings (Fatwa), advise the user to consult a local scholar or Imam. Do not give binding fatwas yourself.
- Keep answers concise but informative.
- Formatting: Use Markdown for readability.
`;

const getAIClient = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing");
      throw new Error("API Key is missing from environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const initializeChat = (): void => {
  try {
    const ai = getAIClient();
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced creativity and accuracy
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "I am currently unavailable. Please check your connection or API key configuration.";
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: message,
    });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "I encountered an error while processing your request. Please try again later.";
  }
};