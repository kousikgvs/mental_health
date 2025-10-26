from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
load_dotenv()
import os
MONGO_URI = os.getenv("Mongo_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["user_db"]
users_collection = db["users"]
