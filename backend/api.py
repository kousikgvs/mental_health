from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from state import State
from graph import multi_agent_graph
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Mental Health Support Chat API",
    description="API that uses a multi-agent system to provide empathetic mental health support.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the input schema
class ChatRequest(BaseModel):
    user_input: str

# Define the response schema
class ChatResponse(BaseModel):
    route: str | None = None
    output: str | None = None

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Receives user input, runs it through the multi-agent graph, and returns the response.
    """
    try:
        # Create the initial state
        initial_state = State(input=request.user_input)
        
        # Invoke the multi-agent graph
        result = multi_agent_graph.invoke(initial_state)
        
        # Return structured response
        return ChatResponse(
            route=result.route,
            output=result.output
        )

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "Mental Health Support Chat API is running!"}
