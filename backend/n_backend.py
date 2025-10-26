from fastapi import FastAPI, HTTPException, Depends
from database import users_collection
import os
from models.usermodel import UserCreate, UserLogin
from dotenv import load_dotenv
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware

app_10 = FastAPI()

app_10.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)
# Signup
@app_10.post("/signup")
async def signup(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    await users_collection.insert_one({"email": user.email, "password": user.password})
    return {"message": "User registered successfully"}

# Login
@app_10.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or user.password != db_user["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "User Logged in successfully"}
