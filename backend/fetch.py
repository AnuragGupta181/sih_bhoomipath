from dotenv import load_dotenv
import os
import requests
import feedparser
from bs4 import BeautifulSoup
from urllib.parse import quote_plus

load_dotenv()

NEWS_API = os.getenv("NEWS_API")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


class FetchData:
    """
    Fetch LCA + Metals news from Google News, NewsAPI, and YouTube
    """

    def __init__(self):
        # Default query for metals + environment + LCA
        self.default_query = "life cycle assessment metals OR LCA metals OR environmental impact metals"

    def google(self, query=None, top=5):
        query = query or self.default_query
        query = quote_plus(query) 
        items = []
        url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
        result = feedparser.parse(url)

        for entity in result.entries[:top]:
            item = {
                "title": entity.get("title"),
                "link": entity.get("link"),
                "published": entity.get("published"),
                "summary": BeautifulSoup(entity.get("summary", ""), "html.parser").get_text(),
                "source": entity.get("source", {}).get("title"),
            }
            items.append(item)
        return items

    def newsapi(self, query=None, top=5):
        query = query or self.default_query
        items = []

        url = (
            f"https://newsapi.org/v2/everything?"
            f"q={query}&sortBy=publishedAt&language=en&pageSize={top}&apiKey={NEWS_API}"
        )
        response = requests.get(url).json()

        for article in response.get("articles", []):
            item = {
                "title": article.get("title"),
                "link": article.get("url"),
                "published": article.get("publishedAt"),
                "summary": BeautifulSoup(article.get("description", ""), "html.parser").get_text(),
                "source": article.get("source", {}).get("name"),
            }
            items.append(item)
        return items

    def youtubenews(self, query=None, top=5):
        query = query or self.default_query
        items = []

        url = (
            f"https://www.googleapis.com/youtube/v3/search"
            f"?part=snippet&q={query}&type=video&maxResults={top}&key={YOUTUBE_API_KEY}"
        )
        response = requests.get(url).json()

        for video in response.get("items", []):
            snippet = video.get("snippet", {})
            video_id = video.get("id", {}).get("videoId", "")

            item = {
                "title": snippet.get("title", "").strip(),
                "link": f"https://www.youtube.com/watch?v={video_id}",
                "published": snippet.get("publishedAt"),
                "summary": snippet.get("description", "").strip(),
                "source": snippet.get("channelTitle"),
            }
            items.append(item)

        return items


if __name__ == "__main__":
    f = FetchData()
    print("Google News:", f.google())
    print("NewsAPI:", f.newsapi())
    print("YouTube:", f.youtubenews())
