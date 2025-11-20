import { GoogleGenAI, Type } from "@google/genai";
import { NewGroupResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash";

export const fetchGroupDetails = async (groupName: string): Promise<NewGroupResponse | null> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Provide details for the K-Pop group "${groupName}". If the group doesn't exist or isn't K-Pop, provide generic details for a fictional K-Pop group named "${groupName}". Return a hex color code matching their official colors or vibe.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING, description: "A short, catchy bio about the group (max 150 chars)." },
            themeColor: { type: Type.STRING, description: "A hex color code (e.g. #FF0055)" },
            members: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of member names"
            }
          },
          required: ["name", "description", "themeColor", "members"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as NewGroupResponse;
  } catch (error) {
    console.error("Error fetching group details:", error);
    // Fallback in case of API error
    return {
      name: groupName,
      description: "A rising star in the K-Pop universe.",
      themeColor: "#A855F7",
      members: ["Unknown"]
    };
  }
};

export const generateFanCheer = async (groupName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Write a short, high-energy fan chant/cheer (max 2 sentences) for the K-Pop group "${groupName}". Include emojis.`,
      config: {
        temperature: 0.9,
      }
    });
    return response.text || `Let's go ${groupName}! Fighting! 💖`;
  } catch (error) {
    console.error("Error generating cheer:", error);
    return `We love you ${groupName}! Forever! ✨`;
  }
};
