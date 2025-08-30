import { GoogleGenAI, Type } from "@google/genai";
import type { StyleOption } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder check. In a real environment, the key would be set.
  // We'll proceed with a mock if the key is not found for local development.
  console.warn("API_KEY environment variable not set. Using mocked data.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock_key" });

const generateMockPrompts = (title: string, style: StyleOption): string[] => {
  return Array.from({ length: 20 }, (_, i) => 
    `Mock prompt ${i + 1} for "${title}" in a ${style.toLowerCase()} style.`
  );
};

export const generateImagePrompts = async (title: string, style: StyleOption): Promise<string[]> => {
  if (!process.env.API_KEY) {
    return new Promise(resolve => setTimeout(() => resolve(generateMockPrompts(title, style)), 2000));
  }
  
  try {
    let systemPrompt = `Based on the song title '${title}' and the artistic style '${style}', generate 20 detailed, imaginative, and visually rich prompts for an AI image generator. Each prompt should be a short, compelling string.`;
        
    if (style === 'Furry') {
      systemPrompt += " The prompts should feature anthropomorphic animal characters in a completely safe-for-work (SFW), non-suggestive, and wholesome context. Avoid any mature or inappropriate themes.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompts: {
              type: Type.ARRAY,
              description: "An array of 20 detailed image prompts.",
              items: {
                type: Type.STRING,
                description: "A single image prompt.",
              },
            },
          },
          required: ["prompts"],
        },
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);
    
    if (parsed && Array.isArray(parsed.prompts)) {
      return parsed.prompts;
    }
    
    return [];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not connect to the AI prompt generator.");
  }
};