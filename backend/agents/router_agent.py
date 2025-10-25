from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain_core.output_parsers import StrOutputParser
from config import llm
from state import State
from prompts import router_system_prompt

def router_agent(state: State) -> State:
    user_prompt = state.input
    system_template = SystemMessagePromptTemplate.from_template(router_system_prompt)
    user_template = HumanMessagePromptTemplate.from_template("{user_prompt}")
    final_template = ChatPromptTemplate.from_messages([system_template, user_template])

    chain = final_template | llm | StrOutputParser()
    result = chain.invoke({"system_prompt": router_system_prompt.format(user_prompt=user_prompt), "user_prompt": user_prompt})

    route_map = {
        "RAG": "rag_knowledge_agent",
        "RISK": "risk_assessment_agent",
        "QUERY": "support_chat_agent",
        "PEER": "peer_connector_agent"
    }

    result = result.strip().upper()
    return State(input=state.input, route=route_map[result], output=None)