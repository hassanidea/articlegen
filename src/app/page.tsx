"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [article, setArticle] = useState<{
    content: string;
    imageUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: document.querySelector("input")?.value || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate article");
      }

      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Generate Article</h1>
        <p>Generate an article with a title, content, and image.</p>
        <input type="text" placeholder="Enter a Prompt" />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {article && (
          <div className="mt-8 max-w-2xl">
            {article.imageUrl && (
              <div className="mb-4">
                <Image
                  src={article.imageUrl}
                  alt="Generated article image"
                  width={800}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="prose">
              {article.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
