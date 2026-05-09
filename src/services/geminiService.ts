import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface PredictionRequest {
  opponent: string;
  venue: string;
  rrForm: string;
  opponentForm: string;
  tossResult?: string;
  includesVaibhav: boolean;
}

export interface PredictionResponse {
  winProbability: number;
  rationale: string[];
  keyMatchups: string;
  oneLineSummary: string;
  confidence: string;
}

export async function predictMatch(data: PredictionRequest): Promise<PredictionResponse> {
  const vaibhavContext = data.includesVaibhav 
    ? "\nConnection to Vaibhav Suryavanshi Analytics: When Vaibhav Suryavanshi is in the playing XI, this agent should explicitly factor him in as a high-ceiling, high-variance opener. His IPL 2025 strike rate of 206.56 over 7 matches makes him a powerplay accelerator; against pace on the up he is particularly threatening, while spin and short-ball plans remain the documented soft spots given the limited sample."
    : "";

  const systemInstruction = `You are an IPL match prediction analyst specialising in Rajasthan Royals. Use head-to-head records, recent form, venue history (especially Sawai Mansingh Stadium, Jaipur), and player availability. Always state your confidence level. Output a JSON object matching the requested schema. Never invent player injuries; ask for clarification in rationale if data is missing.${vaibhavContext}`;

  const prompt = `Predict Result for:
Rajasthan Royals vs ${data.opponent}
Venue: ${data.venue}
RR Recent Form: ${data.rrForm}
Opponent Recent Form: ${data.opponentForm}
Toss Result: ${data.tossResult || 'Unknown'}

Expected JSON Format:
{
  "winProbability": number (0-100),
  "rationale": ["bullet point 1", "bullet point 2", "bullet point 3"],
  "keyMatchups": "Key match-up risks description",
  "oneLineSummary": "One-line prediction summary",
  "confidence": "Low/Medium/High/Very High"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      winProbability: result.winProbability || 50,
      rationale: result.rationale || ["Data insufficient"],
      keyMatchups: result.keyMatchups || "N/A",
      oneLineSummary: result.oneLineSummary || "Could not generate summary",
      confidence: result.confidence || "Unknown",
    };
  } catch (error) {
    console.error("Prediction error:", error);
    throw error;
  }
}
