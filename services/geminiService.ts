import { GoogleGenAI } from "@google/genai";

/**
 * Edits an image using the Gemini 2.5 Flash Image model.
 * 
 * @param base64Image Raw base64 string of the source image.
 * @param mimeType Mime type of the source image (e.g., 'image/jpeg').
 * @param prompt Text instruction for the edit.
 * @returns Promise resolving to the base64 data URL of the result.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Construct the request parts: Image + Text Prompt
  // Gemini 2.5 Flash Image supports "editing" by simply providing the source image and a prompt describing the desired output.
  const parts = [
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    },
    {
      text: prompt,
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
    });

    // 2. Extract the image from the response
    // The model returns a candidate with parts. One of these parts should be the generated image.
    const generatedPart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData
    );

    if (!generatedPart || !generatedPart.inlineData) {
      // Fallback: If no image is returned, check for text to explain why
      const textPart = response.candidates?.[0]?.content?.parts?.find((p) => p.text);
      if (textPart?.text) {
        throw new Error(`Model returned text instead of image: ${textPart.text}`);
      }
      throw new Error("No image data found in the model response.");
    }

    // 3. Construct result Data URL
    const resultMime = generatedPart.inlineData.mimeType || 'image/png';
    const resultBase64 = generatedPart.inlineData.data;

    return `data:${resultMime};base64,${resultBase64}`;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Helper to read file as base64 string (without data: prefix for API usage).
 */
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string; url: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Split "data:image/jpeg;base64,..."
      const [header, base64] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
      resolve({ base64, mimeType, url: result });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};