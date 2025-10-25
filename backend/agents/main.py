from state import State
from graph import multi_agent_graph

def chat(user_input: str) -> State:
    initial_state = State(input=user_input)
    result = multi_agent_graph.invoke(initial_state)
    return result

if __name__ == "__main__":
    test_inputs = [
        "What are some remedies for anxiety?",
        "I'm feeling really stressed and overwhelmed with exams.",
        "I need someone to talk to right now or a group to join",
        "Where can I find a counselor on campus?",
        "I want to join a group to meet people going through similar stuff.",
        "I want to attempt sucide what to do?"
    ]

    for input_text in test_inputs:
        response_state = chat(input_text)
        print(response_state)