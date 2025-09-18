from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain_community.embeddings import OllamaEmbeddings
import os
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


def extract_transcript_details(youtube_video_url):
    try:
        videoId = youtube_video_url.split("v=")[1].split("&")[0]
        transcript_text = YouTubeTranscriptApi.get_transcript(videoId)

        transcript = " ".join([i["text"] for i in transcript_text])
        return transcript
    except Exception as e:
        raise e


def summarize(url="https://www.npr.org/2025/09/13/nx-s1-5506114/why-parents-need-talk-teens-ai-how-to-start-conversation"):
    llm = ChatGroq(model_name="llama-3.1-8b-instant", api_key=GROQ_API_KEY)

    # YouTube link check
    if "youtube.com" in url or "youtu.be" in url:
        try:
            transcript = extract_transcript_details(url)
            prompt = f"""
            You are an expert summarizer.
            Summarize the following YouTube transcript in clear, concise English, focusing only on the key points.
            
            Transcript:
            {transcript}
            """
            summary = llm.invoke(prompt)
            return summary.content
        except Exception as e:
            return f"Error extracting transcript: {e}"

    else:
        # Web article summarization
        try:
            loader = WebBaseLoader(url)
            docs = loader.load()
            article = docs[0].page_content

            prompt = f"""
            You are an expert summarizer. 
            Summarize the following article in clear, concise English, focusing only on the key points.
            Ignore any HTML, navigation menus, ads, or unrelated content.

            Article:
            {article}
            """
            summary = llm.invoke(prompt)
            return summary.content
        except Exception as e:
            return f"Error loading article: {e}"


if __name__ == "__main__":
    samarizer = summarize("https://www.youtube.com/watch?v=HFfXvfFe9F8&t=820s")
    print(samarizer)
