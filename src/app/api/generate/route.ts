import { NextRequest } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const chatCompletion = await getGroqChatCompletion(prompt);
  const articleContent = chatCompletion.choices[0]?.message?.content || "";

  // Generate image using Pollinations API
  const imagePrompt = `Create a professional, high-quality image related to: ${prompt}`;
  const imageUrl = await generateImage(imagePrompt);

  return new Response(
    JSON.stringify({
      content: articleContent,
      imageUrl: imageUrl,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

async function generateImage(prompt: string): Promise<string> {
  const response = await fetch(
    "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt)
  );
  if (!response.ok) {
    throw new Error("Failed to generate image");
  }
  return response.url;
}

export async function getGroqChatCompletion(prompt: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
