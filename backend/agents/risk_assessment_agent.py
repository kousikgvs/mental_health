from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from dotenv import load_dotenv
import os
from state import State

# Load environment variables
load_dotenv()

def risk_assessment_agent(state: State) -> State:
    if not hasattr(state, 'input') or not hasattr(state, 'route'):
        raise ValueError("State object must have 'input' and 'route' attributes")
    if not state.input or not isinstance(state.input, str):
        raise ValueError("State.input must be a non-empty string")

    email_content = (
        "Subject: Support Needed – Mental Health Check\n\n"
        "Dear Counselor,\n\n"
        "A student has shared the following message indicating potential distress: "
        f"'{state.input}'. They may need your support. Please reach out to them as soon as possible "
        "to offer assistance and ensure their safety. If urgent, consider contacting campus resources "
        "or a crisis hotline (e.g., 988) for immediate support.\n\n"
        "Thank you,\nCampus Support System"
    )

    user_message = (
        "Thank you for sharing. We care about you and want to help. Please reach out to a trusted person, "
        "such as a counselor or friend, or call a crisis hotline like 988 for immediate support."
    )

    sender_email = os.getenv("SENDER_EMAIL", "kousikgvs@gmail.com")
    receiver_email = os.getenv("RECEIVER_EMAIL", "kousikgn@example.com")
    password = os.getenv("APP_PASSWORD")

    if not password:
        print("Error: APP_PASSWORD environment variable not set")
        user_message = (
            f"{user_message} (Note: There was an issue sending an email to a support contact, "
            "but you can still reach out to a hotline or counselor.)"
        )
    else:
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = "Support Needed – Mental Health Check"
        message.attach(MIMEText(email_content, "plain"))

        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(sender_email, password)
                server.sendmail(sender_email, receiver_email, message.as_string())
            print("Email sent successfully!")
        except Exception as e:
            print(f"Error sending email: {e}")
            user_message = (
                f"{user_message} (Note: There was an issue sending an email to a support contact, "
                "but you can still reach out to a hotline or counselor.)"
            )

    print("risk_assessment_agent output:", user_message)
    return type(state)(input=state.input, route=state.route, output=user_message)