import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FloatingChatButton from "@/components/FloatingChatButton";

export default function SummarizedNews() {
  const location = useLocation();
  const { url } = location.state || {};

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/model/summarise?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();
        setSummary(data.summary);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setSummary("Failed to load summary.");
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchSummary();
    }
  }, [url]);

  return (
    <div className="p-6 pt-24 max-w-3xl mx-auto">
      <div className="glass p-6">
        <h2 className="text-2xl font-bold bhoomi-text-gradient mb-4">
          Summarized News
        </h2>

        {loading ? (
          <div className="space-y-3">
            <div
              className="h-4 bg-muted rounded animate-slide-in"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="h-3 bg-muted rounded w-11/12 animate-slide-in"
              style={{ animationDelay: "100ms" }}
            />
            <div
              className="h-3 bg-muted rounded w-10/12 animate-slide-in"
              style={{ animationDelay: "200ms" }}
            />
          </div>
        ) : (
          <p className="text-foreground leading-relaxed">{summary}</p>
        )}
      </div>

      <FloatingChatButton />
    </div>
  );
}
