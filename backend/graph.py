from langgraph.graph import StateGraph, START, END
from state import State
from agents.router_agent import router_agent
from agents.rag_knowledge_agent import rag_knowledge_agent
from agents.risk_assessment_agent import risk_assessment_agent
from agents.support_chat_agent import support_chat_agent
from agents.peer_connector_agent import peer_connector_agent

def route_next(state: State):
    return state.route

graph = StateGraph(State)

graph.add_node("router_agent", router_agent)
graph.add_node("rag_knowledge_agent", rag_knowledge_agent)
graph.add_node("risk_assessment_agent", risk_assessment_agent)
graph.add_node("support_chat_agent", support_chat_agent)
graph.add_node("peer_connector_agent", peer_connector_agent)

graph.add_conditional_edges(
    "router_agent",
    route_next,
    {
        "rag_knowledge_agent": "rag_knowledge_agent",
        "risk_assessment_agent": "risk_assessment_agent",
        "support_chat_agent": "support_chat_agent",
        "peer_connector_agent": "peer_connector_agent"
    }
)

graph.add_edge("rag_knowledge_agent", END)
graph.add_edge("risk_assessment_agent", END)
graph.add_edge("support_chat_agent", END)
graph.add_edge("peer_connector_agent", END)

graph.set_entry_point("router_agent")

multi_agent_graph = graph.compile()