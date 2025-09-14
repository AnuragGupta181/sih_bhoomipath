import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SummarizedNews() {
  const location = useLocation();
  const { url } = location.state || {};

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchSummary = async () => {
    try {
      const res = await fetch(`http://localhost:5000/model/summarise?url=${encodeURIComponent(url)}`);
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
    <div style={{ padding: "20px", paddingTop: "100px" }}>
      <h2>Summarized News</h2>
      {loading ? <p>Loading...</p> : <p>{summary}</p>}
    </div>
  );
}
