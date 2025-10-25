from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from config import llm
from state import State

def rag_knowledge_agent(state: State) -> State:
    embeddings = OllamaEmbeddings(
        model="nomic-embed-text",
        base_url="http://localhost:11434"
    )

    PERSIST_DIRECTORY = "C:\\Users\\kousi\\Documents\\hackathon\\rag\\vectorstore"
    db = Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embeddings
    )

    query = state.input
    docs = db.similarity_search(query, k=4)
    answer = ''.join(doc.page_content for doc in docs)

    def rewrite(answer):
        prompt = (
            "You are a compassionate assistant. Rewrite the following information to be empathetic, supportive, "
            "and encouraging, ensuring the tone is warm and non-judgmental. Provide practical advice and acknowledge "
            "the user's feelings. Avoid clinical diagnoses. Return only the rewritten text.\n\n"
            f"Original: {answer}\n\n"
            "Rewritten Answer:"
        )
        rewritten_answer = llm.invoke(prompt)
        return rewritten_answer.content if hasattr(rewritten_answer, 'content') else str(rewritten_answer)

    output = rewrite(answer)
    return State(input=state.input, route=state.route, output=output)