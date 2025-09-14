from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain_community.embeddings import OllamaEmbeddings
import os
from dotenv import load_dotenv
# from transformers import T5Tokenizer, T5ForConditionalGeneration
# tokenizer = T5Tokenizer.from_pretrained("t5-small")
# model = T5ForConditionalGeneration.from_pretrained("t5-small")
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


    

def summarize(url="https://www.npr.org/2025/09/13/nx-s1-5506114/why-parents-need-talk-teens-ai-how-to-start-conversation"):
    loader = WebBaseLoader(url)
    docs = loader.load()

    llm = ChatGroq(model_name="llama-3.1-8b-instant", api_key=GROQ_API_KEY)
    prompt = f"""
    You are an expert summarizer. 
    Summarize the following article in clear, concise English, focusing only on the key points.
    Ignore any HTML, navigation menus, ads, or unrelated content.

    Article:
    {docs[0].page_content}
    """

    summary = llm.invoke(prompt)
    
    return summary.content


if __name__=="__main__":
    samarizer=summarize()
    print(samarizer)
