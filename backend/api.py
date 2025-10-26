from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from state import State
from graph import multi_agent_graph
from fastapi.middleware.cors import CORSMiddleware

app_2 = FastAPI(
    title="Mental Health Support Chat API",
    description="API that uses a multi-agent system to provide empathetic mental health support.",
    version="1.0.0"
)

app_2.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_input: str

class ChatResponse(BaseModel):
    route: str | None = None
    output: str | None = None

@app_2.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        initial_state = State(input=request.user_input)
        result = multi_agent_graph.invoke(initial_state)
        
        return ChatResponse(
            route=result.get("route"),
            output=result.get("output")
        )

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app_2.get("/")
def root():
    return {"message": "Mental Health Support Chat API is running!"}
