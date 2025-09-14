import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

export default function LCAReport() {
  const navigate = useNavigate();

  const [googleNews, setGoogleNews] = useState([]);
  const [newsapiNews, setNewsapiNews] = useState([]);
  const [youtubeNews, setYoutubeNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigateto = (url) => {
    navigate("/summnews", {
      state: {
        url,
      },
    });
  };

  const fetchNews = async () => {
    try {
      const [googleRes, newsapiRes, youtubeRes] = await Promise.all([
        fetch("http://localhost:5000/fetch/google"),
        fetch("http://localhost:5000/fetch/newsapi"),
        fetch("http://localhost:5000/fetch/youtube"),
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
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const renderNewsSection = (title, data) => (
    <div style={{ marginBottom: "32px" }}>
      <h3 style={{ borderBottom: "2px solid #ccc", paddingBottom: "4px" }}>
        {title}
      </h3>
      <ul>
        {data.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "12px" }}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <strong>{item.title}</strong>
            </a>
            <p>{item.summary}</p>
            <small>
              {item.published} | {item.source}
            </small>
            <div
              onClick={() => navigateto(item.link)}
              style={{
                marginTop: "6px",
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              Summarise
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <Header />
      <div style={{ padding: "16px", paddingTop: "100px" }}>
        <h2>Latest News</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {renderNewsSection("Google News", googleNews)}
            {renderNewsSection("NewsAPI", newsapiNews)}
            {renderNewsSection("YouTube", youtubeNews)}
          </>
        )}
      </div>
    </>
  );
}
