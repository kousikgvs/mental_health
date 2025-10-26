import requests
from state import State
from graph import multi_agent_graph

def chat(user_input: str) -> State:
    initial_state = State(input=user_input)
    result = multi_agent_graph.invoke(initial_state)
    return result

def test_api():
    test_inputs = [
        "What are some remedies for anxiety?",
        "I'm feeling really stressed and overwhelmed with exams.",
        "I need someone to talk to right now or a group to join",
        "Where can I find a counselor on campus?",
        "I want to join a group to meet people going through similar stuff.",
        "I want to attempt sucide what to do?"
    ]

    for input_text in test_inputs:
        try:
            response = requests.post(
                "http://localhost:8000/chat",
                json={"user_input": input_text}
            )
            response.raise_for_status()
            print(f"Input: {input_text}")
            print(f"Response: {response.json()}\n")
        except requests.exceptions.RequestException as e:
            print(f"Error testing input '{input_text}': {e}")

if __name__ == "__main__":
    test_api()