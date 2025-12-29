
import { GoogleGenAI, Type } from "@google/genai";
import { FOOD_DATABASE } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const detectFoodFromText = async (transcript: string) => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Você é um assistente de nutrição brasileira. Sua tarefa é extrair os nomes dos alimentos mencionados em uma frase.
    
    1. Se o alimento já existir na lista oficial abaixo, retorne o "id".
    2. Se o alimento NÃO existir na lista, retorne o "name" extraído (ex: se o usuário disser "eu comi um hambúrguer artesanal", retorne "Hambúrguer Artesanal").
    
    Lista Oficial:
    ${FOOD_DATABASE.map(f => `${f.id}: ${f.name}`).join('\n')}
    
    Retorne sempre um ARRAY de objetos JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Frase do usuário: "${transcript}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "ID se encontrado na lista oficial" },
              name: { type: Type.STRING, description: "Nome do alimento extraído caso não tenha ID" }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
