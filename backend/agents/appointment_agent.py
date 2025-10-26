from datetime import datetime
from typing import Optional
import json
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain_core.output_parsers import StrOutputParser
from config import llm
from state import State
from backend.n_backend import AppointmentCreate, make_appointment

async def appointment_agent(state: State) -> State:
    email = state.extra.get("email")
    if not email:
        return State(input=state.input, route=state.route, output="❌ User not logged in")

    user_prompt = state.input

    # Create the prompt to extract appointment details
    final_template = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(
            "You are an assistant that helps users book mental health appointments. "
            "Extract the following details from the user's request in JSON format: "
            '{"doctor_name": "...", "specialization": "...", "appointment_date": "...", "notes": "..."}'
        ),
        HumanMessagePromptTemplate.from_template("{user_prompt}")
    ])

    # Call the LLM
    chain = final_template | llm | StrOutputParser()
    result = chain.invoke({"user_prompt": user_prompt})

    output_text = result if isinstance(result, str) else getattr(result, 'content', str(result))

    try:
        # Parse the LLM output as JSON
        appt_data = json.loads(output_text)

        # Convert appointment_date to datetime
        appt_date = datetime.fromisoformat(appt_data["appointment_date"])

        # Create Appointment object
        appt = AppointmentCreate(
            email=email,
            doctor_name=appt_data["doctor_name"],
            specialization=appt_data["specialization"],
            appointment_date=appt_date,
            notes=appt_data.get("notes")
        )

        # Make the appointment
        result = await make_appointment(appt)
        output = f"✅ {result['message']} with Dr. {appt.doctor_name} on {appt.appointment_date.strftime('%Y-%m-%d %H:%M')}"

    except Exception as e:
        output = f"❌ Failed to create appointment: {str(e)}. LLM output: {output_text}"

    return State(input=state.input, route=state.route, output=output)