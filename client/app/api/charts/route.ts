/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Get the generative model instance
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp", // Use a fast generative model
});

const generationConfig = {
  temperature: 0.7, // Balanced randomness
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1024, // Adjust for expected JSON length
  responseMimeType: "application/json", // Ensure JSON format
};

export async function GET() {
  try {

   

    const jsonPrompt = `
      Generate a JSON response based that has 5 most occuring and common deadly diseases in the world on daily basis, if you cant calculate then just give randomly the data and it must be in scale of 1-300 not large values
      
      Respond in valid JSON format without extra text. The JSON structure should be:
      
  { disease: "", deaths: 186, recovery rate: 80 },
 more here
]
    `;

    // Generate response
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(jsonPrompt);
    const reResult = result.response.text().replace(/^```json\n?|```$/g, "");
    // Parse JSON response
    const jsonResponse = JSON.parse(reResult);

    return NextResponse.json(jsonResponse, { status: 200 });
  } catch (error) {
    console.error("Error generating JSON:", error);
    return NextResponse.json({ error: "Failed to generate JSON" }, { status: 500 });
  }
}
