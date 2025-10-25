from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq

# Load environment variables
load_dotenv()

# Initialize Groq API key and language model
groq_api_key = os.getenv("groq_api_key")
llm = ChatGroq(model_name="llama-3.1-8b-instant", api_key=groq_api_key)