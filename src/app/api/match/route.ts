import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userProfile, opportunities } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY is not set in .env.local" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an AI career matcher. Compare the following student profile against the list of opportunities scraped from the web.

      Student Profile:
      ${userProfile}

      Scraped Opportunities:
      ${JSON.stringify(opportunities)}

      Task:
      Return a clean JSON array of objects where each object has:
      - "title": string
      - "company": string
      - "matchScore": number (0 to 100 based on skill fit)
      - "rationale": brief 1-sentence summary of why it matches
      - "applyLink": string (from the original data if available)

      Return ONLY the raw JSON array without any markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text || "[]";
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, result: parsedData });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Matching failed" },
      { status: 500 }
    );
  }
}