import { TinyFish } from "@tiny-fish/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { targetUrl } = await req.json();

    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "TINYFISH_API_KEY is not set in .env.local" },
        { status: 400 }
      );
    }

    const client = new TinyFish({ apiKey });

    const result = await client.agent.run({
      url: targetUrl || "https://unstop.com/internships",
      goal: "Extract the top active tech internship or hackathon postings. For each, extract: title, company, deadline, and applyLink. Return as a clean structured JSON array.",
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Scraping failed" },
      { status: 500 }
    );
  }
}