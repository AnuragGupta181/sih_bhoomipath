import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  ExternalLink,
  Newspaper,
  Play,
  Globe,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import FloatingChatButton from "@/components/FloatingChatButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LCAReport() {
  const [googleNews, setGoogleNews] = useState([]);
  const [newsapiNews, setNewsapiNews] = useState([]);
  const [youtubeNews, setYoutubeNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [loadingSummaries, setLoadingSummaries] = useState({});
  const [summaries, setSummaries] = useState({});
  const [showBreakingNews, setShowBreakingNews] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const [googleRes, newsapiRes, youtubeRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/fetch/google`),
        fetch(`${import.meta.env.VITE_API_URL}/fetch/newsapi`),
        fetch(`${import.meta.env.VITE_API_URL}/fetch/youtube`),
      ]);

      const [googleData, newsapiData, youtubeData] = await Promise.all([
        googleRes.json(),
        newsapiRes.json(),
        youtubeRes.json(),
      ]);

      setGoogleNews(googleData);
      setNewsapiNews(newsapiData);
      setYoutubeNews(youtubeData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setShowBreakingNews(true), 500);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchSummary = async (itemId, url) => {
    setLoadingSummaries((prev) => ({ ...prev, [itemId]: true }));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/model/summarise?url=${encodeURIComponent(url)}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setSummaries((prev) => ({
        ...prev,
        [itemId]: data.summary || "Summary could not be generated.",
      }));
    } catch (err) {
      console.error("Error summarising:", err);
      setSummaries((prev) => ({
        ...prev,
        [itemId]: "Failed to load summary. Please try again.",
      }));
    } finally {
      setLoadingSummaries((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const toggleSummary = (itemId, url) => {
    const isExpanded = expandedSummaries[itemId];
    if (!isExpanded && !summaries[itemId]) {
      fetchSummary(itemId, url);
    }
    setExpandedSummaries((prev) => ({ ...prev, [itemId]: !isExpanded }));
  };

  const getSourceIcon = (source) => {
    if (source === "Google News") return <Globe className="w-5 h-5 text-blue-400" />;
    if (source === "NewsAPI") return <Newspaper className="w-5 h-5 text-blue-400" />;
    if (source === "YouTube") return <Play className="w-5 h-5 text-blue-400" />;
    return <Globe className="w-5 h-5 text-blue-400" />;
  };

  const renderNewsSection = (title, data, sourceType) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {getSourceIcon(title)}
          <h3 className="text-2xl font-bold bhoomi-text-gradient">{title}</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 text-sm text-gray-300">
          {data.length} items
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item, idx) => {
          const itemId = `${sourceType}-${idx}`;
          const isExpanded = expandedSummaries[itemId];
          const isLoadingSummary = loadingSummaries[itemId];

          return (
            <article
              key={itemId}
              className="inline-block bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 mb-8 shadow-md hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors duration-300"
              >
                {item.title}
                <ExternalLink className="w-4 h-4 opacity-60" />
              </a>

              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {item.summary}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.published}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {item.source}
                  </span>
                </div>

                {sourceType === "newsapi" ? (
                  <button
                    onClick={() => toggleSummary(itemId, item.link)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-primary"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isExpanded ? "Hide" : "Summarize"}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <div className="text-xs text-muted-foreground"> </div>
                )}
              </div>

              {sourceType === "newsapi" && isExpanded && (
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  {isLoadingSummary ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Generating AI summary...
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">
                          AI Summary
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {summaries[itemId]}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bhoomi-hero-bg text-foreground">
      <Header />
      {showBreakingNews && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full glass border-white/10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-semibold text-foreground">
              BREAKING NEWS
            </span>
          </div>
        </div>
      )}

      <main className="px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bhoomi-text-gradient">
            Latest News
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest happenings around the world
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[0, 1, 2].map((_, i) => (
              <div
                key={i}
                className="inline-block bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 flex items-center gap-4 animate-slide-in"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="w-12 h-12 rounded-full bhoomi-network-node animate-float" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-3 w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {renderNewsSection("Google News", googleNews, "google")}
            {renderNewsSection("NewsAPI", newsapiNews, "newsapi")}
            {renderNewsSection("YouTube", youtubeNews, "youtube")}
          </div>
        )}
      </main>

      <Footer />
      <FloatingChatButton />
    </div>
  );
}
