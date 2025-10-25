from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain_core.output_parsers import StrOutputParser
from config import llm
from state import State
from prompts import support_chat_system_prompt

def support_chat_agent(state: State) -> State:
    user_prompt = state.input
    final_template = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(support_chat_system_prompt),
        HumanMessagePromptTemplate.from_template("{user_prompt}")
    ])
    chain = final_template | llm | StrOutputParser()
    result = chain.invoke({"system_prompt": support_chat_system_prompt.format(user_prompt=user_prompt), "user_prompt": user_prompt})
    
    output = result if isinstance(result, str) else getattr(result, 'content', str(result))
    return State(input=state.input, route=state.route, output=output)