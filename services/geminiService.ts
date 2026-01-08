
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { GeminiModel } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

const extractHtml = (text: string): string => {
  const codeBlockMatch = text.match(/```html\s*([\s\S]*?)\s*```/i) || text.match(/```\s*([\s\S]*?)\s*```/);
  
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  
  const lowerText = text.toLowerCase();
  const docTypeIndex = lowerText.indexOf('<!doctype');
  if (docTypeIndex !== -1) return text.substring(docTypeIndex).trim();
  
  const htmlTagIndex = lowerText.indexOf('<html');
  if (htmlTagIndex !== -1) return text.substring(htmlTagIndex).trim();

  return text.trim();
};

export const generateTextConcept = async (prompt: string, model: GeminiModel = GeminiModel.FLASH): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      temperature: 0.8,
      topP: 0.95,
      systemInstruction: "You are a world-class creative concept strategist. Expand the user's brief into a detailed, professional concept. Format the output in clean Markdown."
    },
  });
  return response.text || "No response generated.";
};

export const generateHtmlConcept = async (prompt: string, model: GeminiModel = GeminiModel.PRO): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      temperature: 0.3,
      systemInstruction: `You are an expert Frontend Developer. Generate a complete, valid, single-file HTML5 document based on the user's request. 
- Follow W3Schools best practices.
- Include <!DOCTYPE html>, <html>, <head>, and <body>.
- Use internal <style> and <script> tags.
- Use CDNs for libraries like Tailwind CSS if it helps the design.
- Add educational comments to explain sections of the code.
- RETURN ONLY THE CODE.`
    },
  });
  
  return extractHtml(response.text || "");
};

export const refineConcept = async (originalResult: string, instructions: string, type: string, model: GeminiModel = GeminiModel.PRO): Promise<string> => {
  const ai = getAIClient();
  const systemInstruction = type === 'html' 
    ? "You are an expert web developer refining a single-file HTML5 document. Update the existing code based on the new instructions. Return ONLY the complete updated code block. Maintain W3Schools standards and educational comments."
    : "You are a creative strategist refining a concept. Update the existing text based on the new instructions. Maintain a professional, structured markdown format.";

  const prompt = `ORIGINAL CONTENT:\n${originalResult}\n\nREFINEMENT INSTRUCTIONS:\n${instructions}`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      temperature: 0.3,
      systemInstruction: systemInstruction
    },
  });

  const text = response.text || "";
  return type === 'html' ? extractHtml(text) : text;
};

export const analyzeMedia = async (prompt: string, base64Data: string, mimeType: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: GeminiModel.FLASH,
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt || "Analyze this image and describe its core visual concepts, themes, and potential creative applications." }
      ]
    },
  });
  return response.text || "Analysis failed.";
};
