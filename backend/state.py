from pydantic import BaseModel

class State(BaseModel):
    input: str
    route: str | None = None
    output: str | None = None