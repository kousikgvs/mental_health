from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from state import State
from graph import multi_agent_graph
from typing import Optional

# Initialize FastAPI app
app_1 = FastAPI(title="Mental Health Support API")

# Define request and response models
class ChatRequest(BaseModel):
    user_input: str

class ChatResponse(BaseModel):
    input: str
    route: Optional[str]
    output: Optional[str]

# Chat function (same as provided)
def chat(user_input: str) -> State:
    initial_state = State(input=user_input)
    result = multi_agent_graph.invoke(initial_state)
    return result

# API endpoint
@app_1.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response_state = chat(request.user_input)
        return ChatResponse(
            input=response_state.input,
            route=response_state.route,
            output=response_state.output
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

# Health check endpoint
@app_1.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app_1, host="0.0.0.0", port=8000)