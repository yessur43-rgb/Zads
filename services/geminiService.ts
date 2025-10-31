
import { GoogleGenAI, Type } from "@google/genai";
import { ProductAnalysis, MenuItem, Place } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeProductImage = async (base64Image: string): Promise<ProductAnalysis | null> => {
  const prompt = `
    حلل صورة المنتج هذه. حدد ما إذا كان المنتج "حلال" أو "حرام" أو "مشبوه".
    قدم اسم المنتج، قائمة بالمكونات الرئيسية وحالة كل منها، وشرحاً مفصلاً للسبب.
    إذا أمكن، قدم معلومات صحية موجزة وأي دليل شرعي ذي صلة.
    أجب بصيغة JSON فقط.
  `;
  
  const productAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
      status: { type: Type.STRING, enum: ['حلال', 'حرام', 'مشبوه'] },
      productName: { type: Type.STRING },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['حلال', 'حرام', 'مشبوه'] }
          },
          required: ['name', 'status']
        }
      },
      reasoning: { type: Type.STRING },
      healthInfo: { type: Type.STRING },
      evidence: { type: Type.STRING }
    },
    required: ['status', 'productName', 'ingredients', 'reasoning']
  };

  try {
    // FIX: Per @google/genai guidelines, call ai.models.generateContent directly.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: productAnalysisSchema,
      }
    });
    return JSON.parse(response.text) as ProductAnalysis;
  } catch (error) {
    console.error("Error analyzing product image:", error);
    return null;
  }
};

// FIX: Added function to resolve error in components/MenuAnalyzer.tsx
export const analyzeMenuImage = async (base64Image: string): Promise<MenuItem[] | null> => {
  const prompt = `
    حلل صورة قائمة الطعام هذه. لكل طبق، حدد ما إذا كان "حلال" أو "حرام" أو "مشبوه".
    قدم اسم الطبق، والحالة، وأي ملاحظات مهمة (مثل المكونات المشبوهة).
    أجب بصيغة JSON فقط، على شكل مصفوفة من الكائنات.
  `;

  const menuAnalysisSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        dishName: { type: Type.STRING },
        status: { type: Type.STRING, enum: ['حلال', 'حرام', 'مشبوه'] },
        notes: { type: Type.STRING }
      },
      required: ['dishName', 'status']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: menuAnalysisSchema,
      }
    });
    return JSON.parse(response.text) as MenuItem[];
  } catch (error) {
    console.error("Error analyzing menu image:", error);
    return null;
  }
};

// FIX: Added function to resolve error in components/IngredientGuide.tsx
export const getIngredientInfo = async (query: string): Promise<string | null> => {
  const prompt = `
    قدم شرحاً مفصلاً عن المكون التالي: "${query}".
    وضح مصدره (حيواني، نباتي، صناعي)، وحكمه الشرعي (حلال، حرام، مشبوه) مع ذكر السبب.
    استخدم تنسيق ماركداون بسيط للإجابة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting ingredient info:", error);
    return null;
  }
};

// FIX: Added function to resolve error in components/FindPlaces.tsx
export const findPlacesNearby = async (query: string, location: { lat: number; lon: number }): Promise<Place[] | null> => {
  const prompt = `
    ابحث عن أماكن قريبة بناءً على الاستعلام التالي: "${query}".
    موقعي الحالي هو خط العرض ${location.lat} وخط الطول ${location.lon}.
    أجب بصيغة JSON فقط، على شكل مصفوفة من الكائنات. يجب أن يحتوي كل كائن على الحقول التالية:
    - name: string (اسم المكان)
    - category: string (فئة المكان، مثل "مطعم" أو "مسجد")
    - rating: number (التقييم من 5، إن وجد)
    - distance: string (المسافة من موقعي، مثل "500 متر" أو "1.2 كم")
    - mapsLink: string (رابط خرائط جوجل للمكان)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lon
            }
          }
        }
      },
    });

    const textResponse = response.text.trim();
    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : textResponse;

    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed as Place[] : null;
    } catch (error) {
      console.error("Error parsing places response as JSON:", textResponse, error);
      if (textResponse.includes("لا توجد نتائج") || textResponse.includes("no results")) {
        return [];
      }
      return null;
    }
  } catch (error) {
    console.error("Error finding places nearby:", error);
    return null;
  }
};
