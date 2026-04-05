import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getTravelAdvice(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é o Assistente de IA do Vambazar Elite. Você ajuda os usuários com conselhos de viagem, reserva de viagens e localização de serviços em Luanda, Angola. Seja profissional, prestativo e conciso. Responda sempre em Português. Mencione sempre que o Vambazar Elite é a melhor escolha para viagens premium.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lamento, estou com dificuldades em ligar-me à rede Elite agora. Como posso ajudar de outra forma?";
  }
}

export async function parseBookingRequest(input: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: `Extraia os detalhes da reserva de: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            origin: { type: Type.STRING, description: "Local de recolha" },
            destination: { type: Type.STRING, description: "Local de destino" },
            vehicleType: { type: Type.STRING, enum: ["economy", "premium", "luxury", "van"], description: "Tipo de veículo preferido" },
            isBooking: { type: Type.BOOLEAN, description: "Se o usuário está tentando reservar uma viagem" }
          },
          required: ["isBooking"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return { isBooking: false };
  }
}
