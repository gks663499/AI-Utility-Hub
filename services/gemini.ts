
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const blogCommenter = async (content: string, type: 'url' | 'text') => {
  const ai = getAI();
  const prompt = type === 'url' 
    ? `Generate 3 contextual, thoughtful, non-spammy blog comments for this URL: ${content}. Make them sound human and engaging.`
    : `Generate 3 contextual, thoughtful, non-spammy blog comments based on this text content: ${content}. Make them sound human and engaging.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text;
};

export const hindiTutorChat = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are an expert Hindi Language Tutor. Help users with grammar, conversation, translation, and pronunciation. Keep responses educational and encouraging. Use Devanagari script alongside transliteration when teaching new words.',
    },
  });
  // Note: Standard chat interface requires history to be passed if using chat.sendMessage, 
  // but for simplicity we'll rebuild context or use session
  const response = await chat.sendMessage({ message });
  return response.text;
};

export const editImageTask = async (imageData: string, task: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: imageData, mimeType: 'image/png' } },
        { text: task }
      ]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const seoAudit = async (url: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Perform a comprehensive SEO audit for the website at ${url}. Provide a structured analysis including a numerical content score (0-100), on-page SEO issues, keyword analysis, meta tag verification, and actionable recommendations.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          onPage: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          metaTags: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['score', 'onPage', 'keywords', 'recommendations']
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateTranscription = async (fileData: string, mimeType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: fileData, mimeType } },
        { text: "Transcribe this audio/video precisely with timestamps for each segment." }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            startTime: { type: Type.STRING },
            endTime: { type: Type.STRING },
            text: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const userTestingFeedback = async (url: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the user experience and usability of the website at ${url}. Provide expert UX feedback and improvement suggestions.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text;
};

export const generateLogoAnimation = async (imageBytes: string) => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: 'Animate this logo into a sleek, professional 3D motion intro with soft lighting and smooth transitions.',
    image: {
      imageBytes,
      mimeType: 'image/png'
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};
